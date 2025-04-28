<template>
  <div class="my-account-page">
    <header class="header">
      <h1 class="logo" @click="goHome" style="color: #00bcd4; font-family: 'Lucida Handwriting'; cursor: pointer;">Ebooks</h1>
      <el-button icon="el-icon-money" circle style="border: none; cursor: pointer;"></el-button>
    </header>

    <div class="content">
      <h2 class="title">My Account</h2>
      <el-avatar size="large" class="avatar" :src="user.avatar || ''"></el-avatar>

      <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="tabs">
        <el-tab-pane label="Profile" name="profile">
          <el-form :model="user" label-width="150px" class="profile-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="E-mail:">
                  <el-input v-model="user.email" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Password:">
                  <el-input value="********" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Full Name:">
                  <el-input v-model="user.fullName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Phone Number:">
                  <el-input v-model="user.phoneNumber" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Date Of Birth:">
                  <el-input v-model="user.dateOfBirth" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Balance:">
                  <el-input v-model="user.balance" disabled><template #prefix><span style="margin-left: 8px;">£ </span></template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div class="button-group">
            <el-button type="primary" @click="goToEdit">Edit</el-button>
            <el-button type="danger" @click="logout">Exit</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Wishlist" name="wishlist"></el-tab-pane>
        <el-tab-pane label="DUE Soon" name="duesoon"></el-tab-pane>
        <el-tab-pane label="On loan" name="onloan"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
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
      }
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
  },
  methods: {
    goHome(){
      this.$router.push('/dashboard');
    },
    logout() {
      localStorage.removeItem('currentUser');
      this.$message.success('Logged out successfully!');
      this.$router.push('/');
    },
    handleTabClick(tab) {
      if (tab.name === 'profile') {
        this.$router.push('/myaccount');
      } else if (tab.name === 'wishlist') {
        this.$router.push('/wishlist');
      } else if (tab.name === 'duesoon') {
        this.$router.push('/duesoon');
      } else if (tab.name === 'onloan') {
        this.$router.push('/onloan');
      }
    },
    goToEdit() {
      this.$router.push('/editpage');
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
</style>
