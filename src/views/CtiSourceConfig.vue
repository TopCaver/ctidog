<template>
  <el-container style="height: 100%">
    <el-header>
      <!-- 头部标题 -->
      情报源配置
    </el-header>
    <el-main>
      <!-- 情报源配置列表 -->
      <el-scrollbar height="100%">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="NTI" name="1">
            <el-form :model="cti_source_config.nti" label-width="auto" style="max-width: 600px">
              <el-form-item label="NTI API Key">
                <el-input v-model="cti_source_config.nti.ApiKey" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="Kaspersky OpenTIP" name="2">
            <el-form :model="cti_source_config.kaspersky" label-width="auto" style="max-width: 600px">
              <el-form-item label="Kaspersky API Key">
                <el-input v-model="cti_source_config.kaspersky.ApiKey" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="Virus Total" name="3">
            <el-form :model="cti_source_config.virustotal" label-width="auto" style="max-width: 600px">
              <el-form-item label="VirusTotal API Key">
                <el-input v-model="cti_source_config.virustotal.ApiKey" />
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
const ntiConfigForm = reactive({
  ApiKey: ''
})

const STORAGE_CTI_SOURCE_CONFIG = 'ctidog:cti-source-config'

const cti_source_config = reactive({
  nti: {
    ApiKey: ''
  },
  kaspersky: {
    ApiKey: ''
  },
  virustotal: {
    ApiKey: ''
  }
})

// 进入时读取配置
onMounted(() => {
  const savedCtiSourceConfig = localStorage.getItem(STORAGE_CTI_SOURCE_CONFIG) || '{}'
  if (savedCtiSourceConfig) {
    const parsedConfig = JSON.parse(savedCtiSourceConfig)
    cti_source_config.nti.ApiKey = parsedConfig.nti?.ApiKey || ''
    cti_source_config.kaspersky.ApiKey = parsedConfig.kaspersky?.ApiKey || ''
    cti_source_config.virustotal.ApiKey = parsedConfig.virustotal?.ApiKey || ''
  }
})

// 离开页面时保存配置
onBeforeUnmount(() => {
  localStorage.setItem(STORAGE_CTI_SOURCE_CONFIG, JSON.stringify(cti_source_config))
  console.log('保存配置:', cti_source_config)
})

</script>