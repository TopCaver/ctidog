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
          <!-- <p class="summary-text">{{ summary || '暂无分析数据。' }}</p> -->
          <div class="summary-text markdown-body" v-html="summaryHtml || '暂无分析数据。'"></div>

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
import { WarningFilled, Collection, MagicStick, User, Setting, Search, Warning } from '@element-plus/icons-vue';
import { marked } from 'marked';
import 'github-markdown-css/github-markdown-light.css'
import CtiResultCard from '../components/CtiResultCard.vue';
import { useAIChat } from '../composeables/useAIChat';  


const query = ref('');
const results = ref([]);
const summary = ref('');
const summaryHtml = ref('');

// 获取配置
const STORAGE_CTI_SOURCE_CONFIG = 'ctidog:cti-source-config';
const getCtiSourceConfig = () => {
  const config = localStorage.getItem(STORAGE_CTI_SOURCE_CONFIG);
  console.log('ctiSourceConfig', config);
  return config ? JSON.parse(config) : {};
};

//获取AI
const { generateSummary, loading: aiLoading } = useAIChat()

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
    const ntiResutl = await queryNtiByIP(query.value, ctiSourceConfig.nti.ApiKey);
    resultsList.push({
      source: 'NTI',
      level: ntiResutl.level,
      summary: ntiResutl.summary,
      full: ntiResutl
    });
  }
  // VT查询
  if (ctiSourceConfig.virustotal?.ApiKey) {
    const vtResult = await queryVtByIP(query.value, ctiSourceConfig.virustotal.ApiKey);
    resultsList.push({
      source: 'VirusTotal',
      level: vtResult.level,
      summary: vtResult.summary,
      full: vtResult
    });
  }
  // Kaspersky查询
  if (ctiSourceConfig.kaspersky?.ApiKey) {
    const kasResult = await queryKasperskyByIP(query.value, ctiSourceConfig.kaspersky.ApiKey);
    resultsList.push({
      source: 'Kaspersky OpenTIP',
      level: kasResult.level,
      summary: kasResult.summary,
      full: kasResult.full
    });


    results.value = resultsList;
    console.log('results', results.value);
    // 综合研判结论,
    // TODO：改为AI生成
    summary.value = resultsList.map(r => `${r.source}：${r.level}`).join(' | ');
  };

  // AI综合研判
  if (resultsList.length > 0) {
    const aiSummary = await generateSummary(resultsList);
    summary.value = aiSummary;
    summaryHtml.value = marked(summary.value || '');
  } else {
    summary.value = '暂无分析数据。';
  }
  console.log('综合研判结论', summary.value);
};
  const queryNtiByIP = async (ip: string, apiKey: string) => {
    try {
      const response = await window.CtiDogAPI.queryNtiIp(ip, apiKey);
      if (!response.success) {
        return {
          level: '错误',
          summary: response.message || '查询失败',
          full: {}
        };
      }

      const data = response.data;

      if (data.count === 0 || !Array.isArray(data.objects)) {
        return {
          level: '无威胁',
          summary: '未查询到威胁情报',
          full: data
        };
      }

      // 取第一个对象做摘要展示
      const first = data.objects[0];
      const levelMap = { 1: '低危', 3: '中危', 5: '高危' };
      const summary = `威胁等级：${levelMap[first.threat_level] || '未知'}，置信度：${first.confidence}，类型：${first.categories?.join(',')}`;

      return {
        level: levelMap[first.threat_level] || '未知',
        summary: summary,
        full: data
      };
    } catch (err) {
      console.error('NTI 查询失败', err);
      return {
        level: '错误',
        summary: '查询失败或网络错误',
        full: {}
      };
    }
  };

  const queryVtByIP = async (ip: string, apiKey: string) => {
    const res = await window.CtiDogAPI.queryVtIP(ip, apiKey);
    if (!res.success) {
      return {
        level: '错误',
        summary: res.message || 'VT 查询失败',
        full: {}
      };
    }

    const data = res.data;
    const stats = data.data?.attributes?.last_analysis_stats;
    const summary = stats
      ? `检测结果：${stats.malicious} 恶意 / ${stats.suspicious} 可疑`
      : '无检测数据';

    return {
      level: stats?.malicious > 0 ? '中危' : '无威胁',
      summary: summary,
      full: data
    };
  };

  const queryKasperskyByIP = async (ip: string, apiKey: string) => {
    const res = await window.CtiDogAPI.queryKasperskyIP(ip, apiKey);
    if (!res.success) {
      return {
        level: '错误',
        summary: res.message || 'Kaspersky 查询失败',
        full: {}
      };
    }

    const data = res.data;
    const hits = data?.Hits?.length ?? 0;
    const summary = hits > 0 ? `匹配到 ${hits} 条情报` : '无命中';

    return {
      level: hits > 0 ? '低危' : '无威胁',
      summary: summary,
      full: data
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
.markdown-body {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  line-height: 1.6;
  font-size: 14px;
}
</style>