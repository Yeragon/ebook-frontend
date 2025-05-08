<!-- Topup.vue Made by Yuandong Li Start date: 12/04/2025 -->
<template>
  <div class="topup-page">
    <!-- Header -->
    <div class="header">
      <h1 class="logo" @click="$router.push('/dashboard')">Ebooks</h1>
      <el-avatar :src="userAvatar" @click="$router.push('/account')" />
    </div>

    <!-- Top-up form card -->
    <el-card class="topup-card">
      <h2>Top Up Your Balance</h2>

      <el-form :model="form" label-position="top">
        <el-form-item label="Amount (£)">
          <el-input-number v-model="form.amount" :min="1" :max="1000" style="width: 100%;"></el-input-number>
        </el-form-item>

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

export default {
  setup() {
    const router = useRouter();
    const form = ref({
      amount: 10
    });
    const userAvatar = ref('https://via.placeholder.com/100');

    const userId = JSON.parse(localStorage.getItem('currentUser'))?.userId;

    const handleTopUp = async () => {
      if (form.value.amount <= 0) {
        ElMessage.error('Please enter a valid amount.');
        return;
      }
      try {
        const res = await request.get(`/api/payment/horsepayurl?userId=${userId}&amount=${form.value.amount}`);
        const paymentUrl = res.data.url;
        if (paymentUrl) {
          window.location.href = paymentUrl; 
        } else {
          ElMessage.error('Failed to get payment URL.');
        }
      } catch (error) {
        ElMessage.error('Top up failed.');
      }
    };

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
