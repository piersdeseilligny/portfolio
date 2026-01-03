<template>
  <div class="padder tool-body container">
    <ToolHeader flipid="qtake-csv" name="QTake Metadata CSV Transformer" description="Perform various operations on CSV Files exported from QTake, mainly for improved compatibility with DaVinci Resolve. All processing is performed locally."/>
    
    <FileUpload @files-uploaded="onFilesReceived" @files-cleared="onFilesCleared" accept=".csv" prompt-first="Drag & drop your .csv file(s) here, or click to select" prompt-subsequent="Drag & drop to add more .csv files, or click to select"/>

    <div v-if="originalFiles.length > 0" class="preview-section">
      <div class="preview-header">
        <h3 class="section-title">Preview</h3>
        <select v-if="originalFiles.length > 1" v-model="selectedPreviewFileName" @change="updatePreview" class="preview-select">
          <option v-for="file in originalFiles" :key="file.name" :value="file.name">
            {{ file.name }}
          </option>
        </select>
      </div>

      <div v-if="isPreviewLoading" class="loading-text">Parsing preview...</div>
      <div v-if="parseError" class="warning-section">{{ parseError }}</div>

      <div v-if="beforeData.length > 0" class="preview-container">
        <div class="preview-half">
          <h4>Before</h4>
          <PreviewTable :headers="beforeHeaders" :data="beforeData" />
        </div>
        <div class="preview-half">
          <h4>After</h4>
          <PreviewTable
            :headers="afterPreviewHeaders"
            :data="afterPreviewData"
          />
        </div>
      </div>
    </div>

    <div v-if="originalFiles.length > 0" class="transform-section">
      <h3 class="section-title">Transformations</h3>
      
      <GenericInput
        type="checkbox"
        v-model="transforms.convertRating"
        label="Convert 'Rating' to 'Comments'"
        subtext="Changes 'Rating' (0, 1, 2, 3, -1) to 'Comments' ('', *, **, ***, x)"
        :warning="transformWarnings.convertRating"
      />
      
      </div>

    <div v-if="originalFiles.length > 0" class="process-section">
      <ProcessButton @click="processAndDownload" :is-busy="isProcessing" :action-text="`Process and Download ${originalFiles.length} file(s)`" processing-text="Processing..." />
    </div>

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
import { ref, computed } from 'vue';
import FileUpload from '~/components/tools/FileUpload.vue'
import PreviewTable from '~/components/tools/PreviewTable.vue'
import Papa from 'papaparse';
import ToolHeader from '~/components/ToolHeader.vue';
import ProcessButton from '~/components/tools/ProcessButton.vue';
// Import the new component (Adjust path based on where you save it)
import GenericInput from '~/components/tools/GenericInput.vue'; 

// --- Reactive State ---

const originalFiles = ref<File[]>([]);
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
const selectedPreviewFileName = ref(''); 
const PREVIEW_ROWS = 10;

// --- File Handling ---

const onFilesReceived = (files: File[]) => {
  originalFiles.value = files;
  warnings.value = []; 
  
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
      console.log(results.data);
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

const processAndDownload = async () => {
  if (originalFiles.value.length === 0) return;

  isProcessing.value = true;
  warnings.value = []; 
  
  for (const file of originalFiles.value) {
    try {
      const { data, fields } = await parseFile(file);
      
      const { processedData, processedFields, transformWarnings: processWarnings } = 
        applyTransformations(data, fields, file.name);

      warnings.value.push(...processWarnings);
      
      const csvOutput = Papa.unparse(processedData, {
        header: true,
        columns: processedFields,
      });
      
      downloadCsv(csvOutput, file.name || 'processed.csv');
      
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error: any) {
      warnings.value.push(error.message);
    }
  }
  
  isProcessing.value = false;
};

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

/* --- Preview Styles --- */
.preview-section {
  margin-top: 24px;
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px; 
  border-bottom: 1px solid #4a5668;
}
.preview-header .section-title {
  margin-bottom: 0; 
  border-bottom: none; 
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
  flex-direction: column; 
  gap: 24px;
  margin-top: 16px;
}
.preview-half {
  flex: 1;
  min-width: 0; 
}
.preview-half h4 {
  font-weight: 600;
  color: #a0aec0;
  margin: 0 0 12px 0;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .preview-container {
    flex-direction: row; 
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

/* REMOVED: Old checkbox styles (checkbox-wrapper, checkbox-label, etc.) 
   are now inside GenericInput.vue 
*/

</style>