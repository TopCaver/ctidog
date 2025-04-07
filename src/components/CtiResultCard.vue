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
      <span>摘要：</span>
      <span>{{ data.summary }}</span>
    </div>
  </el-card>
  <el-dialog v-model="dialogVisible" :title="data.source + ' - 情报详情'" width="600px">
    <pre>{{ JSON.stringify(data.full, null, 2) }}</pre>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue';
defineProps({ data: Object });
const dialogVisible = ref(false);
</script>
<style scoped>
.card-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
</style>