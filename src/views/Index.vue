<template>
  <div class="container">
    <el-container>
      <el-header>
        <div class="logo">
          <i class="iconfont iconnew"></i>
          <span>新闻头条后台管理</span>
        </div>
        <div class="user">
          <img :src="$axios.defaults.baseURL+user.head_img" alt />
          <el-dropdown split-button type="primary" @command="logout">
            {{user.nickname}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>切换用户</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isFold?'56px':'200px'" ref="aside">
          <el-button
          @click="foldMenu"
            type="info"
            :icon="isFold?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
            class="fold"
            size='small'
            color='#545c64'
          >{{isFold?'':'收起'}}</el-button>
          <el-menu
            default-active="/post-list"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isFold"
            :collapse-transition="false"
            :router="true"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>文章管理</span>
              </template>
              <el-menu-item index="/post-list" @click="handleClick">
                <i class="el-icon-document-copy"></i>
                <span slot="title">文章列表</span>
              </el-menu-item>
              <el-menu-item index="/post-release">
                <i class="el-icon-s-management"></i>
                <span slot="title">发布文章</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      isFold: false
    }
  },
  mounted () {
    this.getUserInfo()
    this.handleClick()
  },
  methods: {
    getUserInfo () {
      const userInfo =
      JSON.parse(sessionStorage.getItem('news-vant')).user || ''
      this.user = userInfo
    },
    // 退出登录
    logout (e) {
      // 退出登录
      if (e === 'logout') {
        sessionStorage.clear()
        this.$router.push('/login')
      }
    },
    // 控制左侧菜单的展示与否
    foldMenu () {
      this.isFold = !this.isFold
    },
    handleClick () {
      console.log(1)
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
}
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #222222;
    .logo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        font-size: 70px;
        color: #ff0000;
      }
      span {
        color: #fff;
        font-size: 24px;
        font-weight: 500;
      }
    }
    .user {
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background: #333;
    .fold {
      width: 100%;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
  }
}
</style>
