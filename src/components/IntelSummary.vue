<template>
    <el-alert type="warning" :title="summary" show-icon class="summary-alert" />
  </template>
  <script setup>
  defineProps({ summary: String });
  </script>
  <style scoped>
  .summary-alert {
    background-color: #3a3a3a;
    color: #ffd700;
    border-color: #ffcc00;
  }
  </style>