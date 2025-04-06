<template>
    <el-card class="intel-card" shadow="hover" style="max-width: 480px">
        <template #header>
      <div class="card-header">
        <span>情报源：</span>
        <span>{{ data.source }}</span>
      </div>
    </template>
      <div class="card-row">
        <span>威胁等级：</span>
        <span>{{ data.level }}</span>
      </div>
      <div class="card-row">
        <span>详情：</span>
        <span>{{ data.detail }}</span>
      </div>
    </el-card>
  </template>
  <script setup>
  defineProps({ data: Object });
  </script>
  <style scoped>
  .intel-card {
    /* background-color: #2a2a2a;
    color: #fff;
    border: 1px solid #3a3a3a; */
  }
  .card-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
  </style>