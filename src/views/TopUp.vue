<template>
  <div class="topup-page">
    <!-- 顶部导航 -->
    <div class="header">
      <h1 class="logo" @click="$router.push('/dashboard')">Ebooks</h1>
      <el-button 
        circle 
        @click="$router.go(-1)" 
        style="border: none; cursor: pointer;">
        <el-icon><ArrowLeft /></el-icon>
        </el-button>
    </div>

    <!-- 充值表单 -->
    <el-card class="topup-card">
      <h2>Top Up Your Balance</h2>

      <el-form :model="form" label-position="top">
        <el-form-item label="Amount (£)">
          <el-input-number v-model="form.amount" :min="0" :max="1000" style="width: 100%;"></el-input-number>
        </el-form-item>

        <div class="form-actions">
          <el-button type="success" @click="handleTopUp">Top Up</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { ElIcon } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

export default {
  component: {
    components: {
      ElIcon,
      ArrowLeft
    }
  },
  setup() {
    const router = useRouter();
    const form = ref({
      amount: 0
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
