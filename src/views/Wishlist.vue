<!-- ❗❗ Functions in this page have been moved to MyAccount.vue
  FileName：Wishlist.vue
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：12/04/2025
  Last modified time：25/04/2025
  Module：User side - Wishlist page
  Functions：
    1. Display a list of books in the user's wishlist;
    2. Show book details such as title, author, and availability;
    3. Allow the user to loan available books, and provide visual feedback;
    4. Provide a heart icon button for favorites (currently non-functional);
    5. Fetch wishlist data from the backend.
-->
<template>
  <div class="wishlist-page">
    <!-- Page Title -->
    <h2 class="page-title">My Wishlist</h2>
    <!-- Table to display wishlist books -->
    <el-table :data="wishlist" border style="width: 100%">
      <!-- Column for Book Title -->
      <el-table-column prop="title" label="Book" align="center"></el-table-column>
      <!-- Column for Author Name -->
      <el-table-column prop="author" label="Author" align="center"></el-table-column>
       <!-- Column for Availability (Yes/No) -->
      <el-table-column prop="available" label="Available" align="center">
        <template #default="scope">
          <span>{{ scope.row.available ? 'Yes' : 'No' }}</span>
        </template>
      </el-table-column>
      <!-- Column for Loan Button -->
      <el-table-column label="Loan" align="center">
        <template #default="scope">
          <!-- Show "Loan" button if book is available -->
          <el-button
            v-if="scope.row.available"
            type="warning"
            size="small"
            @click="loanBook(scope.row)"
          >Loan</el-button>
          <!-- Disable "Loan" button if book is not available -->
          <el-button
            v-else
            type="info"
            size="small"
            disabled
          >Loan</el-button>
        </template>
      </el-table-column>
      <!-- Column for Favorite Button (currently non-functional) -->
      <el-table-column label="Favorite" align="center">
        <template>
          <el-button icon="el-icon-heart" circle type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request';

/*
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：12/04/2025
  Functions description：
    - Fetches the user's wishlist data from the backend when the component is created;
    - Renders the wishlist in a table with book details like title, author, availability, and options to loan a book;
    - Allows the user to loan books if they are available, and shows a success message when the loan button is clicked;
    - A "Favorite" button is included, but is not yet functional.

  Tech Stack:
    - Vue 3 Options API
    - Element Plus UI library (for table, buttons, etc.)
    - Axios for asynchronous request to fetch the wishlist data
    - Display data in a table and implement interactive elements like buttons.
*/

export default {
  name: 'Wishlist',
  data() {
    return {
      wishlist: [] // List of books in the user's wishlist
    };
  },
  created() {
    // Fetch the wishlist data when the component is created
    this.fetchWishlist();
  },
  methods: {
    // Fetch the wishlist data from the backend
    async fetchWishlist() {
      try {
        // Send GET request to fetch wishlist data
        const res = await request.get('/wishlist');
        // Set wishlist data to the response or empty array if no data
        this.wishlist = res.data || [];
      } catch (error) {
        // Log an error if fetching fails
        console.error('Failed to fetch wishlist', error);
      }
    },
    // Handle loaning a book from the wishlist
    loanBook(book) {
      // Display a success message when a book is loaned
      this.$message.success(`You loaned \"${book.title}\" successfully!`);
      // Additional loan logic can be added here (e.g., sending request to update loan status)
    }
  }
}
</script>

<style scoped>
.wishlist-page {
  max-width: 1000px;
  margin: auto;
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
}
</style>
