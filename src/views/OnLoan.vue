<template>
  <div class="on-loan-page">
    <h2 class="page-title">On Loan</h2>
    <el-table :data="onLoanList" border style="width: 100%">
      <el-table-column prop="title" label="Book" align="center"></el-table-column>
      <el-table-column prop="author" label="Author" align="center"></el-table-column>
      <el-table-column prop="rentalStartDate" label="Rental Start Date" align="center"></el-table-column>
      <el-table-column prop="expirationDate" label="Expiration Date" align="center"></el-table-column>
      <el-table-column label="Comment" align="center">
        <template #default="scope">
          <el-button
            icon="el-icon-chat-line-round"
            circle
            size="small"
            @click="commentBook(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'OnLoan',
  data() {
    return {
      onLoanList: []
    };
  },
  created() {
    this.fetchOnLoan();
  },
  methods: {
    async fetchOnLoan() {
      try {
        const res = await request.get('/onloan');
        this.onLoanList = res.data || [];
      } catch (error) {
        console.error('Failed to fetch onloan list', error);
      }
    },
    commentBook(book) {
      this.$message.success(`You clicked comment on \"${book.title}\"!`);
    }
  }
}
</script>

<style scoped>
.on-loan-page {
  max-width: 1000px;
  margin: auto;
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
}
</style>
