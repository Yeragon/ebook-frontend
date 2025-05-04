<template>
  <div class="reset-password-page">
    <div class="form-wrapper">
      <h1 class="logo">Ebooks</h1>

      <el-form :model="form" :rules="rules" ref="resetForm" label-position="top" class="reset-form">
        <el-form-item label="Email" prop="email" class="input-item">
          <el-input v-model="form.email" placeholder="Enter your registered email"></el-input>
        </el-form-item>

        <!-- <el-form-item label="Current Password" prop="oldPassword" class="input-item">
  <el-input v-model="form.oldPassword" type="password" placeholder="Enter current password"></el-input>
</el-form-item> -->

<el-form-item label="New Password" prop="newPassword" class="input-item">
  <el-input v-model="form.newPassword" type="password" placeholder="Enter new password"></el-input>
</el-form-item>

<el-form-item label="Confirm New Password" prop="confirmPassword" class="input-item">
  <el-input v-model="form.confirmPassword" type="password" placeholder="Confirm new password"></el-input>
</el-form-item>


        <div class="form-links">
          <el-link type="primary" @click="$router.push('/login')">Back to Login</el-link>
        </div>

        <el-form-item>
          <el-button type="primary" class="reset-button" @click="submitReset">Reset Password</el-button>
        </el-form-item>
      </el-form>

      <el-button type="text" class="back-home" @click="$router.push('/')">← Back to Home</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'ResetPassword',
  data() {
    return {
      form: {
  email: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
},

rules: {
  email: [
    { required: true, message: 'Please input your registered email', trigger: 'blur' },
    { type: 'email', message: 'Please input a valid email', trigger: ['blur', 'change'] }
  ],
  // oldPassword: [
  //   { required: true, message: 'Please input your current password', trigger: 'blur' },
  //   { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  // ],
  newPassword: [
    { required: true, message: 'Please input your new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your new password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== this.form.newPassword) {
          callback(new Error('Passwords do not match'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
}

    }
  },
  methods: {
    async submitReset() {
  this.$refs.resetForm.validate(async (valid) => {
    if (valid) {
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.$message.error('New passwords do not match.');
        return;
      }

      try {
        await request.post('/changepassword', {
          email: this.form.email,
          // oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword
        });
        this.$message.success('Password changed successfully. Please login again.');
        this.$router.push('/login');
      } catch (error) {
        console.error('Password change failed', error);
        this.$message.error(error?.message || 'Password change failed.');
      }
    }
  });
}

  }
}
</script>

<style scoped>
.reset-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f7f7;
}

.form-wrapper {
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.logo {
  font-family: 'Lucida Handwriting', serif;
  font-size: 32px;
  color: #00bcd4;
  margin-bottom: 20px;
  text-align: center;
}

.reset-form {
  margin-top: 20px;
}

.input-item {
  text-align: left;
}

.form-links {
  margin: 20px 0;
  text-align: center;
}

.reset-button {
  width: 100%;
  background-color: #4d8dff;
  border-color: #4d8dff;
}

.back-home {
  margin-top: 20px;
  font-size: 14px;
  color: #4d8dff;
  width: 100%;
  text-align: center;
}
</style>
