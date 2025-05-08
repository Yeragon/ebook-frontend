<!-- Login.vue Made by Xiaoyao Yu and Yuandong Li Start date: 12/04/2025 -->
<template>
  <div class="login-page">
    <div class="form-wrapper">
      <h1 class="logo">Ebooks</h1>

      <!-- Login Form with validation -->
      <el-form :model="form" :rules="rules" ref="loginForm" label-position="top" class="login-form">
        <!-- Email Input -->
        <el-form-item label="Email" prop="email" class="input-item">
          <el-input v-model="form.email" placeholder="Enter your email address"></el-input>
        </el-form-item>

        <!-- Password Input -->
        <el-form-item label="Password" prop="password" class="input-item">
          <el-input v-model="form.password" type="password" placeholder="Enter your password" show-password></el-input>
        </el-form-item>

        <!-- Forgot Password and Register Links -->
        <div class="form-links">
          <el-link type="primary" @click="$router.push('/resetpassword')">Forgot Password?</el-link>
          <span> or </span>
          <el-link type="primary" @click="$router.push('/register')">Create a new account</el-link>
        </div>

        <!-- Submit Login Button -->
        <el-form-item>
          <el-button type="primary" class="login-button" @click="submitLogin">Login</el-button>
        </el-form-item>
      </el-form>

      <!-- Back to Home Button -->
      <el-button type="text" class="back-home" @click="$router.push('/')">← Back to Home</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'Login',
  data() {
    return {
      // Form data for login
      form: {
        email: '',
        password: ''
      },
      // Validation rules
      rules: {
        email: [
          { required: true, message: 'Please input your email address', trigger: 'blur' },
          { type: 'email', message: 'Please input a valid email address', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'Please input your password', trigger: 'blur' },
          { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // Handle login submission
    submitLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            // Send login request to backend
            const userData = await request.post('/login', this.form);

            // Store user info in localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));
            // Show success message and redirect
            this.$message.success(userData.message || 'Login successful!');
            this.$router.push('/dashboard');

          } catch (error) {
            console.error('Login failed', error);
            this.$message.error('Login failed. Please check your credentials.');
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.login-page {
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

.login-form {
  margin-top: 20px;
}

.input-item {
  text-align: left;
}

.form-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-button {
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
