import { createRouter, createWebHashHistory } from 'vue-router';
import CtiSearch from '../views/CtiSearch.vue';
import CtiSourceConfig from '../views/CtiSourceConfig.vue';
import AIConfig from '../views/AIConfig.vue';
import UserProfile from '../views/UserProfile.vue';
import AppSettings from '../views/AppSettings.vue';
import AboutApp from '../views/AboutApp.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/cti-search' },
    { path: '/cti-search', component: CtiSearch },
    {path: '/cti-source-config', component: CtiSourceConfig},
    {path: '/ai-config', component: AIConfig},
    {path: '/user-profile', component: UserProfile},
    {path: '/app-settings', component: AppSettings},
    {path: '/about-app', component: AboutApp},
  ],
});