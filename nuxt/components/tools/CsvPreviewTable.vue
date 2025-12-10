<template>
  <div class="table-wrapper">
    <table class="csv-table">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="header in headers" :key="`${rowIndex}-${header}`">
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[];
  data: Record<string, string>[];
}>();
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto; /* Allows horizontal scrolling for wide tables */
  max-height: 400px; /* Limit height and allow vertical scroll if needed */
  overflow-y: auto;
  background-color: var(--background3color);
  border: 1px solid #4a5568;
  border-radius: 8px;
}

.csv-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--foregroundsubtle);
}

.csv-table th,
.csv-table td {
    padding: 6px 12px;
    text-align: left;
    white-space: nowrap;
    font-size: 0.75rem;
}

.csv-table th {
  background-color: var(--background2color);
  color: var(--foregroundhigh);
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1; /* Ensures header stays on top when scrolling */
}

.csv-table tbody tr:nth-child(even) {
  background-color: var(--background2color); /* Slightly different shade for zebra striping */
}
</style>