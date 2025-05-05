<template>
  <div class="my-account-page">
    <header class="header">
      <h1 class="logo" @click="goHome">Ebooks</h1>
      <el-button :icon="moneyIcon" circle style="border: none; cursor: pointer;" />
    </header>

    <div class="content">
      <h2 class="title">My Account</h2>
      <el-avatar size="large" class="avatar" :src="user.avatar || ''"></el-avatar>

      <el-tabs v-model="activeTab" class="tabs" @tab-change="handleTabChange">
        <el-tab-pane label="Profile" name="profile">
          <el-form :model="user" label-width="150px" class="profile-form">
            <el-row :gutter="20">
              <el-col :span="12" v-for="(value, key) in profileFields" :key="key">
                <el-form-item :label="value.label">
                  <el-input :value="user[key]" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div class="button-group">
            <el-button type="primary" @click="goToEdit">Edit</el-button>
            <el-button type="danger" @click="logout">Exit</el-button>
          </div>
        </el-tab-pane>

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

        <el-tab-pane label="DUE Soon" name="duesoon">
          <el-table :data="dueSoonList" border>
            <el-table-column prop="title" label="Book" align="center" />
            <el-table-column prop="author" label="Author" align="center" />
            <el-table-column prop="rentalStartDate" label="Rental Start Date" align="center" />
            <el-table-column prop="expirationDate" label="Expiration Date" align="center" />
            <el-table-column label="Return" align="center">
              <template #default="scope">
                <el-button
                  type="warning"
                  size="small"
                  @click="returnBook(scope.row)"
                >Return</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="On loan" name="onloan">
          <el-table :data="onLoanList" border>
            <el-table-column prop="title" label="Book" align="center" />
            <el-table-column prop="author" label="Author" align="center" />
            <el-table-column prop="rentalStartDate" label="Rental Start Date" align="center" />
            <el-table-column prop="expirationDate" label="Expiration Date" align="center" />
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
      <!-- 🔽 弹窗放这里，tabs 外部 -->
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
    </div>
  </div>
</template>

<script>
import { h } from 'vue';
import { Money } from '@element-plus/icons-vue';
import { ChatLineRound } from '@element-plus/icons-vue';
import request from '@/utils/request';

export default {
  name: 'MyAccount',
  data() {
    return {
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
    };
  },
  created() {
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
    filteredWishlist() {
      return this.wishlist.filter(book => book.favorite !== false);
    }
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
    goToEdit() {
      this.$router.push('/editpage');
    },
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
    async handleTabChange(tab) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user.userId) return;

      if (tab === 'wishlist') this.loadWishlistFromServer(user.userId);
      if (tab === 'onloan') this.loadOnLoan();
      if (tab === 'duesoon') this.loadDueSoon(user.userId);
    },
    async loadWishlistFromServer(userId) {
      const res = await request.get(`/wishlist/${userId}`);
      this.wishlist = res;    },
    async loadOnLoan() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user?.userId) return;
      const res = await request.get(`/loan/active/${user.userId}`);
      this.onLoanList = res;
    },
    async loadDueSoon(userId) {
      const res = await request.get(`/loan/due-soon/${userId}`);
      this.dueSoonList = res;

    },
    loanBook(book) {
      this.$message.success(`You loaned "${book.title}" successfully!`);
    },

    toggleFavorite(book) {
      console.log('Clicked book:', book);
      this.selectedBook = book;
      this.confirmDialogVisible = true;
      console.log('Dialog should be visible:', this.confirmDialogVisible);
    },

    async confirmUnfavorite() {
  if (!this.selectedBook) return;

  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.userId) return;

    // 向后端发送取消收藏请求
    await request.post(`/wishlist/unfavorite`, {
      userId: user.userId,
      bookId: this.selectedBook.id
    });

    this.$message.success(`"${this.selectedBook.title}" has been removed from your wishlist.`);

      // 重新拉取 wishlist
      await this.loadWishlistFromServer(user.userId);
     } catch (error) {
        this.$message.error('Failed to remove from wishlist.');
     } finally {
        this.confirmDialogVisible = false;
        this.selectedBook = null;
     }
    },

    cancelUnfavorite() {
      this.confirmDialogVisible = false;
      this.selectedBook = null;
    },

    commentBook(book) {
      this.$router.push({ name: 'BookDetail', params: { id: book.id }, query: { showComment: 'true' } });
    },
    returnBook(book) {
      this.$message.success(`You have returned "${book.title}" successfully!`);
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
