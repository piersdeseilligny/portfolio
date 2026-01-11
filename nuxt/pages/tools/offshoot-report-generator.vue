<template>
  <div class="padder tool-body container">
    <ToolHeader flipid="offshootreport" :link="{ path: '/tools' }" name="OffShoot Report Generator"
      description="Generate DIT Report PDFs from any number of OffShoot log files. All processing is performed locally in your browser." />

    <FileUpload @files-uploaded="onFilesReceived" @files-cleared="onFilesCleared" accept=".txt"
      prompt-first="Drag & drop your .txt log(s) here" prompt-subsequent="Add more .txt logs" />
    <GenericInput type="text" v-model="userName" :required="true" label="Full Name" subtext="" />
    <div v-if="logs.length > 0" class="my-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">Loaded {{ logs.length }} Transfer Logs</h3>
        <ProcessButton @click="generatePDF" :is-busy="isBusy" :action-text="`Generate PDF`"
          processing-text="Generating..." />
      </div>

      <PreviewTable :headers="['Date', 'Source', 'Destination', 'Status', 'Files', 'Size']" :data="previewData" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import jsPDF from 'jspdf';
import ToolHeader from '~/components/ToolHeader.vue';
import FileUpload from '~/components/tools/FileUpload.vue';
import PreviewTable from '~/components/tools/PreviewTable.vue';
import ProcessButton from '~/components/tools/ProcessButton.vue';
import GenericInput from '~/components/tools/GenericInput.vue';
import '~/pdffonts/Oswald-SemiBold-normal';
import '~/pdffonts/Outfit-Regular-normal';
import '~/pdffonts/Outfit-SemiBold-normal';
import '~/pdffonts/materialsymbols-normal';
//https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,GRAD@20,400,0&icon_names=check,docs,error,fingerprint,folder,hard_drive,sd_card,warning&display=block


// --- Interfaces ---

interface ErrorSummary {
  reason: string;
  count: number;
}

interface LogData {
  fileName: string;
  sourceName: string;
  sourceFriendlyName: string;
  sourcePath: string;
  destinationPath: string;
  dateStr: string;
  timestamp: Date;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  totalFiles: number;
  totalSizeHuman: string;
  totalSizeBytesString: string;
  totalSizeBytes: number; // Changed to number for easier summing
  hashType: string;
  verificationMode?: string;
  status: string;
  failureReason?: string;
  skippedCount: number;
  skippedSizeHuman: string;
  skippedSizeBytes: number; // Changed to number
  skippedSizeBytesString:string;
  errorSummary: ErrorSummary[];
  sourcePathList: string[];
}

// --- State ---

const logs = ref<LogData[]>([]);
const originalFiles = ref<File[]>([]);
const userName = ref('');
const isBusy = ref(false);

let longestTotalFiles: number = 0;
let longestDurationSeconds: number = 0;


// --- Helpers ---

const formatDuration = (totalSeconds: number): string => {
  if (isNaN(totalSeconds)) return '0s';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1000; // Offshoot uses 1000 (10^3) not 1024 (2^10) usually, adjust if needed
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// --- Parsing Logic ---
const parseLogContent = (content: string, fileName: string): LogData | null => {
  const lines = content.split(/\r?\n/);
  
  // EDGE CASE FIX 1: Strict Helper
  // We explicitly check for the colon to avoid 'Source' matching 'Source Name'
const getVal = (key: string) => {
    const line = lines.find(l => l.startsWith(key + ':'));
    if (!line) return '';
    // Split by the first colon only, then join the rest back together 
    // (in case the value has colons too, like "12:00:00" or "C:/Path")
    const parts = line.split(':');
    return parts.slice(1).join(':').trim();
  };

  // EDGE CASE FIX 2: Handle "Source" vs "Sources"
// EDGE CASE FIX: Handle "Source" vs "Sources"
  const sourcePathList: string[] = [];
  
  // 1. Try single source
  const singleSource = getVal('Source');
  if (singleSource) {
    sourcePathList.push(singleSource);
  } else {
    // 2. Try multiple sources block
    const sourcesHeaderIdx = lines.findIndex(l => l.startsWith('Sources:'));
    if (sourcesHeaderIdx !== -1) {
      for (let i = sourcesHeaderIdx + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        // Stop at next section
        if (line.includes(':') && !line.startsWith('-')) break; 
        
        if (line.startsWith('-')) {
          sourcePathList.push(line.replace(/^-\s*/, '').trim());
        }
      }
    }
  }

  // Fallback / Flattening for Sorting Keys
  let sourcePath = sourcePathList.length > 0 ? sourcePathList.join(', ') : 'Unknown Source';

  const destPath = getVal('Destination');
  
  // Logic: "Source Name" is the drive/card name. 
  // "Friendly Name" is the destination folder (Project/Mag Name).
  const sourceName = getVal('Source Name') || sourcePath.split('/').pop() || 'Unknown Source';
  
  // If Source Name is generic (e.g. "2 folders"), fallback to the destination folder name immediately
  const isGenericSource = sourceName.match(/^\d+ folders$/i);
  const sourceFriendlyName = destPath.split('/').pop() || (isGenericSource ? 'Unknown Source' : sourceName);
  const startRaw = getVal('Started');
  const endRaw = getVal('Finished');
  const hashType = getVal('Hash type') || 'Unknown Hash';
  const verificationMode = getVal('Verification mode') || 'Unknown';

  let dateStr = 'Unknown Date';
  let timestamp = new Date();
  if (startRaw) {
    const [datePart, timePart] = startRaw.split(', ');
    if (datePart && timePart) {
      const [d, m, y] = datePart.split('/');
      timestamp = new Date(`${y}-${m}-${d}T${timePart}`);
      dateStr = `${d}/${m}/${y}`;
    }
  }

  const durationRaw = getVal('Duration');
  const durationSeconds = parseFloat(durationRaw?.split(' ')[0] || '0');

  // --- CONTEXT-AWARE PARSING ---
  
  // 1. Transfer Stats
  let totalFiles = 0;
  let totalSizeHuman = '0 KB';
  let totalSizeBytes = 0;
  let totalSizeBytesString = "";
  const transferHeaderIdx = lines.findIndex(l => l.startsWith('Total Files Transferred'));
  if (transferHeaderIdx !== -1) {
    totalFiles = parseInt(lines[transferHeaderIdx].split(': ')[1] || '0');
    const nextLine = lines[transferHeaderIdx + 1];
    if (nextLine && nextLine.startsWith('Total Size')) {
       totalSizeHuman = nextLine.split(': ')[1]?.split('(')[0]?.trim() || '0 KB';
       const bytesStr = nextLine.match(/\((.*) Bytes\)/)?.[1] || '0';
       totalSizeBytesString = bytesStr;
       totalSizeBytes = parseInt(bytesStr);
    }
  }

  // 2. Skipped Stats
  let skippedCount = 0;
  let skippedSizeHuman = '';
  let skippedSizeBytes = 0;
  let skippedSizeBytesString = '';

  const skippedHeaderIdx = lines.findIndex(l => l.startsWith('Total Files already on Destination'));
  if (skippedHeaderIdx !== -1) {
    skippedCount = parseInt(lines[skippedHeaderIdx].split(': ')[1] || '0');
    const nextLine = lines[skippedHeaderIdx + 1];
    if (nextLine && nextLine.startsWith('Total Size')) {
       skippedSizeHuman = nextLine.split(': ')[1]?.split('(')[0]?.trim() || '';
       const bytesStr = nextLine.match(/\((.*) Bytes\)/)?.[1] || '0';
       skippedSizeBytesString = bytesStr;
       skippedSizeBytes = parseInt(bytesStr);
    }
  } else {
    // Fallback for older logs
    const skippedStartIdx = lines.findIndex(l => l.includes('-- Skipped --'));
    if (skippedStartIdx !== -1) {
      skippedCount = lines.slice(skippedStartIdx).filter(l => l.trim().startsWith('Status:') && l.includes('skipped')).length;
    }
  }
  if (totalFiles > longestTotalFiles) longestTotalFiles = totalFiles;
  if (durationSeconds > longestDurationSeconds) longestDurationSeconds = durationSeconds;

  // Status & Failure
  let status = getVal('Status');
  const failureReason = getVal('Reason');

  if (!status && endRaw) status = 'Completed';
  if (!status) status = 'Unknown';
  if (failureReason && status?.toLowerCase() === 'failed') {
    status = `Failed (${failureReason})`;
  }

  // Error Summary
  const errorSummary: ErrorSummary[] = [];
  const errorHeaderIndex = lines.findIndex(l => l.includes('-- Not transferred --') || l.includes('-- Could not copy --'));

  if (errorHeaderIndex !== -1) {
    const errorSection = lines.slice(errorHeaderIndex + 1);
    if (failureReason) {
      const failedCount = errorSection.filter(l => l.startsWith('#')).length;
      if (failedCount > 0) errorSummary.push({ reason: 'Files not transferred', count: failedCount });
    } else {
      const statusCounts: Record<string, number> = {};
      errorSection.forEach(line => {
        if (line.trim().startsWith('Status:')) {
          let reason = line.replace('Status:', '').trim()
             .replace(/^could not copy\s*/i, '')
             .replace(/^not transferred\s*/i, '');
          if (reason.startsWith('(') && reason.endsWith(')')) reason = reason.slice(1, -1);
          if (!reason) reason = 'Unknown Error';
          statusCounts[reason] = (statusCounts[reason] || 0) + 1;
        }
      });
      for (const [reason, count] of Object.entries(statusCounts)) {
        errorSummary.push({ reason, count });
      }
    }
  }

  return {
    fileName,
    sourceName,
    sourceFriendlyName,
    sourcePath,
    destinationPath: destPath,
    dateStr,
    timestamp,
    startTime: startRaw.split(', ')[1] || '',
    endTime: endRaw.split(', ')[1] || '',
    durationSeconds,
    totalFiles,
    totalSizeHuman,
    totalSizeBytes,
    skippedCount,
    skippedSizeHuman,
    skippedSizeBytes,
    status,
    failureReason, 
    hashType,
    verificationMode,
    errorSummary,
    skippedSizeBytesString,
    totalSizeBytesString,
    sourcePathList
  };
};

// --- Sorting & Handling ---

const onFilesReceived = async (files: File[]) => {
  originalFiles.value = files;
  const newLogs: LogData[] = [];
  for (const file of files) {
    const text = await file.text();
    const parsed = parseLogContent(text, file.name);
    if (parsed) newLogs.push(parsed);
  }

  logs.value = newLogs.sort((a, b) => {
    // 1. Date (Day)
    const dateA = new Date(a.timestamp).setHours(0, 0, 0, 0);
    const dateB = new Date(b.timestamp).setHours(0, 0, 0, 0);
    if (dateA !== dateB) return dateA - dateB;

    // 2. Friendly Name (Mag Name)
    if (a.sourceFriendlyName < b.sourceFriendlyName) return -1;
    if (a.sourceFriendlyName > b.sourceFriendlyName) return 1;

    // 3. Source Path (To distinguish same Mag Name from different cards)
    if (a.sourcePath < b.sourcePath) return -1;
    if (a.sourcePath > b.sourcePath) return 1;

    // 4. Destination Path (Retry grouping)
    if (a.destinationPath < b.destinationPath) return -1;
    if (a.destinationPath > b.destinationPath) return 1;

    // 5. Time
    return a.timestamp.getTime() - b.timestamp.getTime();
  });
};
const onFilesCleared = () => {
  logs.value = [];
  originalFiles.value = [];
};

const previewData = computed(() => {
  return logs.value.map(l => ({
    'Date': l.dateStr,
    'Source': l.sourceFriendlyName, // Showing Mag Name in preview
    'Verified': `${l.verificationMode}`,
    'Status': l.status,
    'Files': l.totalFiles.toString(),
    'Size': l.totalSizeHuman
  }));
});

// --- PDF Generation ---

// Helper for strings
const getSettingsString = (verificationMode:(string|undefined), hashType:string, level:('global'|'date'|'source'|'transfer')) => {
  if(verificationMode==undefined) return undefined;  
  let explainer = verificationMode?.toLowerCase();

    if(verificationMode=="transfer") explainer = `using file size matching`;
    else if(verificationMode=="source") explainer = `on source (${hashType}) & dest (size)`;
    else if(verificationMode.includes("source & destination")) explainer = `on source & dest using ${hashType}`;
    else if(verificationMode=="unknown") return "Unknown verification method";
    return level == 'transfer' ? `Transfer verified${explainer}` : `All files verified ${explainer}`;
}

const getCommonSettings = (logList: LogData[], level:('global'|'date'|'source'|'transfer')) => {
  if (logList.length === 0) return null;
  const firstHash = logList[0].hashType;
  const firstVer = logList[0].verificationMode?.toLowerCase();
  const allSame = logList.every(l => l.hashType === firstHash && l.verificationMode?.toLowerCase() === firstVer);
  return allSame ? getSettingsString(firstVer, firstHash, level) : null;
};

const generatePDF = async () => {
  if (isBusy.value) return;
  isBusy.value = true;
  setTimeout(() => {
    try { createPdfDocument(); } 
    catch (e) { console.error(e); alert("PDF Error"); } 
    finally { isBusy.value = false; }
  }, 100);
};

const createPdfDocument = () => {
  const doc = new jsPDF();
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  // --- Icon Helper ---
  const drawIcon = (type: string, x: number, y: number, size: number = -1) => {
    var oldFont = doc.getFont();
    var oldFontSize = doc.getFontSize();
    doc.setFont("materialsymbols");
    if(size != -1) doc.setFontSize(size);
    const map: Record<string, string> = { 
        folder: '\ue2c7', source: '\uf80e', fingerprint: '\ue90d', check: '\ue5ca', 
        warning: '\ue002', sd_card: '\ue623' 
    };
    if(map[type]) doc.text(map[type], x, y);
    doc.setFont(oldFont.fontName, oldFont.fontStyle);
    doc.setFontSize(oldFontSize);
  };

  const separator = (x: number, y: number) => {
    doc.setTextColor(200);
    doc.text('|', x, y);
    doc.setTextColor(0);
  };

  // 1. Header
  doc.setFontSize(18);
  doc.setFont('Oswald-SemiBold');
  doc.text("Data Transfer Report", margin, 20);

  // Totals Calculation
  const grandTotalFiles = logs.value.reduce((acc, l) => acc + l.totalFiles, 0);
  const grandTotalBytes = logs.value.reduce((acc, l) => acc + l.totalSizeBytes, 0);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('Outfit-SemiBold');
  const dateStr = `Generated: ${new Date().toLocaleString()} by ${userName.value}`;
  doc.text(dateStr, margin, 26);
  
  // --- NEW: TOTALS LINE ---
  doc.setTextColor(50);
  doc.text(`Total Transferred: ${grandTotalFiles} Files (${formatBytes(grandTotalBytes)})`, margin, 31);
  doc.setTextColor(0);

  let currentY = 38;

  // 2. Global Check
  const globalSettings = getCommonSettings(logs.value,'global');
  if (globalSettings) {
    printSettings(globalSettings, margin, currentY);
    currentY += 2;
  }
  currentY += 5;
function printSettings(settingDesc:string, xPos:number, yPos:number){
    doc.setFont('Outfit-SemiBold');
    doc.setFontSize(9);
    doc.setTextColor(120);
    drawIcon('check', xPos, yPos+1.25, 14);
    doc.text(settingDesc, xPos + 5, yPos);
  }

  // 3. Group by Date
  const logsByDate: Record<string, LogData[]> = {};
  logs.value.forEach(log => {
    if (!logsByDate[log.dateStr]) logsByDate[log.dateStr] = [];
    logsByDate[log.dateStr].push(log);
  });
  
  // Sort Dates
  const sortedDates = Object.keys(logsByDate).sort((a, b) => {
    if(a === 'Unknown Date') return 1;
    if(b === 'Unknown Date') return -1;
    const [d1, m1, y1] = a.split('/').map(Number);
    const [d2, m2, y2] = b.split('/').map(Number);
    return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
  });

  for (const date of sortedDates) {
    const dayLogs = logsByDate[date];
    if (currentY > 270) { doc.addPage(); currentY = 20; }

    // Date Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('Outfit-SemiBold');
    doc.setTextColor(0);
    doc.text(date, margin + 2, currentY + 5.5);
    currentY += 14;

    const dateSettings = !globalSettings ? getCommonSettings(dayLogs,'date') : null;
    if (dateSettings) {
      currentY -= 2;
      printSettings(dateSettings, margin-1, currentY);
      currentY += 6;
    }

    // 4. Group by Source (Composite Key: FriendlyName + RealPath)
    const logsBySource: Record<string, LogData[]> = {};
    dayLogs.forEach(log => {
      // Key includes path to differentiate same-named cards from different slots
      const key = `${log.sourceFriendlyName}::${log.sourcePath}`;
      if (!logsBySource[key]) logsBySource[key] = [];
      logsBySource[key].push(log);
    });

    // Sort Sources Alphabetically by Name
    const sortedSourceKeys = Object.keys(logsBySource).sort();

    for (const sourceKey of sortedSourceKeys) {
      const sourceLogs = logsBySource[sourceKey];
      const friendlyName = sourceLogs[0].sourceFriendlyName;
      const realPath = sourceLogs[0].sourcePath;
      
      if (currentY > 260) { doc.addPage(); currentY = 20; }

      // Source Header
      doc.setTextColor(0);
      drawIcon('source', margin, currentY+1, 14);
      doc.setFontSize(11);
      doc.setFont('Outfit-SemiBold');
      doc.text(friendlyName, margin + 6, currentY); // e.g. "A002"

      // --- NEW: Sub-label if Real Path differs from Friendly Name ---
      // Logic: If friendly name is "A002" but path is "/Volumes/Untitled", show path.
      // If path is "/Volumes/A002", we don't need to show it.
// 2. Logic for displaying real paths
      const paths = sourceLogs[0].sourcePathList || [];
      const isMulti = paths.length > 1;
      const isSingleAndDistinct = paths.length === 1 && paths[0].split('/').pop() !== friendlyName && friendlyName !== 'Unknown Source';

      if (isMulti) {
          // --- MULTIPLE SOURCES (Vertical List) ---
          doc.setFontSize(8);
          doc.setTextColor(150);
          
          const maxDisplay = 10;
          const displayCount = Math.min(paths.length, maxDisplay);
          
          currentY += 4; // Move to next line below header

          for(let i=0; i < displayCount; i++) {
              if (currentY > 280) { doc.addPage(); currentY = 20; }
              doc.text(`${paths[i]}`, margin + 6, currentY);
              currentY += 3.5;
          }

          if (paths.length > maxDisplay) {
              if (currentY > 280) { doc.addPage(); currentY = 20; }
              doc.setFont('Outfit-SemiBold'); // Bold the summary
              doc.text(`(+ ${paths.length - maxDisplay} more sources)`, margin + 6, currentY);
              doc.setFont('Outfit-Regular'); // Reset
              currentY += 3.5;
          }
          currentY += 2; // Gap before transfers start

      } else if (isSingleAndDistinct) {
          // --- SINGLE SOURCE (Inline) ---
          doc.setFontSize(8);
          doc.setTextColor(150);
          
          // Truncate if absurdly long
          let displayPath = paths[0];
          if (displayPath.length > 90) displayPath = displayPath.substring(0, 87) + '...';
          
          doc.text(`(${displayPath})`, margin + 6 + doc.getTextWidth(friendlyName) + 2, currentY);
          currentY += 6; // Standard gap

      } else {
          // --- NO PATH DISPLAY ---
          currentY += 6; // Standard gap
      }

      const sourceSettings = (!globalSettings && !dateSettings) ? getCommonSettings(sourceLogs,'source') : null;
      if (sourceSettings) {
        currentY-=2;
        printSettings(sourceSettings, margin+1, currentY);
        currentY += 6;
      }

      // 5. Individual Transfers
      let lastDestPath = '';
      
      sourceLogs.forEach((log, index) => {
        const isRetry = log.destinationPath === lastDestPath;
        lastDestPath = log.destinationPath;

        let blockHeight = 12;
        if (log.errorSummary.length > 0) blockHeight += (log.errorSummary.length * 4) + 4;
        if (log.skippedCount > 0) blockHeight += 4; // Extra line for skipped
        const printItemSettings = !globalSettings && !dateSettings && !sourceSettings;
        if (printItemSettings) blockHeight += 4;

        if (currentY + blockHeight > 280) {
          doc.addPage();
          currentY = 20;
          lastDestPath = ''; 
        }

        const indent = margin + 5;
        
        // DESTINATION
        doc.setFont('Outfit-SemiBold');
        doc.setFontSize(10);
        doc.setTextColor(0);
        if (isRetry) {
          doc.setTextColor(150);
          doc.text(log.destinationPath, indent + 5, currentY);
        } else {
          const arr = log.destinationPath.split('/');
          if (arr.length > 1) {
            doc.text('/' + arr[1] + '/', indent + 5, currentY);
            doc.setTextColor(150);
            doc.text(arr.slice(2).join('/'), indent + 5 + doc.getTextWidth('/' + arr[1] + '/'), currentY);
          } else {
            doc.text(log.destinationPath, indent + 5, currentY);
          }
        }

        // STATUS
        doc.setFont('Outfit-SemiBold');
        const isSuccess = ['completed', 'verified', 'success'].includes(log.status?.toLowerCase().split(' ')[0]);
        doc.setTextColor(isSuccess ? 0 : 200, isSuccess ? 150 : 0, 0); 
        doc.text(log.status, pageWidth - margin, currentY + 0.5, { align: 'right' });

        currentY += 4;

        // METRICS
        doc.setFont('Outfit-Regular');
        doc.setFontSize(9);
        doc.setTextColor(0);

        const dataIndent = indent + 5;
        let cursorX = dataIndent;

        const timeStr = `${log.startTime} > ${log.endTime}`;
        doc.text(timeStr, cursorX, currentY);
        cursorX += doc.getTextWidth("99:99:99 > 99:99:99 ");

        doc.setTextColor(150);
        doc.text(`(${formatDuration(log.durationSeconds)})`, cursorX, currentY);
        cursorX += doc.getTextWidth(`(99h 99m 99s)`) + 2;
        doc.setTextColor(0);

        separator(cursorX, currentY);
        cursorX += 4;

        doc.text(`${log.totalFiles} Files`, cursorX, currentY);
        cursorX += doc.getTextWidth(`${longestTotalFiles} Files`) + 3;

        separator(cursorX, currentY);
        cursorX += 4;

        doc.text(log.totalSizeHuman, cursorX, currentY);
                cursorX += doc.getTextWidth(log.totalSizeHuman) + 3;

        if (log.totalSizeBytes) {
          doc.setTextColor(150);
          doc.text(`(${log.totalSizeBytes} B)`, cursorX, currentY);
          doc.setTextColor(0);
        }
        //Line 3: Skipped

        if (log.skippedCount > 0) {
          currentY += 4;
          doc.setTextColor(150);
            let skippedText = `${log.skippedCount} Skipped`;
            if (log.skippedSizeHuman) skippedText += ` (${log.skippedSizeHuman})`;

            if (isSuccess) {
               // --- NEW: CLEARER VERBIAGE ---
               const totalEffective = log.totalFiles + log.skippedCount;
               skippedText = `${log.skippedCount} Skipped (Total Verified on Disk: ${totalEffective})`;
               doc.setTextColor(0, 150, 0); 
            }

            doc.text(skippedText, indent + 5, currentY);
            

        }
        currentY += 4;

        // SETTINGS (Item Level)
        if (printItemSettings) {
          var itemSettings = getSettingsString(log.verificationMode?.toLowerCase(),log.hashType,'transfer');
          if(itemSettings){
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(itemSettings, indent + 5, currentY);
            currentY += 4;
          }
          else{
            console.error("Tried to print item settings, but there are none:")
            console.error(log);
          }
        }

        // ERRORS
        if (log.errorSummary.length > 0) {
          doc.setFont('Outfit-Regular'); doc.setFontSize(9); doc.setTextColor(180, 0, 0);
          log.errorSummary.forEach(err => {
            doc.text(`${err.count}x ${err.reason}`, indent + 5, currentY);
            currentY += 4;
          });
          doc.setTextColor(0);
        }

        currentY += 3;

        // Divider
        const nextLog = sourceLogs[index + 1];
        const isNextSame = nextLog && nextLog.destinationPath === log.destinationPath;

        if (!isNextSame && index < sourceLogs.length - 1) {
          doc.setDrawColor(230);
          doc.line(indent, currentY - 4, pageWidth - margin, currentY - 2);
          currentY += 2;
        } else {
          currentY += 0; // Smaller gap for retries
        }
      });
      currentY += 2;
    }
  }
  doc.save(`DIT_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
</script>