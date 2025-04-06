<template>
    <div class="config-form">
        <el-form label-position="top" :model="config">
            <el-form-item label="API Key">
                <el-input v-model="config.apiKey" placeholder="请输入 NTI API Key" />
            </el-form-item>
            <el-form-item label="IP 查询接口 URL">
                <el-input v-model="config.ipUrl" placeholder="例如 https://api.nti.com/ip" />
            </el-form-item>
            <el-form-item label="域名查询接口 URL">
                <el-input v-model="config.domainUrl" placeholder="例如 https://api.nti.com/domain" />
            </el-form-item>
            <el-form-item label="文件 Hash 查询接口 URL">
                <el-input v-model="config.hashUrl" placeholder="例如 https://api.nti.com/hash" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
defineProps({ config: Object });
defineEmits(['update:config']);</script>

<style scoped>
.config-form {
    padding: 10px 0;
}
</style>