<!-- src/views/BookDetailUnlogged.vue -->
<template>
  <div class="book-detail-unlogged">
    <!-- 顶部栏 -->
    <header class="header">
      <h1 class="logo" @click="$router.push('/')">Ebooks</h1>
      <div class="header-actions">
        <el-button class="login-button" @click="$router.push('/login')">Login</el-button>
        <el-avatar icon="el-icon-user" />
      </div>
    </header>

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
import { ElMessage } from 'element-plus'; 

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
        // 检查返回的数据是否看起来像是合法图书
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
