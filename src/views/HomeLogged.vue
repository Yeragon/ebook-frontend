<!-- src/views/HomeLogged.vue -->
<template>
  <div class="home-logged-page">
    <!-- Header -->
    <header class="header">
      <h1 class="logo">Ebooks</h1>
      <div class="header-actions">
        <el-avatar :src="currentUser.avatar || ''" icon="el-icon-user" style="cursor: pointer;" @click="$router.push('/myaccount')" />
        <span class="user-name">{{ currentUser.name || 'User' }}</span>
        <el-button type="text" @click="logout">Logout</el-button>
      </div>
    </header>

    <!-- Search -->
    <div class="search-container">
      <el-input v-model="searchQuery" placeholder="Search" prefix-icon="el-icon-search" class="search-input" />
    </div>

    <!-- Recommended Books -->
    <section class="section">
      <div class="section-header">
        <h2>Recommended Books</h2>
        <el-button type="text" icon="el-icon-refresh" @click="refreshBooks"></el-button>
      </div>
      <div class="book-list">
        <div v-for="book in recommendedBooks" :key="book.id" class="book-card" @click="goBookDetail(book.id)">
          <el-image :src="book.coverURL" fit="cover" class="book-image">
            <template #error>
              <div class="image-slot">FAILED</div>
            </template>
          </el-image>
          <p class="book-title">{{ book.title }}</p>
          <small class="book-author">{{ book.author }}</small>
        </div>
      </div>
    </section>

    <!-- Due Soon -->
    <section class="section">
      <div class="section-header">
        <h2>Due Soon</h2>
        <el-button type="text" @click="$router.push('/duesoon')">View all →</el-button>
      </div>
      <el-table :data="dueSoonList" border style="width: 100%">
        <el-table-column prop="bookTitle" label="Book Title" />
        <el-table-column prop="author" label="Author" />
        <el-table-column prop="startDate" label="Start Date" />
        <el-table-column prop="dueDate" label="Due Date" />
      </el-table>
    </section>

    <!-- Classifications -->
    <section class="section">
      <div class="section-header">
        <h2>Classifications</h2>
        <el-button type="text" @click="$router.push('/category')">View all →</el-button>
      </div>
      <div class="classification-grid">
        <div v-for="category in classifications" :key="category.name" class="classification-card" @click="goToCategory(category.name)">
          <el-image :src="category.img" fit="cover" class="classification-image">
            <template #error>
              <div class="image-slot">FAILED</div>
            </template>
          </el-image>
          <div class="classification-text">
            <strong>{{ category.name }}</strong>
            <p>Quantity of Books: {{ category.count }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'HomeLogged',
  data() {
    return {
      currentUser: {},
      searchQuery: '',
      recommendedBooks: [],
      dueSoonList: [],
      classifications: [
        { name: 'History', count: 2000, img: 'error' },
        { name: 'Literature', count: 503, img: 'error' },
        { name: 'Art', count: 893, img: 'error' },
        { name: 'Biography', count: 6789, img: 'error' },
        { name: 'Psychology', count: 7514, img: 'error' },
        { name: 'Sociology', count: 6789, img: 'error' }
      ]
    };
  },
  created() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    this.refreshBooks();
    this.fetchDueSoon();
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser');
      this.$message.success('Logged out successfully!');
      this.$router.push('/');
    },
    async refreshBooks() {
      try {
        const response = await request.get('/books');
        this.recommendedBooks = response.data.sort(() => 0.5 - Math.random()).slice(0, 4);
      } catch (error) {
        console.error('Failed to fetch books', error);
      }
    },
    async fetchDueSoon() {
      try {
        const response = await request.get('/loans/duesoon');
        this.dueSoonList = response.data || [];
      } catch (error) {
        console.error('Failed to fetch due soon loans', error);
      }
    },
    goBookDetail(bookId) {
      this.$router.push(`/bookdetail/${bookId}`);
    },
    goToCategory(categoryName) {
      this.$router.push({ path: `/category/${categoryName}` });
    }
  }
};
</script>

<style scoped>
.home-logged-page {
  max-width: 1000px;
  margin: auto;
  padding: 40px 20px;
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
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-name {
  font-size: 16px;
  font-weight: bold;
}
.search-container {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}
.search-input {
  width: 400px;
}
.section {
  margin-top: 50px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.book-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.book-card {
  width: 140px;
  text-align: center;
  cursor: pointer;
}
.book-image {
  width: 100%;
  height: 160px;
  border-radius: 10px;
}
.book-title {
  margin-top: 8px;
  font-weight: bold;
}
.book-author {
  font-size: 12px;
  color: #666;
}
.classification-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.classification-card {
  background: #f5f5f5;
  border-radius: 10px;
  text-align: center;
  padding: 20px;
  cursor: pointer;
}
.classification-image {
  width: 100%;
  height: 120px;
  margin-bottom: 10px;
}
.classification-text strong {
  font-size: 16px;
}
.classification-text p {
  font-size: 12px;
  color: #555;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #ccc;
}
</style>
