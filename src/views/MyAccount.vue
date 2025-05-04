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
          :icon="ChatLineRound"
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
import { ElIconChatLineRound } from '@element-plus/icons-vue';

export default {
  name: 'MyAccount',
  
  components: {
    ElIconChatLineRound,
  },
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
    },
    userId() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user?.id || user?.userId || null;
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
    
    async toggleFavorite(book) {
  try {
    book.favorite = !book.favorite;
    await this.$axios.post(`/wishlist/update`, {
      userId: this.userId,
      ebookId: book.id,
      favorite: book.favorite
    });
    this.$message.success(`Book "${book.title}" has been ${book.favorite ? 'added to' : 'removed from'} wishlist.`);
  } catch (error) {
    this.$message.error('Failed to update wishlist.');
    book.favorite = !book.favorite; // 回滚本地状态
  }
},

    async loanBook(book) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser?.userId;

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

    async loadOnLoan() {
  try {
    const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    const res = await this.$axios.get(`/loans?account_id=${userId}&status=active`);
    const books = await Promise.all(
      res.data.map(async (loan) => {
        const bookRes = await this.$axios.get(`/ebooks/${loan.ebook_id}`);
        return {
          id: loan.ebook_id,
          title: bookRes.data.title,
          author: bookRes.data.author,
          rentalStartDate: loan.start_date,
          expirationDate: loan.return_date
        };
      })
    );
    this.onLoanList = books;
  } catch (error) {
    console.error('Failed to load on-loan books:', error);
    this.onLoanList = [];
  }
},

    async loadDueSoon() {
  try {
    const res = await this.$axios.get(`/loans?account_id=${this.userId}&status=active`);
    const today = new Date();
    const dueThreshold = new Date();
    dueThreshold.setDate(today.getDate() + 30);//先写成30天，以方便测试功能，正式提交前改回7天

    const formatDate = (str) => {
      const [day, month, year] = str.split('/');
      return new Date(+year, +month - 1, +day);
    };

    const books = await Promise.all(
      res.data.map(async (loan) => {
        const bookRes = await this.$axios.get(`/ebooks/${loan.ebook_id}`);
        return {
          id: loan.ebook_id,
          title: bookRes.data.title,
          author: bookRes.data.author,
          rentalStartDate: loan.start_date,
          expirationDate: loan.return_date
        };
      })
    );

    this.dueSoonList = books.filter(book => {
      const dueDate = formatDate(book.expirationDate);
      return dueDate >= today && dueDate <= dueThreshold;
    });
  } catch (error) {
    console.error('Failed to load due soon books:', error);
    this.dueSoonList = [];
  }
},

async returnBook(book) {
  try {
    const res = await this.$axios.get(`/loans?account_id=${this.userId}&status=active`);
    const matchedLoan = res.data.find(loan => loan.ebook_id === book.id);

    if (!matchedLoan) {
      this.$message.warning('Loan record not found.');
      return;
    }

    await this.$axios.delete(`/loans/${matchedLoan.id}`);
    this.$message.success(`You have returned "${book.title}" successfully!`);

    this.loadOnLoan();
    this.loadDueSoon(); // 重新从接口获取
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

