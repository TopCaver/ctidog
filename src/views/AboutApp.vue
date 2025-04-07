<template>
  <el-container
    style="align-items: center; flex-direction: column; padding: 40px;">
    <el-image style="width: 100px;height: 100px;margin-bottom: 20px;" shape="square" fit="fill" src="/logo.png" />
    <el-card class="info-card">
      <h2 style="margin: 10px 0;">CTIDog 威胁情报助手</h2>
      <p style="color: #888;">版本：v0.0.1</p>
      <el-text>CTIDog 是一个开源的本地应用程序，旨在帮助安全研究人员便捷查询 IP、域名、文件哈希等威胁情报。</el-text>
      <el-text>你可以通过配置情报源和 AI 服务，让威胁分析更高效、智能。</el-text>
    </el-card>
    <el-divider border-style="dashed"></el-divider>
    <el-link href="https://github.com/topcaver/ctidog" target="_blank" type="primary">
      GitHub 仓库
    </el-link>
  </el-container>
</template>

<script lang="ts" setup>
</script>
