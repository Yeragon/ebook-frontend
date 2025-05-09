<template>
  <div class="due-soon-page">
    <h2 class="page-title">Due Soon</h2>
    <el-table :data="dueSoonList" border style="width: 100%">
      <el-table-column prop="title" label="Book" align="center"></el-table-column>
      <el-table-column prop="author" label="Author" align="center"></el-table-column>
      <el-table-column prop="rentalStartDate" label="Rental Start Date" align="center"></el-table-column>
      <el-table-column prop="expirationDate" label="Expiration Date" align="center"></el-table-column>
      <el-table-column label="Return" align="center">
        <template #default="scope">
          <el-button
            type="warning"
            size="small"
            @click="returnBook(scope.row)"
          >Return</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/*
  Author: Xiaoyao Yu
  Created: April 27, 2025
  Last Modified: May 8, 2025
  Module: User Side - Due Soon Page
  Description:
    - Displays a table of books that are approaching their due date
    - Allows users to return books by clicking the "Return" button
    - Fetches due-soon loan data from the backend on component creation
*/
import request from '@/utils/request';

export default {
  name: 'DueSoon',
  data() {
    return {
      dueSoonList: []
    };
  },
  created() {
    this.fetchDueSoon();
  },
  methods: {
    /**
     * @method fetchDueSoon
     * @description Sends a GET request to the backend to retrieve books that are due soon.
     * Populates `dueSoonList` with the response data or sets to empty array on failure.
     * @author Xiaoyao Yu
     * @date 2025-04-29
     */
    async fetchDueSoon() {
      try {
        const res = await request.get('/duesoon');
        this.dueSoonList = res.data || [];
      } catch (error) {
        console.error('Failed to fetch duesoon list', error);
      }
    },
    returnBook(book) {
      this.$message.success(`You have returned \"${book.title}\" successfully!`);
    }
  }
}
</script>

<style scoped>
.due-soon-page {
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
