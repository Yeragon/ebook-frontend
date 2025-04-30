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
          icon="el-icon-chat-line-round"
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
import { Money } from '@element-plus/icons-vue'

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
    loanBook(book) {

      // 先获取当前借阅书籍列表
  let allOnLoan = JSON.parse(localStorage.getItem('onLoanBooks')) || [];

// 检查是否已借满 10 本
if (allOnLoan.length >= 10) {
  this.$message.error('You cannot loan more than 10 books at a time.');
  return; // 阻止继续执行借书流程
}

       // 获取当前日期
  const currentDate = new Date();

// 设置借书的到期日期为当前日期加 30 天
const expirationDate = new Date(currentDate);
expirationDate.setDate(currentDate.getDate() + 30);

// 将日期格式化为 dd/mm/yyyy
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// 设置开始和结束日期（格式为 dd/mm/yyyy）
book.rentalStartDate = formatDate(currentDate);
book.expirationDate = formatDate(expirationDate);

// 保存到本地存储（更新 onLoanBooks 列表）
allOnLoan.push(book);
localStorage.setItem('onLoanBooks', JSON.stringify(allOnLoan));

// 更新 DUE Soon 列表
this.loadDueSoon();
      
this.$message.success(`You loaned "${book.title}" successfully!`);
      // 这里可以加实际借书逻辑
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

