<!-- src/views/BookDetailUnlogged.vue -->
<template>
  <div class="book-detail-unlogged">
    <!-- 顶部栏 -->
    <div class="header">
      <h1 class="logo" @click="$router.push('/')">Ebooks</h1>
      <el-button type="primary" @click="$router.push('/login')">Login</el-button>
    </div>

    <!-- 书籍详情 -->
    <div class="book-info">
      <el-image :src="book.coverURL" style="width: 200px; height: 300px;"></el-image>
      <div class="book-meta">
        <h2>{{ book.title }}</h2>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Category:</strong> {{ book.category }}</p>
        <p><strong>Description:</strong> {{ book.description }}</p>
      </div>
    </div>

    <!-- 提示栏 -->
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import request from '@/utils/request';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const book = ref({});

    const fetchBookDetail = async () => {
      try {
        const bookId = route.params.id;
        const res = await request.get(`/ebook/${bookId}`);
        book.value = res.data || {};
      } catch (error) {
        console.error('Failed to fetch book detail', error);
      }
    };

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
  margin-bottom: 30px;
}

.logo {
  color: #00bcd4;
  font-family: 'Lucida Handwriting', cursive;
  font-size: 32px;
  cursor: pointer;
}

.book-info {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.book-meta {
  flex: 1;
}

.notice {
  margin-top: 20px;
}
</style>
