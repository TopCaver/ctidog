<template>
    <el-container style="height: 100%">
    <el-header>
        <!-- 头部搜索栏 -->
        <div class="search-header">
          <el-input v-model="query" autofocus=true clearable=true @change="search" size="large"
            placeholder="查询 IP、Domain、HASH" :suffix-icon="Search" />
        </div>

      </el-header>
      <el-main>
        <!-- 综合研判结论 -->
        <div class="summary-area">
          <el-card style="width: 100%">
            <template #header>
              <div class="card-header">
                <span>综合研判</span>
              </div>
            </template>
            <el-icon class="summary-icon">
              <WarningFilled />
            </el-icon>
            <p class="summary-text">{{ summary || '暂无分析数据。' }}</p>
          </el-card>
        </div>
        <!-- 情报源详情 -->
        <el-scrollbar height="100%">
          <div class="cards">
            <intel-result-card v-for="item in results" :key="item.source" :data="item" />
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue';
import IntelResultCard from '../components/IntelResultCard.vue';
import { WarningFilled, Collection, MagicStick, User, Setting, Search, Warning } from '@element-plus/icons-vue';

const query = ref('');
const results = ref([]);
const summary = ref('');

// 搜索情报
const search = async () => {
  const res = await window.electronAPI.fetchIntel(query.value);
  results.value = res.results;
  summary.value = res.summary;
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>