<!-- src/views/Home.vue -->
<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
      <h1 class="logo">Ebooks</h1>
      <div class="header-actions">
        <el-button class="login-button" @click="$router.push('/login')">Login</el-button>
        <el-avatar icon="el-icon-user" />
      </div>
    </header>

    <!-- Search -->
    <div class="search-container">
    <el-input
        v-model="searchQuery"
        :prefix-icon="Search"
        placeholder="Search"
        class="search-input"
        @keyup.enter="searchBooks"
      >
        <template #append>
          <el-button @click="searchBooks" style="font-size: 12px;">Enter</el-button>
        </template>
      </el-input>
    </div>

    <!-- Recommended Books -->
    <section class="section">
      <div class="section-title-with-icon">
      <div class="section-header">
        <h2>Recommended Books</h2>
        <el-button type="text" :icon="Refresh" @click="refreshBooks" class="refresh-icon"></el-button>
      </div>
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

    <!-- Category -->
    <section class="section">
      <div class="section-header">
        <h2>Category</h2>
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
import { Search, Refresh } from '@element-plus/icons-vue' // 引入图标

export default {
  name: 'Home',
  data() {
    return {
      Refresh,//绑定图标
      Search,
      searchQuery: '',
      recommendedBooks: [],
      classifications: [
      {
    name: 'History',
    count: 2000,
    img: 'https://covers.openlibrary.org/b/id/12380797-L.jpg' // Guns, Germs, and Steel
  },
  {
    name: 'Literature',
    count: 503,
    img: 'https://covers.openlibrary.org/b/id/8228691-L.jpg' // To Kill a Mockingbird
  },
  {
    name: 'Art',
    count: 893,
    img: 'https://covers.openlibrary.org/b/id/12608803-L.jpg' // The Story of Art by E.H. Gombrich
  },
  {
    name: 'Biography',
    count: 6789,
    img: 'https://covers.openlibrary.org/b/id/11153299-L.jpg' // Steve Jobs by Walter Isaacson
  },
  {
    name: 'Psychology',
    count: 7514,
    img: 'https://covers.openlibrary.org/b/id/10814439-L.jpg' // The Body Keeps the Score
  },
  {
    name: 'Sociology',
    count: 6789,
    img: 'https://covers.openlibrary.org/b/id/11159587-L.jpg' // Outliers by Malcolm Gladwell
  }
]

    };
  },
  created() {
    this.refreshBooks();
  },
  methods: {
    async refreshBooks() {
      try {
        const response = await request.get('/ebooks');
        this.recommendedBooks = response.data.sort(() => 0.5 - Math.random()).slice(0, 4);
      } catch (error) {
        console.error('Failed to fetch books', error);
      }
    },
    goToCategory(categoryName) {
      this.$router.push({ path: `/category/${categoryName}` });
    },
    goBookDetail(bookId) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        this.$router.push(`/bookdetail/${bookId}`);
      } else {
        this.$router.push(`/bookdetailunlogged/${bookId}`);
      }
    },

    async searchBooks() {
    if (this.searchQuery.trim()) {
      try {
        // 发送请求到后端的搜索接口
        const response = await request.get('/search/books', {
          params: { query: this.searchQuery.trim() }
        });
        // 将搜索结果保存到 searchResults 中
        this.searchResults = response.data;

        // 跳转到搜索结果页面，并将搜索的关键词传递过去
        this.$router.push(`/booklistunlogged/${this.searchQuery.trim()}`);
      } catch (error) {
        this.$message.error('Search failed, please try again.');
      }
    } else {
      this.$message.warning('Please enter a keyword.');
    }
  }
  }
};
</script>

<style scoped>
.home-page {
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
  justify-content: space-around;
  gap: 40px;
  flex-wrap: nowrap;
  max-width: 960px;
  margin: 0 auto;
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
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  padding: 16px;
  transition: background 0.3s;
  min-height: 185px;
}

.classification-card:hover {
  background: #e0f7fa;
}

.classification-image {
  width: 150px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
  flex-shrink: 0;
}

.classification-text {
  flex: 1;
  text-align: left;
}

.classification-text strong {
  font-size: 20px;
  display: block;
  margin-bottom: 8px;
}

.classification-text p {
  font-size: 11px;
  color: #666;
}


.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #ccc;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title-with-icon {
  display: flex;
  align-items: center;
  gap: 8px; /* 控制标题和图标的间距 */
}

.refresh-icon {
  padding: 0;
  font-size: 18px;
  color: #39acdd;
  margin-left: 15px;
}
</style>
