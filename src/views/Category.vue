<!--
  FileName：Category.vue
  Creator：Xiaoyao Yu
  Create time：12/04/2025
  Last modified time：20/04/2025
  Module：User side - Category Books Page
  Functions：
    1. Display a list of books under a specific category selected by the user;
    2. Dynamically fetch books based on category name from route parameters;
    3. Show basic book details including cover, title, and author;
    4. Provide navigation back to the home page.
-->
<template>
  <div class="category-page">
    <!-- Header -->
    <header class="header">
      <h1 class="logo">Ebooks</h1>
      <el-button type="text" @click="$router.push('/')">← Back to Home</el-button>
    </header>

    <!-- Title -->
    <div class="title-section">
      <h2>{{ categoryName }} Books</h2>
    </div>

    <!-- Book List -->
    <section class="section">
      <div class="book-list">
        <div v-for="book in books" :key="book.id" class="book-card">
          <el-image :src="book.coverURL" fit="cover" class="book-image">
            <div slot="error" class="image-slot">FAILED</div>
          </el-image>
          <p class="book-title">{{ book.title }}</p>
          <small class="book-author">{{ book.author }}</small>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import request from '@/utils/request';

/*
  Creator：Xiaoyao Yu
  Functions description：
    - Extracts the category name from the route parameters;
    - Fetches the list of books under the given category via API;
    - Handles loading failures with user-friendly error messages;
    - Renders book covers, titles, and authors in a card layout.
*/
export default {
  name: "Category",
  data() {
    return {
      categoryName: '', // Current category name from route param
      books: [] // List of books in this category
    }
  },
  created() {
    // Extract category name from route params and fetch books
    this.categoryName = this.$route.params.name;
    this.fetchCategoryBooks();
  },
  methods: {
    // Fetch book list based on category from backend API
    async fetchCategoryBooks() {
      try {
        const res = await request.get(`/books/category/${this.categoryName}`);
        this.books = res.data || [];
      } catch (error) {
        console.error('Failed to fetch category books', error);
        this.$message.error('Failed to load category books.');
      }
    }
  }
};
</script>

<style scoped>
.category-page {
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

.title-section {
  text-align: center;
  margin: 40px 0 20px;
}

.section {
  margin-top: 20px;
}

.book-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.book-card {
  width: 140px;
  text-align: center;
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

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #ccc;
}
</style>
