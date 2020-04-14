<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-form ref="postFormRef" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" v-show="form.type===1" prop="content">
          <!-- 富文本编辑器 -->

          <vue-editor
            v-model="form.content"
            :useCustomImageHandler="true"
            id="editor"
            @image-added="handleImageAdded"
          ></vue-editor>
        </el-form-item>
        <el-form-item label="视频" v-show="form.type===2">
          <el-upload
            :action="$axios.defaults.baseURL+'/upload'"
            :headers="{
                        Authorization: token
                    }"
            :on-remove="handleVideoRemove"
            :on-success="handleVideoSuccess"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp4,avi文件，且不超过2m</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="栏目" prop="category">
          <el-checkbox-group v-model="checkedCategory">
            <el-checkbox
              :label="item.id"
              name="type"
              v-for="item in category"
              :key="item.id"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            :action="$axios.defaults.baseURL+'/upload'"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="{
                        Authorization: token
                    }"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  data () {
    return {
      form: {
        title: '',
        type: 1,
        content: '',
        category: [],
        cover: []
      },
      // 选中的分类
      checkedCategory: [],
      // 所有分类
      category: [],
      token: '',
      // 封面图片
      fileList: [],
      rules: {
        title: [
          {
            required: true, message: '请输入文章标题'
          }
        ],
        content: [
          {
            required: true, message: '请输入文章内容'
          }
        ],
        category: [
          {
            required: true, message: '请选择文章类别'
          }
        ]
      }
    }
  },
  created () {
    this.getCategories()
    this.getToken()
  },
  components: {
    VueEditor
  },
  methods: {
    // 预览图片
    handlePictureCardPreview () {},
    // 删除图片
    handleRemove (file, fileList) {
      this.fileList = fileList
      console.log(this.fileList)
    },
    // 图片上传成功
    handleSuccess (res, file, fileList) {
      this.fileList = fileList
    },
    // 删除视频
    handleVideoRemove (file, fileList) {

    },
    // 视频上传成功
    handleVideoSuccess (file, res, fileList) {
      this.form.content = res.data.url
    },
    // 创建文章
    onSubmit () {
      this.form.category = this.checkedCategory.map(v => {
        return { id: v }
      })
      this.form.cover = this.fileList.map(v => {
        return { id: v.response.data.id }
      })
      this.$refs.postFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.post('/post', this.form)
        if (res.message === '文章发布成功') {
          this.$message.success('文章发布成功')
          this.form = { type: 1 }
          this.fileList = []
        } else {
          this.$message.error('文章发布失败')
        }
      })
    },
    // 获取分类列表
    async getCategories () {
      const { data: res } = await this.$axios.get('/category')
      // 去除关注分类

      res.data.splice(0, 1)
      this.category = res.data
      console.log(this.category)
    },
    getToken () {
      const { token } = JSON.parse(sessionStorage.getItem('news-vant'))
      this.token = token
    },
    // 富文本中处理图片上传
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()
      formData.append('file', file)
      this.$axios({
        url: '/upload',
        method: 'POST',
        data: formData
      })
        .then(result => {
          console.log(result)

          const url = result.data.data.url // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', this.$axios.defaults.baseURL + url)
          resetUploader()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .ql-toolbar.ql-snow {
  line-height: 20px;
}
</style>
