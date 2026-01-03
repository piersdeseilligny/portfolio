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
  totalSizeBytes: string;
  hashType: string;         // New Field
  verificationMode: string; // New Field
  status: string;
  failureReason?:string;
  skippedCount:number;
  skippedSizeHuman:string;
  skippedSizeBytes:string;
  errorSummary: ErrorSummary[];
}

// --- State ---

const logs = ref<LogData[]>([]);
const originalFiles = ref<File[]>([]);
const userName = ref('');
const isBusy = ref(false); // Reactive busy state

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

// --- Parsing Logic ---
const parseLogContent = (content: string, fileName: string): LogData | null => {
  const lines = content.split(/\r?\n/);
  
  // Helper for simple Key: Value lookups
  const getVal = (key: string) => lines.find(l => l.startsWith(key))?.split(': ')[1]?.trim() || '';

  const sourcePath = getVal('Source');
  const destPath = getVal('Destination');
  const sourceName = getVal('Source Name') || sourcePath.split('/').pop() || 'Unknown Source';
  const sourceFriendlyName = destPath.split('/').pop() || sourceName;

  const startRaw = getVal('Started');
  const endRaw = getVal('Finished');
  const hashType = getVal('Hash type') || 'Unknown Hash';
  const verificationMode = getVal('Verification mode') || 'Unknown Verification';

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

  // --- CONTEXT-AWARE PARSING START ---
  
  // 1. Transfer Stats (Find the header, then look at the next line for size)
  let totalFiles = 0;
  let totalSizeHuman = '0 KB';
  let totalSizeBytes = '';

  const transferHeaderIdx = lines.findIndex(l => l.startsWith('Total Files Transferred'));
  if (transferHeaderIdx !== -1) {
    totalFiles = parseInt(lines[transferHeaderIdx].split(': ')[1] || '0');
    
    // Check if the very next line is the size (Standard Offshoot Format)
    const nextLine = lines[transferHeaderIdx + 1];
    if (nextLine && nextLine.startsWith('Total Size')) {
       totalSizeHuman = nextLine.split(': ')[1]?.split('(')[0]?.trim() || '0 KB';
       totalSizeBytes = nextLine.match(/\((.*) Bytes\)/)?.[1] || '';
    }
  }

  // 2. Skipped Stats (Find the header, then look at the next line for size)
  let skippedCount = 0;
  let skippedSizeHuman = '';
  let skippedSizeBytes = '';

  const skippedHeaderIdx = lines.findIndex(l => l.startsWith('Total Files already on Destination'));
  if (skippedHeaderIdx !== -1) {
    skippedCount = parseInt(lines[skippedHeaderIdx].split(': ')[1] || '0');

    // Check if the very next line is the size
    const nextLine = lines[skippedHeaderIdx + 1];
    if (nextLine && nextLine.startsWith('Total Size')) {
       skippedSizeHuman = nextLine.split(': ')[1]?.split('(')[0]?.trim() || '';
       skippedSizeBytes = nextLine.match(/\((.*) Bytes\)/)?.[1] || '';
    }
  } else {
    // FALLBACK: If the header is missing (older logs), count the "Status: skipped" lines
    const skippedStartIdx = lines.findIndex(l => l.includes('-- Skipped --'));
    if (skippedStartIdx !== -1) {
      skippedCount = lines.slice(skippedStartIdx).filter(l => l.trim().startsWith('Status:') && l.includes('skipped')).length;
    }
  }
  // --- CONTEXT-AWARE PARSING END ---

  if (totalFiles > longestTotalFiles) longestTotalFiles = totalFiles;
  if (durationSeconds > longestDurationSeconds) longestDurationSeconds = durationSeconds;

  // Status & Failure Reason
  let status = getVal('Status');
  const failureReason = getVal('Reason');

  if (!status && endRaw) status = 'Completed';
  if (!status) status = 'Unknown';
  if (failureReason && status.toLowerCase() === 'failed') {
    status = `Failed (${failureReason})`;
  }

  // Error Summary Logic (Global Reason vs Individual Errors)
  const errorSummary: ErrorSummary[] = [];
  const errorHeaderIndex = lines.findIndex(l => 
    l.includes('-- Not transferred --') || 
    l.includes('-- Could not copy --')
  );

  if (errorHeaderIndex !== -1) {
    const errorSection = lines.slice(errorHeaderIndex + 1);
    
    if (failureReason) {
      // Global Failure: Just count the files involved
      const failedCount = errorSection.filter(l => l.startsWith('#')).length;
      if (failedCount > 0) errorSummary.push({ reason: 'Files not transferred', count: failedCount });
    } else {
      // Individual Errors: Categorize them
      const statusCounts: Record<string, number> = {};
      errorSection.forEach(line => {
        if (line.trim().startsWith('Status:')) {
          let reason = line.replace('Status:', '').trim();
          reason = reason.replace(/^could not copy\s*/i, '').replace(/^not transferred\s*/i, '');
          if (reason.startsWith('(') && reason.endsWith(')')) reason = reason.slice(1, -1);
          if (reason === '') reason = 'Unknown Error';
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
    errorSummary
  };
};

const isFormValid = computed(() => {
  return userName.value.trim() !== '' && logs.value.length > 0;
});

const onFilesReceived = async (files: File[]) => {
  originalFiles.value = files;
  const newLogs: LogData[] = [];
  for (const file of files) {
    const text = await file.text();
    const parsed = parseLogContent(text, file.name);
    if (parsed) newLogs.push(parsed);
  }
  logs.value = newLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

const onFilesCleared = () => {
  logs.value = [];
  originalFiles.value = [];
};

const previewData = computed(() => {
  return logs.value.map(l => ({
    'Date': l.dateStr,
    'Source': l.sourceName,
    'Verified': `${l.verificationMode} (${l.hashType})`,
    'Status': l.status,
    'Files': l.totalFiles.toString(),
    'Size': l.totalSizeHuman
  }));
});

// --- PDF Generation ---

const generatePDF = async () => {
  if (isBusy.value) return;
  isBusy.value = true;

  // Use setTimeout to allow the UI to update (show loading spinner)
  // before the synchronous PDF generation freezes the thread.
  setTimeout(() => {
    try {
      createPdfDocument();
    } catch (e) {
      console.error("PDF Generation failed", e);
      alert("An error occurred while generating the PDF.");
    } finally {
      isBusy.value = false;
    }
  }, 100);
};

const getSettingsString = (verificationMode:string, hashType:string, level:('global'|'date'|'source'|'transfer')) => {
    let explainer = verificationMode.toLowerCase();
    if(verificationMode=="transfer"){
      explainer = ` using file size matching`;
    }
    else if(verificationMode=="source"){
      explainer = ` on the source media using ${hashType} and on the destination media using file size matching`;
    }
    else if(verificationMode=="source & destination"){
      explainer = ` on the source and destination media using ${hashType}`;
    }

    if(level == 'transfer'){
      return `Transfer verified ${explainer}`;
    }
    else{
      return `All files verified ${explainer}`;
    }
  }
// Helper: Check if a list of logs all share the exact same hash/verification settings
const getCommonSettings = (logList: LogData[], level:('global'|'date'|'source'|'transfer')) => {
  if (logList.length === 0) return null;
  const firstHash = logList[0].hashType;
  const firstVer = logList[0].verificationMode.toLowerCase();

  const allSame = logList.every(l => l.hashType === firstHash && l.verificationMode.toLowerCase() === firstVer);

  if(allSame){
    return getSettingsString(firstVer, firstHash, level);
  }

  return null;
};

const createPdfDocument = () => {
  const doc = new jsPDF();
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  const drawIcon = (type: 'source' | 'folder' | 'fingerprint' | 'check', x: number, y: number, size: number = -1) => {
    var oldFontName = doc.getFont().fontName;
    var oldFontStyle = doc.getFont().fontStyle;
    var oldFontSize = doc.getFontSize();
    doc.setFont("materialsymbols");
    if(size != -1) doc.setFontSize(size);
    if (type == 'folder') {
      doc.text(String.fromCodePoint(0xe2c7),x,y);
    }
    else if (type == 'source') {
      doc.text(String.fromCodePoint(0xf80e),x,y);
    }
    else if (type == 'fingerprint') {
      doc.text(String.fromCodePoint(0xe90d),x,y);
    }
    else if(type =='check'){
      doc.text(String.fromCodePoint(0xe5ca),x,y);
    }
    doc.setFont(oldFontName, oldFontStyle);
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

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('Outfit-SemiBold');
  doc.text(`Generated: ${new Date().toLocaleString()} by ${userName.value}`, margin, 26);
  doc.setTextColor(0);

  let currentY = 32;

  // 2. Global Level Consistency Check
  const globalSettings = getCommonSettings(logs.value,'global');
  if (globalSettings) {
    /*
    doc.setFillColor(245, 247, 250); // Light blue-grey
    doc.setDrawColor(220, 220, 230);
    doc.roundedRect(margin, currentY, contentWidth, 10, 1, 1, 'FD');*/
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

  for (const [date, dayLogs] of Object.entries(logsByDate)) {
    if (currentY > 270) { doc.addPage(); currentY = 20; }

    // Date Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('Outfit-SemiBold');
    doc.setTextColor(0);
    doc.text(date, margin + 2, currentY + 5.5);
    currentY += 14;
    // Date Level Consistency Check
    // Only verify if we haven't already established a global setting
    const dateSettings = !globalSettings ? getCommonSettings(dayLogs,'date') : null;
    if (dateSettings) {
      currentY-=2;
      printSettings(dateSettings, margin-1, currentY);
      currentY += 6;
    }

    // 4. Group by Source
    const logsBySource: Record<string, LogData[]> = {};
    dayLogs.forEach(log => {
      if (!logsBySource[log.sourceFriendlyName]) logsBySource[log.sourceFriendlyName] = [];
      logsBySource[log.sourceFriendlyName].push(log);
    });

    for (const [source, sourceLogs] of Object.entries(logsBySource)) {
      if (currentY > 260) { doc.addPage(); currentY = 20; }

      doc.setTextColor(0);
      // Source Header
      drawIcon('source', margin, currentY+1,14);
      doc.setFontSize(11);
      doc.setFont('Outfit-SemiBold');
      doc.text(source, margin + 6, currentY);

      currentY += 6;

      // Source Level Consistency Check
      // Only verify if Global AND Date settings were inconsistent
      const sourceSettings = (!globalSettings && !dateSettings) ? getCommonSettings(sourceLogs,'source') : null;
      if (sourceSettings) {
        currentY-=2;
        printSettings(sourceSettings, margin+1, currentY);
        currentY += 6;
      }

      // 5. Individual Transfers
      sourceLogs.forEach((log, index) => {
        // Calculate block height
        let blockHeight = 12;
        if (log.errorSummary.length > 0) blockHeight += (log.errorSummary.length * 4) + 4;

        // Add extra space if we need to print settings at item level
        const printItemSettings = !globalSettings && !dateSettings && !sourceSettings;
        if (printItemSettings) blockHeight += 4;

        if (currentY + blockHeight > 280) {
          doc.addPage();
          currentY = 20;
        }

        const indent = margin + 5;

        // Line 1: Destination
        doc.setFont('Outfit-SemiBold');
        doc.setFontSize(10);
        doc.setTextColor(0);

        const destinationPathArray = log.destinationPath.split('/');
        if (destinationPathArray.length > 1) {
          doc.text('/' + destinationPathArray[1] + '/', indent + 5, currentY);
          doc.setTextColor(150);
          doc.text(destinationPathArray.slice(2).join('/'), indent + 5 + doc.getTextWidth('/' + destinationPathArray[1] + '/'), currentY);
        } else {
          doc.text(log.destinationPath, indent + 5, currentY);
        }

        // Status
        doc.setFont('Outfit-SemiBold');
        const isSuccess = ['completed', 'verified', 'success'].includes(log.status.toLowerCase().split(' ')[0]);
        // Red for failure, Green/Black for success
        doc.setTextColor(isSuccess ? 0 : 200, isSuccess ? 150 : 0, 0); 
        
        // Use the status we formatted in the parser (e.g. "Failed (Source connection lost)")
        doc.text(log.status, pageWidth - margin, currentY + 0.5, { align: 'right' });

        currentY += 4;

        // Line 2: Metrics
        doc.setFont('Outfit-Regular');
        doc.setFontSize(9);
        doc.setTextColor(0);

        const dataIndent = indent + 5;
        let cursorX = dataIndent;

        // Time
        const timeStr = `${log.startTime} > ${log.endTime}`;
        doc.text(timeStr, cursorX, currentY);
        cursorX += doc.getTextWidth("99:99:99 > 99:99:99 ");

        // Duration
        doc.setTextColor(150);
        doc.text(`(${formatDuration(log.durationSeconds)})`, cursorX, currentY);
        cursorX += doc.getTextWidth(`${formatDuration(longestDurationSeconds)}`) + 3;
        doc.setTextColor(0);

        separator(cursorX, currentY);
        cursorX += 4;

        // Files
        doc.text(`${log.totalFiles} Files`, cursorX, currentY);
        cursorX += doc.getTextWidth(`${longestTotalFiles} Files`) + 3;

        separator(cursorX, currentY);
        cursorX += 4;

        // Size
        doc.text(log.totalSizeHuman, cursorX, currentY);
        cursorX += doc.getTextWidth(log.totalSizeHuman) + 3;

        if (log.totalSizeBytes) {
          doc.setTextColor(150);
          doc.text(`(${log.totalSizeBytes} B)`, cursorX, currentY);
          doc.setTextColor(0);
        }

        //Line 3: Skipped
        if (log.skippedCount > 0) {
            currentY+=4;
            doc.setTextColor(150);
            const skippedText = `${log.skippedCount} Skipped (${log.skippedSizeHuman})`;
            doc.text(skippedText, dataIndent, currentY);
        }

        currentY += 4;

        // Line 4: Item Level Settings (if needed)
        if (printItemSettings) {
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(getSettingsString(log.verificationMode.toLowerCase(),log.hashType,'transfer'), dataIndent, currentY);
          currentY += 4;
        }

        // Error Block
if (log.errorSummary.length > 0) {
          currentY += 2;
          doc.setFont('Outfit-Regular');
          doc.setFontSize(9);
          doc.setTextColor(180, 0, 0);
          
          log.errorSummary.forEach(err => {
            // This will now print "• 201x Files not transferred" 
            // OR "• 1x Checksum Mismatch" depending on the mode
            doc.text(`• ${err.count}x ${err.reason}`, dataIndent, currentY);
            currentY += 4;
          });
          doc.setTextColor(0);
        }

        currentY += 3;

        // Divider
        if (index < sourceLogs.length - 1) {
          doc.setDrawColor(230);
          doc.line(indent, currentY - 4, pageWidth - margin, currentY - 2);
          currentY += 2;
        } else {
          currentY += 2;
        }
      });

      currentY += 2;
    }
  }
  setTimeout(() => {
  doc.save(`DIT_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  });
};
</script>