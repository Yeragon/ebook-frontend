// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Introduce each page
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
import BookListUnlogged from '@/views/BookListUnlogged.vue';
import TopUp from '@/views/TopUp.vue';


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
  { path: '/booklistunlogged/:keyword', name: 'BookListUnlogged', component: BookListUnlogged },
  // Fallback handling: When accessing a non-existent path, it will automatically redirect back to the home page
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/topup', name: 'TopUp', component: TopUp },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
