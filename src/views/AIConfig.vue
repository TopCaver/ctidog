<template>
  <el-container style="height: 100%">
    <el-header>
      <!-- 头部标题 -->
      AI / LLM 配置
    </el-header>
    <el-main>
      <!-- 情报源配置列表 -->
      <el-scrollbar height="100%">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="Deepseek" name="1">
            <el-form :model="ai_config.deepseek" label-width="auto" style="max-width: 600px">
              <el-form-item label="Deepseek API Key">
                <el-input v-model="ai_config.deepseek.api_key" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import type { CollapseModelValue } from 'element-plus'

const activeNames = ref(['1'])

const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}

const STORAGE_AI_CONFIG = 'ctidog:ai-config'

const ai_config = reactive({
  deepseek: {
    api_key: '',
    base_url: '',
    model: '',
    temperature: 1
  }  
})

// 进入时读取配置
onMounted(() => {
  const savedAiConfig = localStorage.getItem(STORAGE_AI_CONFIG) || '{}'
  if (savedAiConfig) {
    const parsedConfig = JSON.parse(savedAiConfig)
    ai_config.deepseek.api_key = parsedConfig.deepseek?.api_key || ''
  }
})

// 离开页面时保存配置
onBeforeUnmount(() => {
  localStorage.setItem(STORAGE_AI_CONFIG, JSON.stringify(ai_config))
  console.log('保存AI配置:', ai_config)
})

</script>