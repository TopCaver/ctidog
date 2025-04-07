<template>
  <el-container >
    <!-- 左侧导航栏 -->
    <el-aside width="60px">
      <el-menu default-active="1" class="el-menu-vertical-demo" collapse=true @open="handleOpen" @close="handleClose">
        <el-menu-item index="1" @click="() => navigate('/cti-search')">
          <el-icon>
            <Search />
          </el-icon>
          <template #title>情报检索</template>
        </el-menu-item>
        <el-menu-item index="2" @click="() => navigate('/cti-source-config')">
          <el-icon>
            <Collection />
          </el-icon>
          <template #title>情报源</template>
        </el-menu-item>
        <el-menu-item index="3" @click="() => navigate('/ai-config')">
          <el-icon>
            <MagicStick />
          </el-icon>
          <template #title>AI</template>
        </el-menu-item>
        <el-menu-item index="4" @click="() => navigate('/user-profile')">
          <el-icon>
            <User />
          </el-icon>
          <template #title>用户</template>
        </el-menu-item>
        <el-menu-item index="5" @click="() => navigate('/app-settings')">
          <el-icon>
            <Setting />
          </el-icon>
          <template #title>设置</template>
        </el-menu-item>
        <el-menu-item index="6" @click="() => navigate('/about-app')">
          <el-icon>
            <Warning />
          </el-icon>
          <template #title>关于</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 右侧内容区域 -->
      <router-view />
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Collection, MagicStick, User, Setting, Search, Warning } from '@element-plus/icons-vue';

import { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric, useRouter } from 'vue-router';
const router = useRouter();
const navigate = (path: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric) => {
  router.push(path);
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

.root-layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}
</style>