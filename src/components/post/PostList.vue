<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        文章列表
      </el-breadcrumb-item>

    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <div style="margin-bottom: 8px;">
          <el-col :span="10">
            <el-input placeholder="请输入搜索内容" v-model="keyword" clearable>
              <el-button slot="append" icon="el-icon-search" @click="searchPost"></el-button>
            </el-input>
          </el-col>
        </div>
      </el-row>
      <el-table :data="postList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="文章标题"></el-table-column>
        <el-table-column label="类型">
          <template #default="props">{{props.row.type===1?'文章':'视频'}}</template>
        </el-table-column>
        <el-table-column
          #default="props"
          label="创建时间"
          width="180"
        >{{moment(props.row.create_date).format('YYYY-MM-DD hh:mm:ss')}}</el-table-column>
        <el-table-column prop="user.nickname" label="发布者"></el-table-column>
        <el-table-column label="操作" #default="props" width="180">
          <!-- @click="editPostById(props.row.id)" -->
          <router-link :to='"/post-edit/"+props.row.id'><el-button size="mini" type="warning" icon="el-icon-edit" >编辑</el-button></router-link>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeById(props.row.id)"
          >删除</el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageIndex"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      queryInfo: {
        pageIndex: 1,
        pageSize: 5,
        category: '' || null
      },
      postList: [],
      total: 0,
      moment,
      // 搜索关键字
      keyword: ''
    }
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    // 获取全部文章
    async getPosts () {
      const { data: res } = await this.$axios.get('/post', {
        params: this.queryInfo
      })
      // const { data: res } = await this.$axios.get('/post')
      this.postList = res.data
      console.log(res, this.queryInfo)

      this.total = res.total
    },
    // 文章编辑
    // editPostById (id) {
    //   this.$router.push({
    //     path: '/post-edit',
    //     params: { id }
    //   })
    // },
    // 监听条数大小的改变
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getPosts()
    },
    // 监听页码的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pageIndex = newPage
      this.getPosts()
    },
    async searchPost () {
      // 搜索文章
      const { data: res } = await this.$axios.get('/post_search', {
        params: {
          ...this.queryInfo,
          keyword: this.keyword
        }
      })
      this.postList = res.data
      this.total = res.total
    },
    // 根据id删除文章
    async removeById (id) {
      //  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     });
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     });
      //   });
      try {
        const confirm = await this.$confirm(
          '此操作将删除该文章, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        if (confirm !== 'confirm') return false
        const { data: res } = await this.$axios.post('/post_update/' + id, {
          open: 0
        })
        if (res.message === '文章删除成功') {
          this.getPosts()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
