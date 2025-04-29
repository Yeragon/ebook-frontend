// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 引入各个页面
import Home from '@/views/Home.vue';
import HomeLogged from '@/views/HomeLogged.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import BookDetail from '@/views/BookDetail.vue';
import BookDetailUnlogged from '@/views/BookDetailUnlogged.vue';
import MyAccount from '@/views/MyAccount.vue';
import Wishlist from '@/views/Wishlist.vue';
import DueSoon from '@/views/DueSoon.vue';
import OnLoan from '@/views/OnLoan.vue';
import Category from '@/views/Category.vue';
import EditPage from '@/views/EditPage.vue';
import BookList from '@/views/BookList.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/dashboard', name: 'HomeLogged', component: HomeLogged },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/resetpassword', name: 'ResetPassword', component: ResetPassword },
  { path: '/bookdetail/:id', name: 'BookDetail', component: BookDetail },
  { path: '/bookdetailunlogged/:id', name: 'BookDetailUnlogged', component: BookDetailUnlogged },
  { path: '/myaccount', name: 'MyAccount', component: MyAccount },
  { path: '/wishlist', name: 'Wishlist', component: Wishlist },
  { path: '/duesoon', name: 'DueSoon', component: DueSoon },
  { path: '/onloan', name: 'OnLoan', component: OnLoan },
  { path: '/category/:name', name: 'Category', component: Category },
  { path: '/editpage', name: 'EditPage', component: EditPage },
  { path: '/booklist/:keyword', name: 'BookList', component: BookList },
  // 兜底处理：访问不存在的路径，自动跳转回首页
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
