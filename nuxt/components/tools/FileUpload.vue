<template>
  <div>
    <!-- Hidden file input triggered by the dropzone click -->
    <input
      type="file"
      ref="fileInput"
      @change="onFileSelect"
      accept=".csv"
      style="display: none"
      multiple
    />

    <!-- Dropzone UI -->
    <div
      :class="['dropzone', { 'dropzone-active': isDragging }]"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <div class="dropzone-prompt">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <span v-if="uploadedFiles.length === 0">Drag & drop your .csv file(s) here, or click to select</span>
        <span v-else>Drag & drop to add more files, or click to select</span>
      </div>
    </div>

    <!-- File List Section -->
    <div v-if="uploadedFiles.length > 0" class="file-list-section">
      <div class="file-list-header">
        <h4>Selected Files ({{ uploadedFiles.length }})</h4>
        <button @click="removeAllFiles" class="clear-all-btn">Clear All</button>
      </div>
      <ul class="file-list">
        <li v-for="file in uploadedFiles" :key="file.name" class="file-list-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span class="file-list-name" :title="file.name">{{ file.name }}</span>
          <button @click.stop="removeFile(file)" class="remove-file-btn">
            &times;
          </button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'files-uploaded', files: File[]): void;
  (e: 'files-cleared'): void;
}>();

const isDragging = ref(false);
const uploadedFiles = ref<File[]>([]); // Use an array to store files
const fileInput = ref<HTMLInputElement | null>(null);

const onDragOver = (e: DragEvent) => {
  // This is necessary to allow dropping
};

const onDragEnter = (e: DragEvent) => {
  isDragging.value = true;
};

const onDragLeave = (e: DragEvent) => {
  isDragging.value = false;
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files) {
    handleFiles(Array.from(files));
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    handleFiles(Array.from(files));
  }
  // Reset input value to allow selecting the same file again
  if (target) {
    target.value = '';
  }
};

/**
 * Adds new files to the list, avoiding duplicates.
 */
const handleFiles = (files: File[]) => {
  const csvFiles = files.filter(file => file.name.endsWith('.csv'));
  
  // Filter out duplicates based on file name
  const newFiles = csvFiles.filter(newFile => 
    !uploadedFiles.value.some(existingFile => existingFile.name === newFile.name)
  );

  if (newFiles.length > 0) {
    uploadedFiles.value = [...uploadedFiles.value, ...newFiles];
    emit('files-uploaded', uploadedFiles.value); // Emit the full, updated list
  }
};

/**
 * Removes a single file from the list.
 */
const removeFile = (fileToRemove: File) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file !== fileToRemove);
  
  if (uploadedFiles.value.length > 0) {
    emit('files-uploaded', uploadedFiles.value); // Emit the new, shorter list
  } else {
    emit('files-cleared'); // Emit cleared if it was the last file
  }
};

/**
 * Clears all files from the list.
 */
const removeAllFiles = () => {
  uploadedFiles.value = [];
  emit('files-cleared');
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<style scoped>
/* Scoped styles for the file uploader */
.dropzone {
  border: 2px dashed #4a5568;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #a0aec0;
  position: relative;
}

.dropzone:hover {
  border-color: white;
  background: var(--background3color);
}

.dropzone-active {
  border-color: white;
  border-style: solid;
  background:var(--background3color);
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(99, 179, 237, 0.5);
}

.dropzone-prompt {
  display: flex;
  pointer-events: none;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* File List Styles */
.file-list-section {
  margin-top: 16px;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.file-list-header h4 {
  margin: 0;
  color: var(--foreground);
  font-size: 0.875rem;
  font-weight: 500;
}

.clear-all-btn {
  background: none;
  border: none;
  color: #c53030;
  font-family: inherit;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.clear-all-btn:hover {
  background-color: rgba(197, 48, 48, 0.2);
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--background2color);
  border-radius: 8px;
}

.file-list-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--background3color);
  color: var(--foregroundsubtle);
}

.file-list-item:last-child {
  border-bottom: none;
}

.file-list-item svg {
  flex-shrink: 0;
  margin-right: 10px;
  color: #a0aec0;
}

.file-list-name {
  flex-grow: 1;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-file-btn {
  background: transparent;
  color:var(--foreground);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  cursor: pointer;
  opacity:0.5;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 10px;
}

.remove-file-btn:hover {
  color: #c53030;
  opacity:1;
}

</style>