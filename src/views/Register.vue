<!--
  FileName：Register.vue
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：10/04/2025
  Last modified time：08/05/2025
  Module：User side - Register page
  Functions：
    1. Provide a registration form for users with email, password, and confirm password fields;
    2. Perform input validation with Element Plus form rules;
    3. Ensure password and confirm password fields match;
    4. Trigger registration process and redirect to login page on success;
    5. Allow return to Home page via a quick access button.
-->
<template>
  <div class="register-page">
    <div class="form-wrapper">
      <!-- Header -->
      <h1 class="logo">Ebooks</h1>
      <!-- Registration Form -->
      <el-form :model="form" :rules="rules" ref="registerForm" label-position="top" class="register-form">
        <!-- Email Input -->
        <el-form-item label="Email" prop="email" class="input-item">
          <el-input v-model="form.email" placeholder="Enter your email address"></el-input>
        </el-form-item>
        <!-- Password Input -->
        <el-form-item label="Password" prop="password" class="input-item">
          <el-input v-model="form.password" type="password" placeholder="Enter your password" show-password></el-input>
        </el-form-item>
        <!-- Confirm Password Input -->
        <el-form-item label="Confirm Password" prop="confirmPassword" class="input-item">
          <el-input v-model="form.confirmPassword" type="password" placeholder="Confirm your password" show-password></el-input>
        </el-form-item>
        <!-- Link to Login Page -->
        <div class="form-links">
          <el-link type="primary" @click="$router.push('/login')">Back to Login</el-link>
        </div>
        <!-- Register Button -->
        <el-form-item>
          <el-button type="primary" class="register-button" @click="submitRegister">Register</el-button>
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
      - submitRegister: Validate user inputs and send registration request to the backend;
      - Handle registration result by displaying appropriate success/error messages;
      - Redirect the user to the login page after successful registration.

  Tech Stack:
    - Vue 3 Options API
    - Element Plus UI library
    - Axios for asynchronous registration request
    - Form validation and routing
*/
import request from '@/utils/request';

export default {
  name: 'Register',
  // Data used to store form values and validation rules
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      // Validation rules for email, password, and confirm password
      rules: {
        email: [
          { required: true, message: 'Please input your email address', trigger: 'blur' },
          { type: 'email', message: 'Please input a valid email address', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'Please input your password', trigger: 'blur' },
          { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Please confirm your password', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('Passwords do not match'));
              } else {
                callback();
              }
            }, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // Handle registration form submission
    async submitRegister() {
  this.$refs.registerForm.validate(async (valid) => {
    if (valid) {
      try {
        // Send registration request to the backend
        await request.post('/register', {
          email: this.form.email,
          password: this.form.password
        });
        // Show success message
        this.$message.success('Registration successful! Please login.');
        // Redirect to the login page after successful registration
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration failed', error);
        // Show an error message if registration fails
        this.$message.error(error?.message || 'Registration failed. Please try again.');
      }
    }
  });
}

  }
}
</script>

<style scoped>
.register-page {
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

.register-form {
  margin-top: 20px;
}

.input-item {
  text-align: left;
}
.form-links {
  margin: 20px 0;
  text-align: center;
}
.register-button {
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
