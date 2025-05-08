<!--
  FileName：BookDetailUnlogged.vue
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：11/04/2025
  Last modified time：08/05/2025
  Module：User side - Unlogged status ebook info page
  Functions：
  1. Display detailed information of an ebook (cover, title, author, category, description);
  2. Provide login entrance for users who are not authenticated;
  3. Show warning alert that login is required for loaning, commenting, and adding to wishlist;
  4. Retrieve ebook data from the backend by ebook_id from route parameters;
  5.Click logo "EBooks" and move to Home page.
-->

<template>
  <div class="book-detail-unlogged">
    <!-- Header -->
    <header class="header">
      <h1 class="logo" @click="$router.push('/')">Ebooks</h1>
      <div class="header-actions">
        <el-button class="login-button" @click="$router.push('/login')">Login</el-button>
        <el-avatar icon="el-icon-user" />
      </div>
    </header>

    <!-- Book info -->
    <div class="book-info">
      <el-image :src="book.coverURL" style="width: 200px; height: 300px;"></el-image>
      <div class="book-meta">
        <h2>{{ book.title }}</h2>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Category:</strong> {{ book.category }}</p>
        <p><strong>Description:</strong> {{ book.description }}</p>
      </div>
    </div>

    <!-- Remind section -->
    <div class="notice">
      <el-alert
        title="Login to borrow, comment, and add to wishlist!"
        type="warning"
        show-icon
      />
    </div>
  </div>
</template>

<script>
/*
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：11/04/2025
  Functions description：
    This script section implements the following logic:
      - fetchBookDetail：Fetch ebook data based on ebook_id from route parameters;
      - Display static ebook details for unlogged users;
      - Provide alert and login navigation functionality;

  Tech Stack:
    - Vue 3 Composition API
    - Element Plus UI library
    - Route parameters passing, Axios asynchronous request
*/
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'; 

import request from '@/utils/request';

export default {
  setup() {
    const router = useRouter(); // Used for programmatic navigation
    const route = useRoute(); // Access current route info
    const book = ref({});// Reactive state for ebook detail

    // fetchBookDetail：Fetch ebook details from backend via ebookId in route
    const fetchBookDetail = async () => {
      try {
        const bookId = route.params.id;
        const res = await request.get(`/ebook/${bookId}`);
        if (res.coverURL) {
          book.value = res;
        } else {
          ElMessage.warning('Book not found or invalid data.');
          await router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch book detail', error);
        ElMessage.error('Failed to load book data.');
        await router.push('/');
      }
    };

    // onMounted lifecycle：Load ebook data after component is mounted
    onMounted(() => {
      fetchBookDetail();
    });

    return {
      book
    };
  }
};
</script>

<style scoped>
.book-detail-unlogged {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-family: 'Lucida Handwriting', serif;
  font-size: 32px;
  color: #00bcd4;
  margin: 0;
  cursor: pointer;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.book-info {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  margin-top: 50px;
  margin-left: 40px;
}

.book-meta {
  flex: 1;
}

.notice {
  margin-top: 20px;
}
</style>
