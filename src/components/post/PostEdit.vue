<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章编辑</el-breadcrumb-item>
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
        <el-form-item label="栏目" prop="checkedCategory">
          <el-checkbox-group v-model="form.checkedCategory">
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
            :file-list="fileList"
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
          <el-button type="primary" @click="onSubmit">确认编辑</el-button>
        </el-form-item>
      </el-form>
    </el-card>
     <el-dialog
  :visible.sync="ImgPreviewDialogVisible"
  width="50%"
  >
  <img :src="previewImgSrc" alt="" width="100%">
</el-dialog>
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
        categories: [],
        cover: [],
        checkedCategory: []
      },
      // 是否展示预览图片
      ImgPreviewDialogVisible: false,
      // 预览图片的路径
      previewImgSrc: '',
      // 选中的分类
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
        checkedCategory: [
          {
            required: true, message: '请选择文章类别'
          }
        ]
      }
    }
  },
  created () {
    this.getCategories()
    this.getPost()
    this.getToken()
  },
  components: {
    VueEditor
  },
  methods: {
    // 预览图片
    handlePictureCardPreview (file) {
      this.previewImgSrc = file.url
      this.ImgPreviewDialogVisible = true
    },
    // 删除图片
    handleRemove (file, fileList) {
      this.fileList = fileList
      console.log(this.fileList)
    },
    // 图片上传成功
    handleSuccess (res, file, fileList) {
      this.fileList = fileList
      console.log(this.fileList)
    },
    // 删除视频
    handleVideoRemove (file, fileList) {

    },
    // 视频上传成功
    handleVideoSuccess (file, res, fileList) {
      this.form.content = res.data.url
    },
    // 获取文章 回显文章数据
    async getPost () {
      const { data: res } = await this.$axios.get('/post/' + this.$route.params.id)
      const checkedCate = res.data.categories.map(v => v.id)
      this.fileList = res.data.cover.map(v => {
        v.url = this.$axios.defaults.baseURL + v.url
        delete v.uid
        return v
      })
      console.log(this.fileList)

      // this.form.
      this.fileList = res.data.cover
      this.form = {
        title: res.data.title,
        content: res.data.content,
        type: res.data.type,
        checkedCategory: checkedCate
      }
    },
    // 创建文章
    onSubmit () {
      this.form.categories = this.form.checkedCategory.map(v => {
        return { id: v }
      })
      this.form.cover = this.fileList.map(v => {
        return { id: v.id || v.response.data.id }
      })
      this.$refs.postFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.post('/post_update/' + this.$route.params.id, this.form)
        if (res.message === '文章编辑成功') {
          this.$message.success('文章编辑成功')
          this.$refs.postFormRef.resetFields()
          this.fileList = []
        } else {
          this.$message.error('文章编辑失败')
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
