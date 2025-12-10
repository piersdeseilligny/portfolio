<template>
  <div class="padder tool-body">
    <ToolHeader name="QTake Metadata CSV Transformer" description="Perform various operations on CSV Files exported from QTake, mainly for improved compatibility with DaVinci Resolve. All processing is performed locally."/>
    <!-- 1. File Upload -->
    <FileUpload @files-uploaded="onFilesReceived" @files-cleared="onFilesCleared" />

    <!-- 2. Preview -->
    <div v-if="originalFiles.length > 0" class="preview-section">
      <div class="preview-header">
        <h3 class="section-title">Preview</h3>
        <select v-if="originalFiles.length > 1" v-model="selectedPreviewFileName" @change="updatePreview" class="preview-select">
          <option v-for="file in originalFiles" :key="file.name" :value="file.name">
            {{ file.name }}
          </option>
        </select>
      </div>

      <!-- Loading/Error State -->
      <div v-if="isPreviewLoading" class="loading-text">Parsing preview...</div>
      <div v-if="parseError" class="warning-section">{{ parseError }}</div>

      <!-- Preview Tables -->
      <div v-if="beforeData.length > 0" class="preview-container">
        <div class="preview-half">
          <h4>Before</h4>
          <CsvPreviewTable :headers="beforeHeaders" :data="beforeData" />
        </div>
        <div class="preview-half">
          <h4>After</h4>
          <CsvPreviewTable
            :headers="afterPreviewHeaders"
            :data="afterPreviewData"
          />
        </div>
      </div>
    </div>

    <!-- 3. Transformations -->
    <div v-if="originalFiles.length > 0" class="transform-section">
      <h3 class="section-title">Transformations</h3>
      <div class="checkbox-wrapper">
        <label class="checkbox-label" for="convertRating">
          <input
            type="checkbox"
            id="convertRating"
            v-model="transforms.convertRating"
            class="checkbox-input"
          />
          <span class="checkbox-styled"></span>
          <div class="checkbox-text">
            <span class="checkbox-title">Convert 'Rating' to 'Comments'</span>
            <span class="checkbox-subtitle"
              >Changes 'Rating' (0, 1, 2, 3, -1) to 'Comments' ("", *, **, ***,
              x)</span
            >
          </div>
        </label>
        <!-- New Inline Warning Icon -->
        <div
          v-if="transformWarnings.convertRating"
          class="warning-icon-wrapper"
          :title="transformWarnings.convertRating"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="warning-icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
      </div>
      <!-- Add more transformation checkboxes here in the future -->
    </div>

    <!-- 4. Process Button -->
    <div v-if="originalFiles.length > 0" class="process-section">
      <button
        @click="processAndDownload"
        :disabled="isProcessing"
        class="process-btn"
      >
        <span>{{ isProcessing ? 'Processing...' : `Process and Download ${originalFiles.length} file(s)` }}</span>
      </button>
    </div>

    <!-- 5. Warnings -->
    <div v-if="warnings.length > 0" class="warning-section">
      <h4 class="warning-title">Processing Warnings</h4>
      <ul class="warning-list">
        <li v-for="(warning, index) in warnings" :key="index">
          {{ warning }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'; // Import computed
import FileUpload from '~/components/tools/FileUpload.vue'
import CsvPreviewTable from '~/components/tools/CsvPreviewTable.vue'
import Papa from 'papaparse';
import ToolHeader from '~/components/ToolHeader.vue';

// --- Reactive State ---

const originalFiles = ref<File[]>([]); // Changed to array
const isProcessing = ref(false);
const warnings = ref<string[]>([]);
const transforms = ref({
  convertRating: true,
});

// --- Preview State ---
const isPreviewLoading = ref(false);
const parseError = ref<string | null>(null);
const beforeHeaders = ref<string[]>([]);
const beforeData = ref<Record<string, string>[]>([]);
const selectedPreviewFileName = ref(''); // For dropdown
const PREVIEW_ROWS = 10;

// --- File Handling ---

const onFilesReceived = (files: File[]) => {
  originalFiles.value = files;
  warnings.value = []; // Clear warnings
  
  if (files.length > 0) {
    selectedPreviewFileName.value = files[0].name;
    generatePreview(files[0]);
  } else {
    onFilesCleared();
  }
};

const onFilesCleared = () => {
  originalFiles.value = [];
  warnings.value = [];
  // Clear preview data
  beforeHeaders.value = [];
  beforeData.value = [];
  parseError.value = null;
  selectedPreviewFileName.value = '';
};

// --- Preview Generation ---

const updatePreview = () => {
  const file = originalFiles.value.find(f => f.name === selectedPreviewFileName.value);
  if (file) {
    generatePreview(file);
  }
};

const generatePreview = (file: File) => {
  isPreviewLoading.value = true;
  parseError.value = null;
  beforeHeaders.value = [];
  beforeData.value = [];

  Papa.parse(file, {
    header: true,
    preview: PREVIEW_ROWS,
    skipEmptyLines: true,
    complete: (results) => {
      beforeHeaders.value = results.meta.fields || [];
      beforeData.value = results.data as Record<string, string>[];
      isPreviewLoading.value = false;
    },
    error: (error) => {
      parseError.value = `Error parsing CSV for preview: ${error.message}`;
      isPreviewLoading.value = false;
    },
  });
};

// --- Transformation Logic ---

/**
 * Maps QTake rating numbers to DaVinci-friendly comment strings.
 */
const mapRatingToComment = (rating: string): string => {
  switch (rating) {
    case '1': return '*';
    case '2': return '**';
    case '3': return '***';
    case '-1': return 'x';
    case '0':
    default: return '';
  }
};

/**
 * Applies all enabled transformations to a single file's data.
 * Returns processed data and any warnings generated during this file's processing.
 */
const applyTransformations = (
  inputData: Record<string, string>[],
  inputFields: string[],
  fileName: string
): { 
  processedData: Record<string, string>[], 
  processedFields: string[], 
  transformWarnings: string[] 
} => {
  
  let data = inputData.map(row => ({ ...row }));
  let fields = [...inputFields];
  const warnings: string[] = [];
  
  // 1. Convert Rating to Comments
  if (transforms.value.convertRating) {
    const ratingHeader = fields.find(f => f.toLowerCase() === 'rating');
    if (ratingHeader) {
      const ratingIndex = fields.indexOf(ratingHeader);
      fields[ratingIndex] = 'Comments';

      data = data.map(row => {
        row['Comments'] = mapRatingToComment(row[ratingHeader]);
        delete row[ratingHeader];
        return row;
      });
    } else {
      // Add a warning for the *final processing*
      warnings.push(`'Rating' column not found in ${fileName}. Skipped 'Convert Rating' transform.`);
    }
  }
  
  return { processedData: data, processedFields: fields, transformWarnings: warnings };
};


// --- Computed Properties for Preview & Warnings ---

const afterPreview = computed(() => {
  let newHeaders = [...beforeHeaders.value];
  let newData = beforeData.value.map((row) => ({ ...row }));

  if (newData.length === 0) {
    return { headers: newHeaders, data: newData };
  }

  // Apply "Convert Rating" transformation
  if (transforms.value.convertRating) {
    const ratingHeader = newHeaders.find((h) => h.toLowerCase() === 'rating');
    if (ratingHeader) {
      const ratingIndex = newHeaders.indexOf(ratingHeader);
      newHeaders[ratingIndex] = 'Comments';
      newData = newData.map((row) => {
        row['Comments'] = mapRatingToComment(row[ratingHeader]);
        delete row[ratingHeader];
        return row;
      });
    }
  }

  return { headers: newHeaders, data: newData };
});

const afterPreviewHeaders = computed(() => afterPreview.value.headers);
const afterPreviewData = computed(() => afterPreview.value.data);

/**
 * Inline warnings based on the *currently previewed* file's headers.
 */
const transformWarnings = computed(() => {
  const warnings: { convertRating: string | null } = {
    convertRating: null
  };
  
  if (beforeData.value.length === 0) return warnings;

  const hasRatingHeader = beforeHeaders.value.some(h => h.toLowerCase() === 'rating');

  if (!hasRatingHeader) {
    warnings.convertRating = "'Rating' column not found in the previewed file.";
  }
  
  return warnings;
});


// --- Main Processing & Download ---

/**
 * Asynchronously parses a single file.
 */
const parseFile = (file: File): Promise<{ data: Record<string, string>[], fields: string[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.meta.fields || results.meta.fields.length === 0) {
          reject(new Error(`Could not detect column headers in ${file.name}.`));
        } else {
          resolve({
            data: results.data as Record<string, string>[],
            fields: results.meta.fields,
          });
        }
      },
      error: (error) => {
        reject(new Error(`Parsing error in ${file.name}: ${error.message}`));
      },
    });
  });
};

/**
 * Processes and downloads all uploaded files sequentially.
 */
const processAndDownload = async () => {
  if (originalFiles.value.length === 0) return;

  isProcessing.value = true;
  warnings.value = []; // Clear main warnings
  
  for (const file of originalFiles.value) {
    try {
      const { data, fields } = await parseFile(file);
      
      const { processedData, processedFields, transformWarnings: processWarnings } = 
        applyTransformations(data, fields, file.name);

      // Add any non-fatal warnings from this file's transform
      warnings.value.push(...processWarnings);
      
      const csvOutput = Papa.unparse(processedData, {
        header: true,
        columns: processedFields,
      });
      
      downloadCsv(csvOutput, file.name || 'processed.csv');
      
      // A small delay to help browsers manage multiple downloads
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error: any) {
      // Add fatal errors (like parsing) to warnings
      warnings.value.push(error.message);
    }
  }
  
  isProcessing.value = false;
};

/**
 * Triggers browser download for a CSV string.
 */
const downloadCsv = (csvString: string, originalFileName: string) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const processedFileName = originalFileName.replace(
    /(\.csv)$/i,
    '-processed.csv'
  );

  link.setAttribute('href', url);
  link.setAttribute('download', processedFileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* Scoped styles for the QTake Processor tool */
.section-title {
    color: var(--foregroundhigh);
    font-size:24px;
    font-weight:500;
  border-bottom: 1px solid #4a5668;
  padding-bottom: 8px;
  margin-bottom: 16px;
}
.tool-body{
  padding-bottom:64px;
}

/* --- Preview Styles --- */
.preview-section {
  margin-top: 24px;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px; /* Replaces margin on section-title */
  border-bottom: 1px solid #4a5668;
}
.preview-header .section-title {
  margin-bottom: 0; /* Remove bottom margin */
  border-bottom: none; /* Remove border */
  padding-bottom: 0;
}
.preview-select {
  background: none;
  color: var(--foreground);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-family: var(--font-primary);
}
.loading-text {
  color: #a0aec0;
  font-style: italic;
  margin-top: 16px;
}
.preview-container {
  display: flex;
  flex-direction: column; /* Stack on mobile by default */
  gap: 24px;
  margin-top: 16px;
}
.preview-half {
  flex: 1;
  min-width: 0; /* Prevents overflow in flexbox */
}
.preview-half h4 {
  font-weight: 600;
  color: #a0aec0;
  margin: 0 0 12px 0;
  font-size: 1rem;
}
/* Responsive layout for side-by-side on larger screens */
@media (min-width: 768px) {
  .preview-container {
    flex-direction: row; /* Side-by-side on desktop */
  }
}

.transform-section {
  margin-top: 24px;
}

.process-section {
  margin-top: 24px;
  text-align: center;
}

.warning-section {
  margin-top: 24px;
  font-size:0.9rem;
  border-radius: 0px;
}

.warning-title {
  color: #fbd38d;
  margin: 0 0 12px 0;
  font-weight: bold;
}

.warning-list {
    color: #fbd38d;
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  opacity: 0.5;
}

.warning-list li + li {
  margin-top: 8px;
}

/* --- Checkbox Styles --- */
.checkbox-wrapper {
  background-color: var(--background2color);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
  border: 1px solid var(--background2color);
  /* New flex properties */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-wrapper:hover {
  border-color: rgba(255,255,255,0.2);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1; /* Allow label to take up space */
}

.checkbox-text {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.checkbox-title {
  font-weight: 600;
  color: #e2e8f0;
}

.checkbox-subtitle {
  font-size: 0.875rem;
  color: #a0aec0;
}

.checkbox-input {
  display: none;
}

.checkbox-styled {
  width: 20px;
  height: 20px;
  background-color: none;
  border: solid 1px var(--foregroundsubtle);
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
}

.checkbox-styled::after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.checkbox-input:checked + .checkbox-styled {
  background: var(--backgroundclick);
}

.checkbox-input:checked + .checkbox-styled::after {
  display: block;
}

/* New Warning Icon Styles */
.warning-icon-wrapper {
  flex-shrink: 0;
  margin-left: 16px;
  cursor: help;
}
.warning-icon {
  color: #fbd38d; /* Orange/Yellow */
}


/* --- Button Styles --- */
.process-btn {
  background: var(--backgroundclick);
  color: white;
  font-family: inherit;
  font-weight: bold;
  font-size: 1rem;
  padding: 12px 24px;
  position:relative;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}
.process-btn::before{
  background-color: black;
  opacity:0.5;
  display:block;
  position:absolute;
  top:1px;
  left:1px;
  right:1px;
  bottom:1px;
  border-radius: 7px;
  content:'';
  z-index:1;
  transition: all 0.2s ease-out;
}
.process-btn>span{
  z-index:2;
  position: relative;
}

.process-btn:hover::before {
  opacity:0.3;
  top:2px;
  left:2px;
  right:2px;
  bottom:2px;
  border-radius: 6px;
}
.process-btn:active::before {
  opacity:0;
  top:2px;
  left:2px;
  right:2px;
  bottom:2px;
  border-radius: 6px;
}

.process-btn:disabled {
  background-color: #4a5668;
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>