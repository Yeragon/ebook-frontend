<!-- src/views/HomeLogged.vue -->
<template>
  <div class="home-logged-page">
    <!-- Header -->
    <header class="header">
      <h1 class="logo">Ebooks</h1>
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

    <!-- Due Soon -->
    <section class="section">
      <div class="section-header">
        <h2>Due Soon</h2>
        <el-button type="text" @click="$router.push('/duesoon')">View all →</el-button>
      </div>
      <el-table :data="dueSoonList" border style="width: 100%">
        <el-table-column
    prop="title"
    label="Book"
    align="center"
    label-class-name="table-header"
  />
  <el-table-column
    prop="author"
    label="Author"
    align="center"
    label-class-name="table-header"
  />
  <el-table-column
    prop="rentalStartDate"
    label="Rental Start Date"
    align="center"
    label-class-name="table-header"
  />
  <el-table-column
    prop="expirationDate"
    label="Expiration Date"
    align="center"
    label-class-name="table-header"
  />
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
/*
  Author: Xiaoyao Yu
  Created: April 11, 2025
  Last Modified: May 8, 2025
  Module: Home Page (Logged-in View) -> MyAccountView
  Description:
    - Displays homepage for logged-in users with personalized features
    - Shows recommended books with refresh functionality
    - Includes categorized book lists with image previews
    - Provides logout, search, navigation to book detail and category pages
*/
import request from '@/utils/request';
import { Search, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'HomeLogged',
  data() {
    return {
      Refresh,//Binding icon
      Search,
      currentUser: {},
      searchQuery: '',
      recommendedBooks: [],
      dueSoonList: [],
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
  // Load user info, recommended four ebooks when page is created
  created() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    this.refreshBooks();
    this.fetchDueSoon();
  },
  methods: {
    /**
     * @method logout
     * @description Clears user session and redirects to the public homepage with a success message.
     */
    logout() {
      localStorage.removeItem('currentUser');
      this.$message.success('Logged out successfully!');
      this.$router.push('/');
    },
    /**
     * @method refreshBooks
     * @description Fetches a full list of books and randomly selects 4 to show as recommendations.
     */
    async refreshBooks() {
      try {
        const response = await request.get('/books');
    this.recommendedBooks = Array.isArray(response)
      ? response.sort(() => 0.5 - Math.random()).slice(0, 4)
      : [];
      } catch (error) {
        console.error('Failed to fetch books', error);
      }
    },
    /**
     * @method fetchDueSoon
     * @description Fetches user's borrowed books and filters those due within the next 30 days.
     * Uses localStorage as the data source and displays the top 5 sorted by expiration date.
     */
    fetchDueSoon() {
  const userData = localStorage.getItem('currentUser');
  if (!userData) return;

  const user = JSON.parse(userData);
  const key = `onLoanBooks_${user.id}`;
  const allBooks = JSON.parse(localStorage.getItem(key)) || [];

  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);

  const parseDate = (str) => {
    const [day, month, year] = str.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  this.dueSoonList = allBooks.filter(book => {
    const dueDate = parseDate(book.expirationDate);
    return dueDate >= today && dueDate <= thirtyDaysLater;
  }).map(book => ({
    title: book.title,
    author: book.author,
    rentalStartDate: book.rentalStartDate,
    expirationDate: book.expirationDate
  }))
    .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate)) // Sort in ascending order by expiration date
    .slice(0, 5); // Only take the most recent five books
  },
    /**
     * @method goBookDetail
     * @description Navigates to the detail page of the selected book (logged-in version).
     * @param {String} bookId - The ID of the selected book
     */
    goBookDetail(bookId) {
      this.$router.push(`/bookdetail/${bookId}`);
    },
    goToCategory(categoryName) {
      this.$router.push({ path: `/category/${categoryName}` });
    },
    /**
     * @method searchBooks
     * @description Sends the current keyword to the backend search endpoint and redirects to the result page.
     * If the keyword is empty or the request fails, shows a warning or error message.
     */
    async searchBooks() {
    if (this.searchQuery.trim()) {
      try {
        // Send the request to the search interface at the back-end
        const response = await request.get('/search/books', {
          params: { query: this.searchQuery.trim() }
        });
        
        this.searchResults = response;
        this.$router.push(`/booklist/${this.searchQuery.trim()}`);
      } catch (error) {
        ElMessage.error('Search failed, please try again.');
      }
    } else {
      this.$message.warning('Please enter a keyword.');
    }
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
.header-actions .separator {
  margin: 0 10px;  
  font-size: 20px;  
  color: #ccc;  
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
  height: 198px;
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
::v-deep(.table-header) {
  color: black;
  text-align: center;
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
  gap: 8px; 
}

.refresh-icon {
  padding: 0;
  font-size: 18px;
  color: #39acdd;
  margin-left: 15px;
}
</style>
