<template>
    <div class="book-list-page">
      <!-- Header -->
      <header class="header">
        <h1 class="logo" style="cursor: pointer" @click="goHome">Ebooks</h1>
        <div class="header-actions">
          <el-avatar :src="currentUser.avatar || ''" icon="el-icon-user" style="cursor: pointer;" @click="$router.push('/myaccount')" />
          <span class="user-name">{{ currentUser.name || 'User' }}</span>
          <el-button type="text" @click="logout">Logout</el-button>
        </div>
      </header>
  
      <!-- Search -->
      <div class="search-container">
        <el-input
          v-model="keyword"
          :prefix-icon="Search" 
          placeholder="Search"
          class="search-input"
          @keyup.enter="searchBooks"
        >
        <template #append>
          <el-button  @click="searchBooks" style="font-size: 12px;">Enter</el-button>
        </template>
        </el-input>
      </div>
  
      <!-- Search Results -->
      <section class="section">
        <h2>Search Results for: "{{ keyword }}"</h2>
        <el-card v-if="filteredBooks.length === 0" class="no-result">No books found.</el-card>
  
        <div class="result-list" v-else>
          <div v-for="book in filteredBooks" :key="book.id" class="result-card" @click="goBookDetail(book.id)">
            <el-image :src="book.coverURL" fit="cover" class="book-image">
              <template #error>
                <div class="image-slot">Image not found</div>
              </template>
            </el-image>
            <div class="book-info">
              <p class="book-title">{{ book.title }}</p>
              <p class="book-author">{{ book.author }}</p>
            </div>
            <div class="book-actions">
              <el-tag size="mini" type="info">{{ book.borrowCount || 0 }}</el-tag>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import request from '@/utils/request';
  import { Search } from '@element-plus/icons-vue';

  
  export default {
    created() {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
  
      this.keyword = this.$route.params.keyword || '';
      this.fetchBooks();
    },


    watch: {
  '$route.params.keyword'(newKeyword) {
    this.keyword = newKeyword || '';
    this.fetchBooks();
  }
},

     
    name: 'BookList',
    data() {
      return {
        Search,
        currentUser: {},
        keyword: '',
        allBooks: [],
        filteredBooks: []
      };
    },
    
    methods: {
      goHome() {
        this.$router.push('/dashboard');
      },
        
      logout() {
        localStorage.removeItem('currentUser');
        this.$message.success('Logged out successfully!');
        this.$router.push('/');
      },
      async fetchBooks() {
        try {
          const response = await request.get('/ebooks');
          this.allBooks = response.data;
          this.searchBooks();
        } catch (error) {
          console.error('Failed to fetch books', error);
        }
      },
      searchBooks() {
        const kw = this.keyword.toLowerCase();
        this.filteredBooks = this.allBooks.filter(book =>
          book.title.toLowerCase().includes(kw) ||
          book.author.toLowerCase().includes(kw)
        );
      },
      goBookDetail(bookId) {
        this.$router.push(`/bookdetail/${bookId}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .book-list-page {
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
    margin-top: 80px;
  }
  .search-input {
    width: 500px;
  }
  .section {
    margin-top: 30px;
  }
  .result-list {
    margin-top: 20px;
  }
  .result-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
  }
  .book-image {
    width: 60px;
    height: 80px;
    border-radius: 6px;
  }
  .book-info {
    flex-grow: 1;
  }
  .book-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  .book-author {
    font-size: 14px;
    color: #555;
  }
  .book-meta {
    font-size: 12px;
    color: #888;
  }
  .book-actions {
    display: flex;
    align-items: center;
  }
  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 12px;
  }
  .no-result {
    text-align: center;
    padding: 20px;
    color: #999;
  }
  </style>
  