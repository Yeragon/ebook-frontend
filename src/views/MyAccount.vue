<!--
  FileName: MyAccount.vue
  Creator: Yuandong Li, Xiaoyao Yu
  Created time: 15/04/2025
  Last Modified: 08/05/2025
  Module: User Side - My Account Page
  Functionality:
    - Display the current user's profile information
    - User can edit their personal information
    - Offer four tabs with different content 
    - Provide links return to dashboard
    - Display Books that user has added to wishlist
    - Users can loan books and cancel favorite by clicking different buttons in wishlist
    - Display books that users have loan in OnLoan page
    - Click the comment button move to the specific bookdetail page
    - Display books that are about expire and offer the "Return" button
    - Display rental start date and expiration date in wishlist and due soon page  
-->
<template>
  <div class="my-account-page">
     <!-- Header section with app logo -->
    <header class="header">
      <h1 class="logo" @click="goHome">Ebooks</h1>
      <el-button :icon="moneyIcon" circle style="border: none; cursor: pointer;" />
    </header>

    <div class="content">
      <h2 class="title">My Account</h2>
      <el-avatar size="large" class="avatar" :src="user.avatar || ''"></el-avatar>
      <!-- Tab Navigation  -->
      <el-tabs v-model="activeTab" class="tabs" @tab-change="handleTabChange">
         <!-- Profile Tab: Display non-editable user info -->
        <el-tab-pane label="Profile" name="profile">
          <el-form :model="user" label-width="150px" class="profile-form">
            <el-row :gutter="20">
              <!-- Generate profile fields from profileFields map -->
              <el-col :span="12" v-for="(value, key) in profileFields" :key="key">
                <el-form-item :label="value.label">
                  <el-input :value="user[key]" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- Buttons: Edit Profile and Exit Account -->
          <div class="button-group">
            <el-button type="primary" @click="goToEdit">Edit</el-button>
            <el-button type="danger" @click="logout">Exit</el-button>
          </div>
        </el-tab-pane>

        <!-- Wishlist Tab: Show favorited books with actions -->
        <el-tab-pane label="Wishlist" name="wishlist">
          <el-table :data="filteredWishlist" border>
            <el-table-column prop="title" label="Book" align="center" />
            <el-table-column prop="author" label="Author" align="center" />
            <el-table-column prop="available" label="Available" align="center">
              <template #default="scope">
                <span>{{ scope.row.available ? 'Yes' : 'No' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Loan" align="center">
              <template #default="scope">
                <el-button
                  v-if="scope.row.available"
                  type="warning"
                  size="small"
                  @click="loanBook(scope.row)"
                >Loan</el-button>
                <el-button v-else type="info" size="small" disabled>Loan</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Favorite" align="center">
              <template #default="scope">
                <el-button
                  :style="{ color: scope.row.favorite ? 'red' : '#ccc' }"
                  icon="el-icon-heart"
                  circle
                  @click="toggleFavorite(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Due Soon Tab: Books close to expiration with return option -->
        <el-tab-pane label="DUE Soon" name="duesoon">
          <el-table :data="dueSoonList" border>
            <el-table-column prop="title" label="Book" align="center" />
            <el-table-column prop="author" label="Author" align="center" />
            <el-table-column label="Rental Start Date" align="center">
           <template #default="scope">
             {{ formatDate(scope.row.rentalStartDate) }}
             </template>
              </el-table-column>
              <el-table-column label="Expiration Date" align="center">
              <template #default="scope">
              {{ formatDate(scope.row.expirationDate) }}
             </template>
              </el-table-column>
            <el-table-column label="Return" align="center">
              <template #default="scope">
                <el-button
                  type="warning"
                  size="small"
                  :disabled="scope.row.status !== 'active'"
                  @click="returnBook(scope.row)"
                >Return</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- On Loan Tab: List of currently loaned books -->
        <el-tab-pane label="On loan" name="onloan">
          <el-table :data="onLoanList" border>
            <el-table-column prop="title" label="Book" align="center" />
            <el-table-column prop="author" label="Author" align="center" />
            <el-table-column label="Rental Start Date" align="center">
            <template #default="scope">
                {{ formatDate(scope.row.rentalStartDate) }}
            </template>
            </el-table-column>            
            <el-table-column label="Expiration Date" align="center">
            <template #default="scope">
                {{ formatDate(scope.row.expirationDate) }}
            </template>
           </el-table-column>             
           <el-table-column label="Comment" align="center">
              <template #default="scope">
                <el-button
                  :icon="chatIcon"
                  circle
                  size="small"
                  @click="commentBook(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      
      <!-- Confirm unfavorite dialog -->
      <el-dialog
  title="Remove from Wishlist"
  :model-value="confirmDialogVisible"
  @update:modelValue="confirmDialogVisible = $event"
  width="30%"
  center
>
<span>Are you sure you want to remove "{{ selectedBook?.title }}" from your wishlist?</span>
  <template #footer>
    <el-button @click="cancelUnfavorite">Cancel</el-button>
    <el-button type="primary" @click="confirmUnfavorite">Confirm</el-button>
  </template>
</el-dialog>

 <!-- Confirm return book dialog -->
<el-dialog
  title="Return Book"
  :model-value="confirmReturnDialogVisible"
  @update:modelValue="confirmReturnDialogVisible = $event"
  width="30%"
  center
>
  <span>Are you sure you want to return "{{ selectedReturnBook?.title }}"?</span>
  <template #footer>
    <el-button @click="cancelReturn">Cancel</el-button>
    <el-button type="primary" @click="confirmReturn">Confirm</el-button>
  </template>
</el-dialog>

    </div>
  </div>
</template>

<script>
/*
  FileName: MyAccount.vue
  Creator: Yuandong Li, Xiaoyao Yu
  Create time: 15/04/2025
  Last Modified: 08/05/2025
  Module: User Side - My Account Page

  Functions Description:
    - Fetch and display user profile information.
    - Handle tab switching to load corresponding data (wishlist, on loan, due soon).
    - Provide interactions like editing profile, loaning books, returning books, and removing favorites.
    - Use Element Plus components (tabs, forms, tables, dialogs) for UI.
    - Handle date formatting and API integration via axios.

  Tech Stack:
    - Vue 3 (Options API)
    - Element Plus UI library
    - Axios (via custom `request` instance)
    - Day.js for date formatting
    - LocalStorage for user state persistence
*/

import { h } from 'vue';
import { Money } from '@element-plus/icons-vue';
import { ChatLineRound } from '@element-plus/icons-vue';
import request from '@/utils/request';
import dayjs from 'dayjs';


export default {
  name: 'MyAccount',
  data() {
    return {
      //user info initialize
      activeTab: 'profile',
      user: {
        email: '',
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        balance: 0,
        avatar: ''
      },
      profileFields: {
        email: { label: 'E-mail:' },
        fullName: { label: 'Full Name:' },
        phoneNumber: { label: 'Phone Number:' },
        dateOfBirth: { label: 'Date Of Birth:' },
        balance: { label: 'Balance(£):' }
      },
      wishlist: [],
      onLoanList: [],
      dueSoonList: [],
      moneyIcon: h(Money),
      chatIcon: h(ChatLineRound),
      confirmDialogVisible: false,
      selectedBook: null,
      confirmReturnDialogVisible: false,
      selectedReturnBook: null,
    };
  },
  created() {
    // Load user and fetch all relevant data when component is created
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.fetchUserInfo(user.userId);
      this.loadWishlistFromServer(user.userId);
      this.loadOnLoan();
      this.loadDueSoon(user.userId);
    }
  },
  computed: {
    // Filter out books that are not marked as favorite
    filteredWishlist() {
      return this.wishlist.filter(book => book.favorite !== false);
    }
  },
  methods: {
    // Format date to readable format
    formatDate(dateStr) {
    return dayjs(dateStr).format('DD MMM YYYY');
  },
  // Navigate to dashboard
    goHome() {
      this.$router.push('/dashboard');
    },
    // Logout and redirect to login page
    logout() {
      localStorage.removeItem('currentUser');
      this.$message.success('Logged out successfully!');
      this.$router.push('/');
    },
    // Go to profile edit page
    goToEdit() {
      this.$router.push('/editpage');
    },
    // Fetch latest user info from backend
    async fetchUserInfo(userId) {
      const res = await request.get(`/user/info/${userId}`);
        this.user = {
          email: res.email,
          fullName: res.fullName,
          phoneNumber: res.phoneNumber,
          dateOfBirth: res.dateOfBirth,
          balance: res.balance,
          avatar: res.avatar || ''
        };
      
    },
     // Handle tab switch and load data for specific tab
    async handleTabChange(tab) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user.userId) return;

      if (tab === 'wishlist') this.loadWishlistFromServer(user.userId);
      if (tab === 'onloan') this.loadOnLoan();
      if (tab === 'duesoon') this.loadDueSoon(user.userId);
    },
    // Load user's wishlist from server
    async loadWishlistFromServer(userId) {
      const res = await request.get(`/wishlist/${userId}`);
      this.wishlist = res;    },
      // Load currently loaned books
    async loadOnLoan() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      //Verify user is exist or not
      if (!user?.userId) return;
      const res = await request.get(`/loan/active/${user.userId}`);
      this.onLoanList = res;
    },
    // Load books that are due soon
    async loadDueSoon(userId) {
      const res = await request.get(`/loan/due-soon/${userId}`);
      this.dueSoonList = res;

    },
    // Attempt to loan a book from wishlist
    async loanBook(book) {
     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userId = currentUser?.userId;

      //Check user already logged in or not
  if (!userId) {
    this.$message.error('User is not logged in!');
    return;
  }

     try {
    //Request book from backend
    await request.post('/loan/borrow', {
      userId,
      ebookId: book.ebookId
    });
    this.$message.success('Book loaned successfully!');

    // update the status of book(available or not)
    const target = this.wishlist.find(item => item.ebookId === book.ebookId);
    if (target) target.available = false;

    // refresh onLoan & dueSoon list
    await this.loadOnLoan();
    await this.loadDueSoon(userId);
  } catch (error) {
    
    console.warn('Loan book failed:', error);
  }
},
// Trigger unfavorite confirmation dialog
    toggleFavorite(book) {
      console.log('Clicked book:', book);
      this.selectedBook = book;
      this.confirmDialogVisible = true;
      console.log('Dialog should be visible:', this.confirmDialogVisible);
    },

    // Confirm unfavorite action
    async confirmUnfavorite() {
  if (!this.selectedBook) return;

  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.userId) return;

    // sent remove request to backend
    await request.delete(`/wishlist/remove`, {
      params: {
    userId: user.userId,
    ebookId: this.selectedBook.ebookId
  }
    });
    //Show the message if it is successful
    this.$message.success(`"${this.selectedBook.title}" has been removed from your wishlist.`);

      await this.loadWishlistFromServer(user.userId);
     } catch (error) {
        this.$message.error('Failed to remove from wishlist.');
     } finally {
        this.confirmDialogVisible = false;
        this.selectedBook = null;
     }
    },

    // Cancel unfavorite action
    cancelUnfavorite() {
      //close the dialog
      this.confirmDialogVisible = false;
      this.selectedBook = null;
    },

    // Navigate to book detail page and open comment section
    commentBook(book) {
      this.$router.push({ name: 'BookDetail', params: { id: book.id }, query: { showComment: 'true' } });
    },
    // Trigger return book confirmation dialog
    returnBook(book) {
      this.selectedReturnBook = book;
      this.confirmReturnDialogVisible = true;
    },

    // Cancel return action
    cancelReturn() {
      //close the dialog
  this.confirmReturnDialogVisible = false;
  this.selectedReturnBook = null;
},
// Confirm return action
async confirmReturn() {
  if (!this.selectedReturnBook) return;

  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.userId) return;

    //request return the book
    await request.post('/loan/return', {
      userId: user.userId,
      ebookId: this.selectedReturnBook.ebookId
    });

    this.$message.success(`"${this.selectedReturnBook.title}" has been returned successfully.`);

    await this.loadDueSoon(user.userId);
    await this.loadOnLoan(); // refresh On Loan list

  } catch (error) {
    this.$message.error('Failed to return the book.');
  } finally {
    this.confirmReturnDialogVisible = false;
    this.selectedReturnBook = null;
  }
}
  }
};
</script>

<style scoped>
.my-account-page {
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
  font-size: 32px;
  font-weight: bold;
  color: #00bcd4;
  font-family: 'Lucida Handwriting';
  cursor: pointer;
}
.content {
  margin-top: 30px;
  text-align: center;
}
.title {
  font-size: 28px;
  font-weight: bold;
}
.avatar {
  margin: 20px auto;
}
.tabs {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
}
.profile-form {
  margin-top: 20px;
}
.button-group {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
::v-deep(.el-overlay) {
  z-index: 3000 !important;
}
</style>
