<!-- src/views/BookDetail.vue -->
<template>
  <div class="book-detail-container">
    <!-- 顶部导航 -->
    <div class="header">
  <h1 class="logo" @click="$router.push('/dashboard')">Ebooks</h1>
  <div class="header-actions">
    <el-avatar :src="currentUser.avatar || ''" icon="el-icon-user" style="cursor: pointer;" @click="$router.push('/myaccount')" />
    <span class="user-name">{{ currentUser.name || 'User' }}</span>
    <span class="separator">|</span>
    <el-button type="text" @click="logout">Logout</el-button>
  </div>
</div>


    <!-- 书籍信息 -->
    <div class="book-info">
      <el-image :src="book.coverURL" style="width: 200px; height: 300px;"></el-image>
      <div class="book-meta">
        <h2>{{ book.title }}</h2>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Category:</strong> {{ book.category }}</p>
        <p><strong>Description:</strong> {{ book.description }}</p>

        <div class="actions">
          <el-button type="primary" @click="loanBook">📖 Loan</el-button>
          <el-button type="warning" @click="addToWishlist">⭐ Wishlist</el-button>
          <el-button type="info" @click="commentDialogVisible = true">💬 Comment</el-button>
        </div>
      </div>
    </div>

    <!-- 留言弹窗 -->
    <el-dialog title="Leave a Comment" v-model="commentDialogVisible">
      <el-input
        type="textarea"
        v-model="newComment"
        placeholder="Write your comment here..."
        rows="4"
      />
      <template #footer>
        <el-button @click="commentDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitComment">Submit</el-button>
      </template>
    </el-dialog>

    <!-- 最新评论 -->
    <div class="section-header">
      <h2>Latest Comments</h2>
    </div>
    <div v-if="comments.length > 0">
      <el-card v-for="comment in comments" :key="comment.id" class="comment-card">
        <p><strong>{{ comment.username }}:</strong> {{ comment.content }}</p>
      </el-card>
    </div>
    <div v-else class="no-comment">No comments yet.</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

export default {
  name: 'BookDetail',
  data() {
  return {
    currentUser: {}
  };
},
created() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  },

  mounted() {
    console.log('Route query:', this.$route.query);
  if (this.$route.query.showComment === 'true') {
    this.openCommentDialog();
  }
},

  methods: {
    openCommentDialog() {
    this.showCommentModal = true; // 控制你的弹窗显示
    // 删除 ?showComment=true，避免再次打开
    this.$router.replace({ 
      name: this.$route.name, 
      params: this.$route.params, 
      query: {} 
    });
  },

    logout() {
      localStorage.removeItem('currentUser');
      this.$message.success('Logged out successfully!');
      this.$router.push('/');
    }
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    //const bookId = route.params.id;
    const book = ref({});
    const comments = ref([]);
    const commentDialogVisible = ref(false);
    const newComment = ref('');
    const userAvatar = ref('https://via.placeholder.com/100');
    const userId = JSON.parse(localStorage.getItem('currentUser'))?.userId;

    const fetchBookDetail = async () => {
      try {
        const bookId = route.params.id;
        const res = await request.get(`/ebooks/${bookId}`);
        book.value = res.data || {};
      } catch (error) {
        console.error('Failed to fetch book detail', error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await request.get(`/review/list?ebookId=${bookId}`);
        comments.value = res.data || [];
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    const loanBook = async () => {
  try {
    const bookId = book.value.id;  // 获取当前书籍的 ID
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));  // 获取当前用户的 ID
    const userId = currentUser?.id;  // 获取当前用户的 ID

    // 检查 userId 是否有效
    if (!userId) {
      ElMessage.error('User is not logged in or userId is missing!');
      return;
    }

    // 1. 检查用户是否已借阅此书且未归还
    const userLoans = await request.get(`/loans?account_id=${userId}`);
    const existingLoan = userLoans.data.find(loan => loan.ebook_id === bookId && loan.status === 'active');
    if (existingLoan) {
      ElMessage.warning('You have already borrowed this book and not returned it yet!');
      return;
    }

    // 2. 检查用户借阅的书籍数量是否已达到 10 本
    const activeLoansCount = userLoans.data.filter(loan => loan.status === 'active').length;
    if (activeLoansCount >= 10) {
      ElMessage.warning('You can only borrow up to 10 books at a time!');
      return;
    }

    // 获取当前日期并格式化为 dd/mm/yyyy 格式
    const startDate = new Date();
    const startDateStr = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;

    // 计算归还日期：借书日起 30 天
    const returnDate = new Date(startDate);
    returnDate.setDate(startDate.getDate() + 30);  // 加 30 天
    const returnDateStr = `${returnDate.getDate().toString().padStart(2, '0')}/${(returnDate.getMonth() + 1).toString().padStart(2, '0')}/${returnDate.getFullYear()}`;

    // 创建借阅记录，包含书籍 ID 和用户 ID，以及当前时间作为借阅开始时间和计算出的归还时间
    const loanData = {
      ebook_id: bookId,
      account_id: userId,
      start_date: startDateStr,  // 设置借书日期
      return_date: returnDateStr,  // 设置计算出的归还日期
      status: 'active'  // 设置借阅状态为 'active'
    };

    // 发送 POST 请求到 /loans，将借阅信息保存到 db.json 中
    const res = await request.post('/loans', loanData);

    if (res.status === 200 || res.status === 201) {
      ElMessage.success('Successfully loaned this book!');

      const localKey = `onLoanBooks_${userId}`;
      let allOnLoan = JSON.parse(localStorage.getItem(localKey)) || [];

      allOnLoan.push({
      ...book.value,
      rentalStartDate: startDateStr,
      expirationDate: returnDateStr,
    });
      localStorage.setItem(localKey, JSON.stringify(allOnLoan));


    } else {
      ElMessage.error('Loan failed.');
    }
  } catch (error) {
    ElMessage.error('An error occurred while borrowing the book.');
    console.error('Error:', error);
  }
};


const addToWishlist = async () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.id;

  if (!userId) {
    ElMessage.warning('Please log in first.');
    return;
  }

  try {
    // 获取用户的 wishlist 数据
    const { data: user } = await request.get(`/users/${userId}`);
    
    // 检查书籍是否已经在 wishlist 中
    const isInWishlist = user.wishlist.some(item => item.id === book.value.id);
    if (isInWishlist) {
      ElMessage.warning('This book is already in your wishlist.');
      return;
    }

    // 更新 wishlist
    const updatedWishlist = [...(user.wishlist || []), book.value];

    await request.patch(`/users/${userId}`, {
      wishlist: updatedWishlist
    });

    ElMessage.success('Added to Wishlist!');
  } catch (error) {
    ElMessage.error('Failed to add to Wishlist.');
    console.error(error);
  }
};


    const submitComment = async () => {
      if (!newComment.value.trim()) {
        ElMessage.warning('Please enter a comment.');
        return;
      }
      try {
        await request.post('/review/add', {
          ebookId: bookId,
          rating: 5,
          comment: newComment.value
        });
        ElMessage.success('Comment added!');
        commentDialogVisible.value = false;
        newComment.value = '';
        fetchComments();
      } catch (error) {
        ElMessage.error('Failed to submit comment.');
      }
    };

    onMounted(() => {
      fetchBookDetail();
      fetchComments();
    });

    return {
      book,
      comments,
      commentDialogVisible,
      newComment,
      loanBook,
      addToWishlist,
      submitComment,
      userAvatar
    };
  }
};
</script>

<style scoped>
.book-detail-container {
  max-width: 1000px;
  margin: auto;
  padding: 40px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-name {
  font-size: 16px;
  font-weight: bold;
}
.separator {
  margin: 0 10px;
  font-size: 20px;
  color: #ccc;
}

.logo {
  color: #00bcd4;
  font-family: 'Lucida Handwriting', serif;
  font-size: 32px;
  cursor: pointer;
}

.book-info {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.book-meta {
  flex: 1;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.section-header {
  margin: 40px 0 20px;
}

.comment-card {
  margin-bottom: 10px;
}

.no-comment {
  color: #888;
  text-align: center;
}
</style>
