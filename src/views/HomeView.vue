<template>
    <div class="query-container">
      <div class="search-bar">
        <el-input v-model="query" placeholder="输入 IP、域名 或 Hash" class="input" />
        <el-button type="primary" @click="search">查询</el-button>
      </div>
  
      <intel-summary v-if="summary" :summary="summary" class="summary-block" />
      <div class="result-list">
        <intel-result-card v-for="item in results" :key="item.source" :data="item" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import IntelResultCard from '../components/IntelResultCard.vue';
  import IntelSummary from '../components/IntelSummary.vue';
  
  const query = ref('');
  const results = ref([]);
  const summary = ref('');
  
  const search = async () => {
    const response = await window.electronAPI.fetchIntel(query.value);
    results.value = response.results;
    summary.value = response.summary;
  };
  </script>
  
  <style scoped>
  .query-container {
    max-width: 900px;
    margin: 0 auto;
    color: #ddd;
  }
  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
  }
  .input {
    flex: 1;
  }
  .summary-block {
    margin-bottom: 20px;
  }
  .result-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  </style>