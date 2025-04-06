import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SettingsView from '../views/SettingsView.vue';
import TISearch from '../views/TISearch.vue';
import TISourceConfig from '../views/TISourceConfig.vue';
import AIConfig from '../views/AIConfig.vue';
import UserProfile from '../views/UserProfile.vue';
import AppSettings from '../views/AppSettings.vue';
import AboutApp from '../views/AboutApp.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/ti-search' },
    { path: '/ti-search', component: TISearch },
    {path: '/ti-source-config', component: TISourceConfig},
    {path: '/ai-config', component: AIConfig},
    {path: '/user-profile', component: UserProfile},
    {path: '/app-settings', component: AppSettings},
    {path: '/about-app', component: AboutApp},
  ],
});