<template>
    <div class="book-list-page">
      <!-- Header -->
      <header class="header">
        <h1 class="logo" style="cursor: pointer" @click="goHome">Ebooks</h1>
        <div class="header-actions">
          <el-button class="login-button" @click="$router.push('/login')">Login</el-button>
          <el-avatar icon="el-icon-user" />
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
  Module: User Side - Book List Page (Unlogged View)
  Description:
    - Allows unregistered or logged-out users to browse and search eBooks
    - Displays search results and book detail previews
    - Enables navigation to the login page or book detail pages (unlogged version)
    - Reactively updates the search results when route parameter changes
*/
  import request from '@/utils/request';
  import { Search } from '@element-plus/icons-vue';

  
  export default {
     
    name: 'BookListUnlogged',
    data() {
      return {
        Search,
        keyword: '',
        filteredBooks: []
      };
    },
    created() {
     this.keyword = this.$route.params.keyword || '';
     this.fetchBooks();
    },

    watch: {
  '$route.params.keyword': {
    immediate: true,
    handler(newKeyword) {
      this.keyword = newKeyword;
      this.fetchBooks();
    }
  }
},
    methods: {
      goHome() {
        this.$router.push('/');
      },
        
      async fetchBooks() {
        try {
          const response = await request.get('/search/books', {
          params: { query: this.keyword.trim() }
          });
          this.filteredBooks = response;

        } catch (error) {
          console.error('Failed to fetch books', error);
        }
      },

      /**
     * @method fetchBooks
     * @description Sends request to backend to fetch books based on current keyword; updates result list accordingly.
     * Displays no-result message if no books are found.
     * Only available to unlogged users for browsing, not borrowing or reviewing.
     * @author Xiaoyao Yu
     * @date 2025-04-12
     */
      searchBooks() {
        if (!this.keyword.trim()) {
        this.$message.warning('Please enter a keyword.');
        return;
        }
        this.$router.push(`/booklistunlogged/${this.keyword.trim()}`);

      },

       /**
     * @method goBookDetail
     * @description Navigates to the unlogged book detail page using the selected book’s ID.
     * Only shows read-only information; no borrowing or adding wishlist or comment available without login.
     * @param {String} bookId - ID of the selected book to view in detail (unlogged mode)
     * @author Xiaoyao Yu
     * @date 2025-05-08
     */
      goBookDetail(bookId) {
        this.$router.push(`/bookdetailunlogged/${bookId}`);
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