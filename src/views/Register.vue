<template>
  <div class="register-page">
    <div class="form-wrapper">
      <h1 class="logo">Ebooks</h1>

      <el-form :model="form" :rules="rules" ref="registerForm" label-position="top" class="register-form">
        <el-form-item label="Email" prop="email" class="input-item">
          <el-input v-model="form.email" placeholder="Enter your email address"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password" class="input-item">
  <el-input
    v-model="form.password"
    type="password"
    placeholder="Enter your password"
    show-password
  ></el-input>
</el-form-item>


        <el-form-item label="Confirm Password" prop="confirmPassword" class="input-item">
  <el-input
    v-model="form.confirmPassword"
    type="password"
    placeholder="Confirm your password"
    show-password
  ></el-input>
</el-form-item>


        <div class="form-links">
          <el-link type="primary" @click="$router.push('/login')">Back to Login</el-link>
        </div>

        <el-form-item>
          <el-button type="primary" class="register-button" @click="submitRegister">Register</el-button>
        </el-form-item>
      </el-form>

      <el-button type="text" class="back-home" @click="$router.push('/')">← Back to Home</el-button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: ''
      },
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
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateConfirmPassword(rule, value, callback) {
    if (value !== this.form.password) {
      callback(new Error('Passwords do not match'));
    } else {
      callback();
    }
  },

    submitRegister() {
      this.$refs.registerForm.validate(async (valid) => {
    if (valid) {
      try {
        const { data: existingUsers } = await request.get(`/users?email=${this.form.email}`);
        if (existingUsers.length > 0) {
          this.$message.warning('Email is already registered.');
          return;
        }

        await request.post('/users', {
          email: this.form.email,
          password: this.form.password
        });

        this.$message.success('Registration successful! Please login.');
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration failed', error);
        this.$message.error('Registration failed. Please try again.');
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
