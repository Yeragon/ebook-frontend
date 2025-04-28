<template>
  <div class="wishlist-page">
    <h2 class="page-title">My Wishlist</h2>
    <el-table :data="wishlist" border style="width: 100%">
      <el-table-column prop="title" label="Book" align="center"></el-table-column>
      <el-table-column prop="author" label="Author" align="center"></el-table-column>
      <el-table-column prop="available" label="Available" align="center">
        <template #default="scope">
          <span>{{ scope.row.available ? 'Yes' : 'No' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Loan" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.available"
            type="warning"
            size="small"
            @click="loanBook(scope.row)"
          >Loan</el-button>
          <el-button
            v-else
            type="info"
            size="small"
            disabled
          >Loan</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Favorite" align="center">
        <template>
          <el-button icon="el-icon-heart" circle type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'Wishlist',
  data() {
    return {
      wishlist: []
    };
  },
  created() {
    this.fetchWishlist();
  },
  methods: {
    async fetchWishlist() {
      try {
        const res = await request.get('/wishlist');
        this.wishlist = res.data || [];
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
      }
    },
    loanBook(book) {
      this.$message.success(`You loaned \"${book.title}\" successfully!`);
      // 后续可以在这里添加实际借阅逻辑
    }
  }
}
</script>

<style scoped>
.wishlist-page {
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
