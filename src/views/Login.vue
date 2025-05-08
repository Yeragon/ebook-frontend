<!--
  FileName：Login.vue
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：10/04/2025
  Last modified time：08/05/2025
  Module：User side - Login page
  Functions：
  1. Provide a login form for users with email and password fields;
  2. Perform input validation with Element Plus form rules;
  3. Navigate to Reset Password or Register page as needed;
  4. Trigger login process and redirect to dashboard on success;
  5. Allow return to Home page via a quick access button.
-->
<template>
  <div class="login-page">
    <div class="form-wrapper">
      <!-- Header -->
      <h1 class="logo">Ebooks</h1>

      <el-form :model="form" :rules="rules" ref="loginForm" label-position="top" class="login-form">
         <!-- Email -->
        <el-form-item label="Email" prop="email" class="input-item">
          <el-input v-model="form.email" placeholder="Enter your email address"></el-input>
        </el-form-item>
         <!-- Password -->
        <el-form-item label="Password" prop="password" class="input-item">
          <el-input v-model="form.password" type="password" placeholder="Enter your password" show-password></el-input>
        </el-form-item>

         <!-- Navigate to Register page or ResetPassword page -->
        <div class="form-links">
          <el-link type="primary" @click="$router.push('/resetpassword')">Forgot Password?</el-link>
          <span> or </span>
          <el-link type="primary" @click="$router.push('/register')">Create a new account</el-link>
        </div>

         <!-- Submit and Login -->
        <el-form-item>
          <el-button type="primary" class="login-button" @click="submitLogin">Login</el-button>
        </el-form-item>
      </el-form>

       <!-- Navigate to Home page -->
      <el-button type="text" class="back-home" @click="$router.push('/')">← Back to Home</el-button>
    </div>
  </div>
</template>

<script>

import request from '@/utils/request';
/*
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：10/04/2025
  Functions description：
    This script section implements the following logic:
      - submitLogin：Validate user inputs and send login request to backend;
      - Handle login result by storing user info into localStorage;
      - Redirect successfully logged-in user to dashboard;
      - Show appropriate message based on login success or failure.

  Tech Stack:
    - Vue 3 Options API
    - Element Plus UI library
    - Axios for asynchronous login request
    - Form validation and routing
*/
export default {
  name: 'Login',
  data() {
    // Data used to store form values and validation rules
    return {
      form: {
        email: '',
        password: ''
      },
      // Validation rules for email and password
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
    // Validate the form fields before making the API request
    submitLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            // Send login request to the backend
            const userData = await request.post('/login', this.form);
             // Store the user data in localStorage if login is successful
            localStorage.setItem('currentUser', JSON.stringify(userData));
            // Show a success message
            this.$message.success(userData.message || 'Login successful!');
            // Redirect to the dashboard after successful login
            this.$router.push('/dashboard');

          } catch (error) {
            console.error('Login failed', error);
            // Show an error message if login fails
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
