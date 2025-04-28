<template>
  <div class="edit-page">
    <h2 class="page-title">Edit My Information</h2>
    <el-form :model="form" :rules="rules" ref="editForm" label-width="120px" class="edit-form">
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" disabled></el-input>
      </el-form-item>

      <el-form-item label="Full Name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="Phone Number" prop="phoneNumber">
        <el-input v-model="form.phoneNumber"></el-input>
      </el-form-item>

      <el-form-item label="Date Of Birth" prop="dateOfBirth">
        <el-date-picker
          v-model="form.dateOfBirth"
          type="date"
          placeholder="Pick a day"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <div class="button-group">
        <el-button type="primary" :loading="saving" @click="submitEdit">Save</el-button>
        <el-button @click="goBack">Back</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'EditPage',
  data() {
    return {
      saving: false,
      form: {
        email: '',
        name: '',
        phoneNumber: '',
        dateOfBirth: ''
      },
      rules: {
        name: [{ required: true, message: 'Full name is required', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: 'Phone number is required', trigger: 'blur' }],
        dateOfBirth: [{ required: true, message: 'Date of birth is required', trigger: 'change' }]
      }
    };
  },
  created() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.form.email = user.email;
      this.form.name = user.name || '';
      this.form.phoneNumber = user.phoneNumber || '';
      this.form.dateOfBirth = user.dateOfBirth || '';
    }
  },
  methods: {
    async submitEdit() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          try {
            this.saving = true;
            // 提交到后端接口（假设是 /api/account/update）
            await request.post('/api/account/update', {
              email: this.form.email,
              name: this.form.name,
              phoneNumber: this.form.phoneNumber,
              dateOfBirth: this.form.dateOfBirth
            });
            // 更新本地localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.name = this.form.name;
            currentUser.phoneNumber = this.form.phoneNumber;
            currentUser.dateOfBirth = this.form.dateOfBirth;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            this.$message.success('Information updated successfully!');
            this.$router.push('/myaccount');
          } catch (error) {
            this.$message.error('Failed to update information.');
          } finally {
            this.saving = false;
          }
        }
      });
    },
    goBack() {
      this.$router.push('/myaccount');
    }
  }
};
</script>

<style scoped>
.edit-page {
  max-width: 800px;
  margin: auto;
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
}

.edit-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style>
