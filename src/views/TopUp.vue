<!--
  FileName：TopUp.vue
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：12/04/2025
  Last modified time：08/05/2025
  Module：User side - Top-up Page
  Functions：
    1. Provide a page for the user to top up their balance;
    2. Allow the user to input the amount they want to add to their balance;
    3. Redirect to a payment page to process the top-up;
    4. Show success or error messages based on the result of the top-up request.
-->
<template>
  <div class="topup-page">
    <!-- Header -->
    <div class="header">
      <h1 class="logo" @click="$router.push('/dashboard')">Ebooks</h1>
      <el-avatar :src="userAvatar" @click="$router.push('/account')" />
    </div>

    <!-- Top Up Form Card -->
    <el-card class="topup-card">
      <h2>Top Up Your Balance</h2>
      <!-- Form to enter the top-up amount -->
      <el-form :model="form" label-position="top">
        <el-form-item label="Amount (£)">
          <el-input-number v-model="form.amount" :min="1" :max="1000" style="width: 100%;"></el-input-number>
        </el-form-item>
        <!-- Action button to initiate the top-up -->
        <div class="form-actions">
          <el-button type="success" @click="handleTopUp">Top Up Now</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';

/*
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：12/04/2025
  Functions description：
    - Provides a form for the user to top up their balance by specifying an amount;
    - When the top-up button is clicked, the system checks if the amount is valid;
    - If the amount is valid, it sends a request to the backend to get the payment URL;
    - Upon success, redirects the user to the payment page;
    - If the top-up fails, displays an error message;
*/

export default {
  setup() {
    const router = useRouter();
    const form = ref({
      amount: 10
    });
    const userAvatar = ref('https://via.placeholder.com/100');

    // Retrieve the userId from local storage for making the top-up request
    const userId = JSON.parse(localStorage.getItem('currentUser'))?.userId;

    // Method to handle the top-up process
    const handleTopUp = async () => {
      if (form.value.amount <= 0) {
        //Show error message
        ElMessage.error('Please enter a valid amount.');
        return;
      }
      try {
        // Send a request to the backend to get the payment URL for the top-up
        const res = await request.get(`/api/payment/horsepayurl?userId=${userId}&amount=${form.value.amount}`);
        const paymentUrl = res.data.url;
        // If a valid payment URL is returned, redirect to the payment page
        if (paymentUrl) {
          window.location.href = paymentUrl; 
        } else {
          // Show an error if the payment URL is not available
          ElMessage.error('Failed to get payment URL.');
        }
      } catch (error) {
        // Show an error if the top-up request fails
        ElMessage.error('Top up failed.');
      }
    };
    // Return data and methods to the template
    return {
      form,
      handleTopUp,
      userAvatar
    };
  }
};
</script>

<style scoped>
.topup-page {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  color: #00bcd4;
  font-family: 'Lucida Handwriting', cursive;
  font-size: 32px;
  cursor: pointer;
}

.topup-card {
  padding: 20px;
}

.form-actions {
  margin-top: 20px;
  text-align: right;
}
</style>
