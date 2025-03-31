<template>
  <div class="root-layout">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="top-buttons">
        <el-button type="text" :icon="Menu" circle class="icon-button" />
        <el-button type="text" :icon="MagicStick" circle class="icon-button" />
      </div>
      <div class="bottom-buttons">
        <el-button type="text" :icon="User" circle class="icon-button" />
        <el-button type="text" :icon="Setting" circle class="icon-button" />
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-area">
      <!-- 固定搜索栏 -->
      <div class="search-header">
        <el-input v-model="query" placeholder="查询 IP、Domain、HASH" class="search-input" />
        <el-button type="primary" @click="search">查询</el-button>
      </div>

      <!-- 固定综合研判区 -->
      <div class="summary-area">
        <el-icon class="summary-icon">
          <WarningFilled />
        </el-icon>
        <div class="summary-content">
          <strong>综合研判</strong>
          <p class="summary-text">{{ summary || '暂无分析数据。' }}</p>
        </div>
      </div>

      <!-- 滚动内容区域 -->
      <div class="scroll-content">
        <div class="cards">
          <intel-result-card v-for="item in results" :key="item.source" :data="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IntelResultCard from './components/IntelResultCard.vue';
import { WarningFilled, Menu, MagicStick, User, Setting } from '@element-plus/icons-vue';

const query = ref('');
const results = ref([]);
const summary = ref('');

const search = async () => {
  const res = await window.electronAPI.fetchIntel(query.value);
  results.value = res.results;
  summary.value = res.summary;
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.root-layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-color: #1e1e1e;
  color: #fff;
}

.sidebar {
  width: 60px;
  background-color: #2c2c2c;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
  height: 100%-100px;
  align-items: center;
}
.top-buttons, .bottom-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.icon-button :deep(.el-icon) {
  font-size: 24px;
}
.el-button+.el-button {
  /* width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  color: #fff; */
  margin: 0;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background-color: #252526;
  border-bottom: 1px solid #3a3a3a;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
}

.summary-area {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #2e2e2e;
  border-bottom: 1px solid #444;
  flex-shrink: 0;
}

.summary-icon {
  font-size: 36px;
  margin-right: 20px;
  color: #e6a23c;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-text {
  margin: 5px 0 0;
  color: #ccc;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #1e1e1e;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>