<template>
  <div class="my-account-page">
    <!-- 顶部 -->
    <header class="header">
      <h1 class="logo" @click="goHome">Ebooks</h1>
      <el-button :icon="moneyIcon" circle style="border: none; cursor: pointer;"></el-button>
    </header>

    <div class="content">
      <h2 class="title">My Account</h2>
      <el-avatar size="large" class="avatar" :src="user.avatar || ''"></el-avatar>

      <!-- Tabs区域 -->
      <el-tabs v-model="activeTab" class="tabs" @tab-change="saveWishlist">
        <!-- Profile 页 -->
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

        <!-- Wishlist 页 -->
        <el-tab-pane label="Wishlist" name="wishlist">
          <el-table :data="filteredWishlist" border style="width: 100%">
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
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- DUE Soon 页 -->
        <el-tab-pane label="DUE Soon" name="duesoon">
  <el-table :data="dueSoonList" border style="width: 100%">
    <el-table-column prop="title" label="Book" align="center"></el-table-column>
    <el-table-column prop="author" label="Author" align="center"></el-table-column>
    <el-table-column prop="rentalStartDate" label="Rental Start Date" align="center"></el-table-column>
    <el-table-column prop="expirationDate" label="Expiration Date" align="center"></el-table-column>
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


        <!-- On Loan 页 -->
        <el-tab-pane label="On loan" name="onloan">
  <el-table :data="onLoanList" border style="width: 100%">
    <el-table-column prop="title" label="Book" align="center"></el-table-column>
    <el-table-column prop="author" label="Author" align="center"></el-table-column>
    <el-table-column prop="rentalStartDate" label="Rental Start Date" align="center"></el-table-column>
    <el-table-column prop="expirationDate" label="Expiration Date" align="center"></el-table-column>
    <el-table-column label="Comment" align="center">
      <template #default="scope">
        <el-button
          :icon="chatIcon"
          circle
          size="small"
          @click="commentBook(scope.row)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { h } from 'vue';
import { Money } from '@element-plus/icons-vue';
import request from '@/utils/request';
import { ChatLineRound } from '@element-plus/icons-vue';

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
    };
  },
  created() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.user = {
        email: user.email,
        fullName: user.name || '',
        dateOfBirth: user.dateOfBirth || '',
        balance: user.balance || 0,
        avatar: user.avatar || ''
      };
    }
    this.loadWishlist();
    this.loadOnLoan();
    this.loadDueSoon();
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
    toggleFavorite(book) {
      book.favorite = !book.favorite;
    },
    
    async loanBook(book) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser?.id;

    if (!userId) {
      this.$message.error('User is not logged in!');
      return;
    }

    const data = await request.post('/loan/borrow', {
      userId,
      ebookId: book.id
    });

    this.$message.success(`You loaned "${book.title}" successfully!`);
    this.loadOnLoan(); // 刷新借阅列表
    this.loadDueSoon(); // 刷新即将到期列表
  } catch (error) {
    console.error('Loan error:', error);
    // 错误提示已由 request.js 自动处理，无需重复
  }
},

    loadWishlist() {
      const data = localStorage.getItem('wishlistBooks');
      this.wishlist = data ? JSON.parse(data) : [];
    },
    saveWishlist() {
      const favoriteBooks = this.wishlist.filter(book => book.favorite !== false);
      localStorage.setItem('wishlistBooks', JSON.stringify(favoriteBooks));
    },

    loadOnLoan() {
    const data = localStorage.getItem('onLoanBooks');
    this.onLoanList = data ? JSON.parse(data) : [];
    },
    
    commentBook(book) {
    this.$message.success(`You clicked comment on "${book.title}"!`);
    this.$router.push({
        name: 'BookDetail',
        params: { id: book.id },
        query: { showComment: 'true' }
    });
},

    loadDueSoon() {
  const allBooks = JSON.parse(localStorage.getItem('onLoanBooks')) || [];
  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);

  const parseDate = (str) => {
    const [day, month, year] = str.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  this.dueSoonList = allBooks.filter(book => {
    const dueDate = parseDate(book.expirationDate);
    return dueDate >= today && dueDate <= sevenDaysLater;
  });
},
returnBook(book) {
  this.$message.success(`You have returned "${book.title}" successfully!`);
  // 从本地 onLoanBooks 中移除这本书
  const updated = this.dueSoonList.filter(b => b.title !== book.title);
  this.dueSoonList = updated;

  let allOnLoan = JSON.parse(localStorage.getItem('onLoanBooks')) || [];
  allOnLoan = allOnLoan.filter(b => b.title !== book.title);
  localStorage.setItem('onLoanBooks', JSON.stringify(allOnLoan));

  this.loadOnLoan(); // 加这一行以同步 onLoanList

  // 更新 DUE Soon 列表
  this.loadDueSoon();
}
  }
}
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

.empty-text {
  text-align: center;
  margin-top: 30px;
  color: #999;
  font-size: 18px;
}
</style>

