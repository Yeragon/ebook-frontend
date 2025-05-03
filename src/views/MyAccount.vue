<template>
  <div class="my-account-page">
    <!-- 顶部 -->
    <header class="header">
      <h1 class="logo" @click="goHome">Ebooks</h1>
      <el-button :icon="moneyIcon" circle style="border: none;  cursor: pointer;" @click="goToTopUp"/>
    </header>

    <div class="content">
      <h2 class="title">My Account</h2>
      <el-avatar size="large" class="avatar" :src="user.avatar || ''"></el-avatar>

      <!-- Tabs区域 -->
      <el-tabs v-model="activeTab" class="tabs" @tab-click="handleTabClick">
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
                <el-button @click="toggleFavorite(scope.row)" class="star-button">
                 <span class="star-icon" :style="{ color: scope.row.tempFavorite ? '#f7c843' : '#ccc' }"></span>
                </el-button>
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
import { Money } from '@element-plus/icons-vue'
import { ChatLineRound } from '@element-plus/icons-vue';
import { StarFilled } from '@element-plus/icons-vue';
import axios from 'axios';


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
      userId: '',
      profileFields: {
        email: { label: 'E-mail:' },
        fullName: { label: 'Full Name:' },
        phoneNumber: { label: 'Phone Number:' },
        dateOfBirth: { label: 'Date Of Birth:' },
        balance: { label: 'Balance(£):' }
      },
      wishlist: [],
      wishlistModified: {}, // 用于记录用户是否点击过取消收藏
      onLoanList: [],
      dueSoonList: [],
      moneyIcon: h(Money),
      chatIcon: h(ChatLineRound),
      starIcon: h(StarFilled),
    };
  },
  created() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id || ''; // ✅ 保存 userId
      this.user = {
        email: user.email,
        fullName: user.name || '',
        dateOfBirth: user.dateOfBirth || '',
        balance: user.balance || 0,
        avatar: user.avatar || ''
      };
    }
    console.log('Loaded userId:', this.userId); // 确认 userId 是否加载正确
    this.loadWishlist();
    this.loadOnLoan();
    this.loadDueSoon();
  },
  computed: {
    filteredWishlist() {
      return this.wishlist;
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
    goToTopUp(){
      this.$router.push('/topup');
    },
    
    toggleFavorite(book) {
  book.tempFavorite = !book.tempFavorite;
  // 临时记录点击行为，但不提交后端
  this.wishlistModified[book.id] = !book.tempFavorite; // true 表示“待删除”
},

    handleTabClick(tab) {
  if(tab.name !=='wishlist'){
    this.processWishlistChanges();
  }
  if (tab.name === 'duesoon') {
    this.loadDueSoon();
  } else if (tab.name === 'onloan') {
    this.loadOnLoan();
  } else if (tab.name === 'wishlist') {
    this.loadWishlist();
  }
},

async processWishlistChanges() {
  const booksToRemove = Object.entries(this.wishlistModified)
    .filter(([_, toRemove]) => toRemove) // 只找 tempFavorite 被取消的书
    .map(([id]) => id);

  if (booksToRemove.length === 0) return;

  try {
    for (const bookId of booksToRemove) {
      await this.$axios.patch(`/users/${this.userId}/wishlist`, {
        ebook_id: bookId,
        favorite: false
      });
    }

    this.$message.success('Removed books from wishlist.');
    this.loadWishlist(); // 重新加载数据
  } catch (error) {
    console.error('Failed to remove books:', error);
    this.$message.error('Failed to update wishlist.');
  }

  this.wishlistModified = {}; // 清除缓存记录
},

async removeFromWishlist(book) {
  try {
    const res = await this.$axios.get(`/users/${this.userId}`);
    const currentWishlist = res.data.wishlist || [];

    const updatedWishlist = currentWishlist.filter(item => item.id !== book.id);

    await this.$axios.patch(`/users/${this.userId}`, {
      wishlist: updatedWishlist
    });

    // 更新本地列表（UI 同步）
    this.wishlist = this.wishlist.filter(item => item.id !== book.id);

    this.$message.success(`Removed "${book.title}" from wishlist.`);
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    this.$message.error('Failed to remove book from wishlist.');
  }
},


    async loanBook(book) {
  try {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    const userId = userData?.id;
    if (!userId) {
      this.$message.error('User not logged in!');
      return;
    }

    // 获取用户当前借阅记录
    const res = await this.$axios.get(`/loans?account_id=${userId}`);
    const existingLoan = res.data.find(loan => loan.ebook_id === book.id && loan.status === 'active');

    if (existingLoan) {
      this.$message.warning('You have already borrowed this book and not returned it yet!');
      return;
    }

    // 检查是否超过借阅限制
    const activeLoans = res.data.filter(loan => loan.status === 'active');
    if (activeLoans.length >= 10) {
      this.$message.error('You cannot loan more than 10 books at a time.');
      return;
    }

    // 设置借阅起止日期
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + 30);

    const formatDate = (date) => {
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    // 提交借阅记录到后端
    const loanPayload = {
      account_id: userId,
      ebook_id: book.id,
      start_date: formatDate(today),
      return_date: formatDate(expirationDate),
      status: 'active'
    };

    await this.$axios.post('/loans', loanPayload);
    this.$message.success(`You loaned "${book.title}" successfully!`);

    // 更新 onLoanList 和 dueSoonList
    this.loadOnLoan();
    this.loadDueSoon();
  } catch (error) {
    console.error('Loan book failed:', error);
    this.$message.error('Failed to loan book.');
  }
},
    async loadWishlist() {
      try {
    const res = await this.$axios.get(`/users/${this.userId}`);
    this.wishlist = (res.data.wishlist || []).map(book => ({
      ...book,
      tempFavorite: book.favorite  // 初始化临时收藏状态
    }));
    } catch (error) {
    console.error('Failed to load wishlist from server', error);
    this.wishlist = [];
    }
  },

    async saveWishlist() {
  try {
    // 调试输出 userId 是否存在
    console.log('Saving wishlist for userId:', this.userId);
    
    if (!this.userId) {
      this.$message.error('User ID is missing!');
      return; // 如果没有 userId，提前返回，避免发送请求
    }

    const updatedFavorites = this.wishlist
      .filter(book => book.tempFavorite)
      .map(book => ({ id: book.id, title: book.title })); // 最小化数据发送

      if (updatedFavorites.length === 0) {
        console.log('No favorites to update');
        return; // 如果没有收藏项需要更新，直接返回
      }

      console.log('Updating wishlist with the following data:', updatedFavorites);  // 调试信息

    const response = await axios.patch(`/users/${this.userId}`, {
      wishlist: updatedFavorites
    });

    // 检查返回的响应
    console.log('Response from the server:', response);

    if (response.status === 200) {
      this.$message.success('Wishlist saved!');
    } else {
      throw new Error('Failed to update wishlist: Unexpected response');
    }
  } catch (error) {
    console.error('Error saving wishlist:', error);  // 输出详细错误信息
    this.$message.error('Failed to update wishlist.');
  }
},

async loadOnLoan() {
  try {
    const res = await this.$axios.get(`/loans?account_id=${this.userId}&status=active`);
    const loanData = res.data;

    // 假设每本书都带有 title/author，如果没有需要额外请求 book 数据
    const bookPromises = loanData.map(async (loan) => {
      const bookRes = await this.$axios.get(`/ebooks/${loan.ebook_id}`);
      return {
        id: loan.ebook_id,
        title: bookRes.data.title,
        author: bookRes.data.author,
        rentalStartDate: loan.start_date,  // 根据字段名
        expirationDate:  loan.return_date     // 根据字段名
      };
    });

    const booksOnLoan = await Promise.all(bookPromises);
    this.onLoanList = booksOnLoan;

    // 可选：更新 localStorage 缓存（用于 dueSoon）
    localStorage.setItem(`onLoanBooks_${this.userId}`, JSON.stringify(booksOnLoan));
  } catch (error) {
    console.error('Failed to load on-loan books:', error);
    this.onLoanList = [];
  }
},
    
    commentBook(book) {
    this.$router.push({
    name: 'BookDetail',
    params: { id: book.id },
    query: { showComment: 'true' }
    });
    },


    loadDueSoon() {
      const allBooks = JSON.parse(localStorage.getItem(`onLoanBooks_${this.userId}`)) || [];
      const today = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(today.getDate() + 30);

    const parseDate = (str) => {
    const [day, month, year] = str.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

    this.dueSoonList = allBooks.filter(book => {
      const dueDate = parseDate(book.expirationDate);
      return dueDate >= today && dueDate <= sevenDaysLater;
    });
   },
    
   async returnBook(book) {
  try {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    const userId = userData?.id;
    if (!userId) {
      this.$message.error('User not logged in!');
      return;
    }

    // 查询当前用户的 loan 记录
    const res = await this.$axios.get(`/loans?account_id=${userId}`);
    const matchedLoan = res.data.find(
      loan => loan.ebook_id === book.id && loan.status === 'active'
    );

    if (!matchedLoan) {
      this.$message.warning('Loan record not found.');
      return;
    }

    // 删除该 loan 记录
    await this.$axios.delete(`/loans/${matchedLoan.id}`);
    this.$message.success(`You have returned "${book.title}" successfully!`);

    // 更新 localStorage 中 onLoanBooks
    const key = `onLoanBooks_${userId}`;
    let allOnLoan = JSON.parse(localStorage.getItem(key)) || [];
    allOnLoan = allOnLoan.filter(b => b.id !== book.id);  // 注意使用 book.id
    localStorage.setItem(key, JSON.stringify(allOnLoan));

    // 重新加载列表
    this.loadOnLoan();
    this.loadDueSoon();
  } catch (error) {
    console.error('Error returning book:', error);
    this.$message.error('Failed to return book.');
  }
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

.el-table {
  max-height: 400px; /* 设置最大高度 */
  overflow-y: auto;  /* 内容溢出时启用垂直滚动 */
  margin-top: 10px;
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

.star-button {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.star-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: transparent;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  background-color: currentColor;
}
</style>

