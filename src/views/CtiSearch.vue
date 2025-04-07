<template>
  <el-container style="height: 100%">
    <el-header>
      <!-- 头部搜索栏 -->
      <div class="search-header">
        <el-input v-model="query" :autofocus="true" :clearable="true" @change="search" size="large"
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
      <!-- 情报源返回的数据详情 -->
      <el-scrollbar height="100%">
        <div class="cards">
          <CtiResultCard v-for="item in results" :key="item.source" :data="item" />
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CtiResultCard from '../components/CtiResultCard.vue';
import { WarningFilled, Collection, MagicStick, User, Setting, Search, Warning } from '@element-plus/icons-vue';

const query = ref('');
const results = ref([]);
const summary = ref('');

// 获取配置
const STORAGE_CTI_SOURCE_CONFIG = 'ctidog:cti-source-config';
const getCtiSourceConfig = () => {
  const config = localStorage.getItem(STORAGE_CTI_SOURCE_CONFIG);
  console.log('ctiSourceConfig', config);
  return config ? JSON.parse(config) : {};
};

// 搜索情报
const search = async () => {
  const ctiSourceConfig = getCtiSourceConfig();
  if (!ctiSourceConfig) {
    alert('请先配置情报源');
    return;
  }

  if (!query.value) {
    alert('请输入查询内容');
    return;
  }

  const resultsList = []
  // 查询NTI
  if (ctiSourceConfig.nti?.ApiKey) {
    const ntiResutl = await mockNtiQuery(query.value, ctiSourceConfig.nti.ApiKey);
    resultsList.push({
      source: 'NTI',
      level: ntiResutl.level,
      summary: ntiResutl.summary,
      full: ntiResutl
    });
  }
  // 模拟VT查询
  if (ctiSourceConfig.virustotal?.ApiKey) {
    const vtResult = await mockVtQuery(query.value, ctiSourceConfig.virustotal.apiKey);
    resultsList.push({
      source: 'VirusTotal',
      level: vtResult.level,
      summary: vtResult.summary,
      full: vtResult
    });
  }

  results.value = resultsList;
  console.log('results', results.value);
  // 综合研判结论,
  // TODO：改为AI生成
  summary.value = resultsList.map(r => `${r.source}：${r.level}`).join(' | ');
};
// 模拟查询函数（可替换为真实 API 请求）
const mockNtiQuery = async (q:string, key:string) => {
  return {
    level: '中危',
    summary: `NTI 情报摘要：${q}`,
    data: {
      related_ips: ['1.1.1.1', '8.8.8.8'],
      tags: ['APT', '僵尸网络']
    }
  };
};

const mockVtQuery = async (q, key) => {
  return {
    level: '低危',
    summary: `VT 情报摘要：${q}`,
    data: {
      detections: 3,
      last_seen: '2024-03-01'
    }
  };
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