<!--
  FileName：ResetPassword.vue
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：10/04/2025
  Last modified time：08/05/2025
  Module：User side - Reset Password page
  Functions：
    1. Provide a form for users to reset their password using their registered email;
    2. Perform input validation with Element Plus form rules, including matching new password and confirm password;
    3. Send reset request to the backend and handle success or failure;
    4. Allow return to Login page after successful password reset.
-->
<template>
  <div class="reset-password-page">
    <div class="form-wrapper">
      <!-- Header -->
      <h1 class="logo">Ebooks</h1>
      <!-- Reset Password Form -->
      <el-form :model="form" :rules="rules" ref="resetForm" label-position="top" class="reset-form">
        <!-- Email Input -->
        <el-form-item label="Email" prop="email" class="input-item">
          <el-input v-model="form.email" placeholder="Enter your registered email"></el-input>
        </el-form-item>

        <!-- New Password Input -->
        <el-form-item label="New Password" prop="newPassword" class="input-item">
          <el-input v-model="form.newPassword" type="password" placeholder="Enter new password" show-password></el-input>
        </el-form-item>

        <!-- Confirm New Password Input -->
        <el-form-item label="Confirm New Password" prop="confirmPassword" class="input-item">
          <el-input v-model="form.confirmPassword" type="password" placeholder="Confirm new password" show-password></el-input>
        </el-form-item>

        <!-- Link to Login Page -->
        <div class="form-links">
          <el-link type="primary" @click="$router.push('/login')">Back to Login</el-link>
        </div>

        <!-- Reset Password Button -->
        <el-form-item>
          <el-button type="primary" class="reset-button" @click="submitReset">Reset Password</el-button>
        </el-form-item>
      </el-form>

      <!-- Link to Home Page -->
      <el-button type="text" class="back-home" @click="$router.push('/')">← Back to Home</el-button>
    </div>
  </div>
</template>

<script>
/*
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：10/04/2025
  Functions description：
    This script section implements the following logic:
      - submitReset: Validate user inputs and send password reset request to the backend;
      - Ensure new password and confirm password match before making the request;
      - Handle reset result by displaying appropriate success/error messages;
      - Redirect the user to the login page after successful password reset.

  Tech Stack:
    - Vue 3 Options API
    - Element Plus UI library
    - Axios for asynchronous request to change password
    - Form validation and routing
*/

import request from '@/utils/request';

export default {
  name: 'ResetPassword',
  data() {
    return {
      form: {
  email: '',
  //oldPassword: '',
  newPassword: '',
  confirmPassword: ''
},
// Validation rules for email, new password, and confirm password
rules: {
  email: [
    { required: true, message: 'Please input your registered email', trigger: 'blur' },
    { type: 'email', message: 'Please input a valid email', trigger: ['blur', 'change'] }
  ],
  newPassword: [
    { required: true, message: 'Please input your new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your new password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== this.form.newPassword) { //Confirm passwords match or not
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
    // Handle password reset form submission
    async submitReset() {
      // Validate form inputs before making the API request
  this.$refs.resetForm.validate(async (valid) => {
    if (valid) {
       // Ensure the new passwords match before making the request
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.$message.error('New passwords do not match.');
        return;
      }

      try {
        // Send password reset request to the backend
        await request.post('/changepassword', {
          email: this.form.email,
          
          newPassword: this.form.newPassword
        });
        // Show success message
        this.$message.success('Password changed successfully. Please login again.');
        // Redirect to the login page after successful password reset
        this.$router.push('/login');
      } catch (error) {
         // Show an error message if password change fails
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
