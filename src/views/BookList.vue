<template>
    <div class="book-list-page">
      <!-- Header -->
      <header class="header">
        <h1 class="logo" style="cursor: pointer" @click="goHome">Ebooks</h1>
        <div class="header-actions">
          <el-avatar :src="currentUser.avatar || ''" icon="el-icon-user" style="cursor: pointer;" @click="$router.push('/myaccount')" />
          <span class="user-name">{{ currentUser.name || 'User' }}</span>
          <span class="separator">|</span>
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
        <el-card v-if="filteredBooks.length === 0" class="no-result">
        <div>
          <p>😢 Sorry, no book found with the name "<strong>{{ keyword }}</strong>".</p>
          <p>Please try other key words</p>
        </div>
        </el-card>    
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
/*
  Author: Xiaoyao Yu
  Created: April 10, 2025
  Last Modified: May 8, 2025
  Module: User Side - Book List Page (for logged-in users)
  Description:
    - Enables users to search for eBooks and view results
    - Allows navigation to book detail pages
    - Detects current logged-in user information and supports logout
    - Reactively listens for changes in search keywords via route parameters
*/
  import request from '@/utils/request';
  import { Search } from '@element-plus/icons-vue';

  
  export default {

  // Lifecycle hook: called when the component is created; 
  // loads user info and initiates search
    created() {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    this.currentUser = JSON.parse(userData);
  }

  this.keyword = this.$route.params.keyword || '';
  this.fetchBooks();
},

// Watcher: triggers new search when route keyword changes
watch: {
  '$route.params.keyword': {
    immediate: true,
    handler(newKeyword) {
      this.keyword = newKeyword;
      this.fetchBooks();
    }
  }
}
,

     
    name: 'BookList',
    data() {
      return {
        Search,
        currentUser: {},
        keyword: '',
        filteredBooks: []
      };
    },
    
    methods: {
      /**
     * @method goHome
     * @description Navigates to the user dashboard after login
     * @author Xiaoyao Yu
     * @date 2025-04-12
     */
      goHome() {
        this.$router.push('/dashboard');
      },
       /**
     * @method logout
     * @description Logs the user out by clearing stored data and redirects to the homepage; shows success message
     * @author Xiaoyao Yu
     * @date 2025-04-12
     */ 
      logout() {
        localStorage.removeItem('currentUser');
        this.$message.success('Logged out successfully!');
        this.$router.push('/');
      },
      /**
     * @method fetchBooks
     * @description Sends request to backend to search books based on current keyword; updates result list accordingly
     * @author Xiaoyao Yu
     * @date 2025-04-12
     */
      async fetchBooks() {
        try {
          const response = await request.get('/search/books', {
          params: { query: this.keyword.trim() }
          });
          this.filteredBooks = response;
        } catch (error) {
          console.error('Failed to fetch books', error);
          this.filteredBooks = [];
        }
      },
      /**
     * @method searchBooks
     * @description Triggered when user clicks search or presses Enter; navigates to route with new keyword to update results
     * @author Xiaoyao Yu
     * @date 2025-04-12
     */
      searchBooks() {
      if (!this.keyword.trim()) {
        this.$message.warning('Please enter a keyword.');
        return;
        }
       this.$router.push(`/booklist/${this.keyword.trim()}`);
      },
    /**
     * @method goBookDetail
     * @description Navigates to the book detail page using the selected book's ID as route param
     * @param {String} bookId - The ID of the selected book to view in detail
     * @author Xiaoyao Yu
     * @date 2025-04-12
     */
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
  .header-actions .separator {
  margin: 0 10px;  
  font-size: 20px;  
  color: #ccc;  
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
  