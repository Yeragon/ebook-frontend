<!-- src/views/BookDetail.vue -->
<template>
  <div class="book-detail-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo" @click="$router.push('/dashboard')">Ebooks</h1>
      <div class="header-actions">
    <el-avatar :src="currentUser.avatar || ''" icon="el-icon-user" style="cursor: pointer;" @click="$router.push('/myaccount')" />
    <span class="user-name">{{ currentUser.name || 'User' }}</span>
    <span class="separator">|</span>
    <el-button type="text" @click="logout">Logout</el-button>
  </div>
    </div>

    <!-- Book Info -->
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
    const bookId = route.params.id;
    const book = ref({});
    const comments = ref([]);
    const commentDialogVisible = ref(false);
    const newComment = ref('');
    const userAvatar = ref('https://via.placeholder.com/100');
    const userId = JSON.parse(localStorage.getItem('currentUser'))?.userId;

    const fetchBookDetail = async () => {
  try {
    const res = await request.get(`/ebook/${bookId}`);
    const data = res.data || res; // 兼容有无 `.data`
    if (data?.coverURL) {
      book.value = data;
    } else {
      ElMessage.warning('Book not found or invalid data.');
      router.push('/');
    }
  } catch (error) {
    console.error('Failed to fetch book detail', error);
  }
};

    const fetchComments = async () => {
      try {
        const res = await request.get(`/review/list?ebookId=${bookId}`);
        comments.value = res || [];
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    const loanBook = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser?.id;

    if (!userId) {
      ElMessage.error('User is not logged in!');
      return;
    }

    const { data: existingLoans } = await request.get(`/loans?account_id=${userId}&ebook_id=${bookId}&status=active`);
    if (existingLoans.length > 0) {
      ElMessage.warning('You have already borrowed this book.');
      return;
    }

    const { data: allActiveLoans } = await request.get(`/loans?account_id=${userId}&status=active`);
    if (allActiveLoans.length >= 10) {
      ElMessage.warning('Maximum 10 active loans allowed.');
      return;
    }

    const now = new Date();
    const startDate = now.toLocaleDateString('en-GB');
    const returnDate = new Date(now.setDate(now.getDate() + 30)).toLocaleDateString('en-GB');

    const loanData = {
      ebook_id: bookId,
      account_id: userId,
      start_date: startDate,
      return_date: returnDate,
      status: 'active'
    };

    const res = await request.post('/loans', loanData);
    if (res.status === 200 ) {
      ElMessage.success('Book loaned successfully!');
    } else {
      ElMessage.error('Loan failed.');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('An error occurred while processing loan.');
  }
};

const addToWishlist = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser?.id;

    if (!userId) {
      ElMessage.warning('Please log in to use wishlist.');
      return;
    }

    const { data: existingItems } = await request.get(`/wishlist?account_id=${userId}&ebook_id=${bookId}`);
    if (existingItems.length > 0) {
      ElMessage.warning('This book is already in your wishlist.');
      return;
    }

    const wishlistItem = {
      account_id: userId,
      ebook_id: bookId
    };

    const res = await request.post('/wishlist', wishlistItem);
    if (res.status === 200 || res.status === 201) {
      ElMessage.success('Added to wishlist!');
    } else {
      ElMessage.error('Failed to add to wishlist.');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('An error occurred while adding to wishlist.');
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
  margin-bottom: 30px;
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
