<template>
  <div class="image-wrap">
    <el-container>
      <el-header class="d-flex justify-content-start align-items-center">
        <el-select v-model="sortValue" style="width:100px" class="mr-2" size="mini">
          <el-option label="降序" value="desc"></el-option>
          <el-option label="升序" value="asc"></el-option>
        </el-select>
        <el-input
          v-model="keyword"
          placeholder="请输入图片名称"
          style="width:150px"
          size="mini"
          class="mr-2"
        ></el-input>
        <!-- <el-button type="primary" v-auth="'规则管理'">规则管理11111</el-button> -->

        <el-button type="success" size="mini" @click="searchImageList" class="mr-auto">搜索</el-button>
        <el-button type="warning" size="mini" @click="cancelChooseAll" v-if="nowNum>0">取消选中</el-button>
        <el-button type="danger" size="mini" @click="delImgItem(false)" v-if="nowNum>0">批量删除</el-button>
        <el-button type="success" @click="editAlbum(false)" size="mini">创建相册</el-button>
        <el-button type="warning" @click="uploadVisible = true" size="mini">上传图片</el-button>
      </el-header>
      <el-container>
        <!-- 左侧相册列表 -->
        <el-aside width="200px" class="border-right">
          <div
            v-for="(item,index) in albumList"
            :key="index"
            class="d-flex justify-content-start p-2 border-bottom"
            :class="activeAlbum==item.id?'active-alb':''"
            @click="chooseAlbum(item,index)"
          >
            <span class="mr-auto" style="font-size:14px">{{item.name}}</span>
            <el-dropdown>
              <el-button plain type="primery" size="mini">
                {{item.images_count}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.stop.native="editAlbum({item,index})">编辑</el-dropdown-item>
                <el-dropdown-item @click.stop.native="delAlbum(item)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-aside>
        <!-- 右侧图片信息 -->
        <el-main class="p-3">
          <h2 v-if="imageList.length===0">暂无数据</h2>
          <el-row :gutter="10" v-else>
            <el-col :sm="8" :md="6" :lg="4" v-for="(item,id) in imageList" :key="id">
              <el-card class="card-box mb-2">
                <img :src="item.url" style="width:100%;height:150px" @click="chooseImage(item,id)">
                <el-tag
                  v-if="item.isChoose==true && item.num>0"
                  size="mini"
                  type="danger"
                  class="tag"
                  effect="dark"
                >{{item.num}}</el-tag>
                <p class="title">{{item.name}}</p>
                <el-button-group class="my-3">
                  <el-button size="mini" icon="el-icon-view" @click="showBigImg(id)"></el-button>
                  <el-button size="mini" icon="el-icon-edit" @click="editImgName(item)"></el-button>
                  <el-button size="mini" icon="el-icon-delete" @click="delImgItem({item})"></el-button>
                </el-button-group>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-footer class="d-flex justify-content-start align-items-center">
        <div class="footer-left border-right" style="width:200px;line-height:60px;flex-shrink:0">
          <el-button-group>
            <el-button
              icon="el-icon-arrow-left"
              size="mini"
              :disabled="this.albumPage==1"
              @click="preAlbumPage"
            >上一页</el-button>
            <el-button
              size="mini"
              :disabled="Math.ceil(albumTotal/10)==this.albumPage"
              @click="nextAlbumPage"
            >
              下一页
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-button-group>
        </div>
        <div class="footer-right">
          <el-pagination
            class="ml-2"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="imagepage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="imageTotal"
          ></el-pagination>
        </div>
      </el-footer>
    </el-container>

    <!-- 大图弹框 -->
    <el-dialog :visible.sync="bigImgVisible" width="60%" top="10vh">
      <img :src="imageList.length>0 && imageList[activeImg].url" style="width:100%">
    </el-dialog>
    <!-- 创建/修改相册弹框 -->
    <el-dialog :title="editAlbumIndex==-1?'创建相册':'修改相册'" :visible.sync="dialogAlbumVisible">
      <el-form :model="albumForm" label-width="80px">
        <el-form-item label="相册名称">
          <el-input v-model="albumForm.name" autocomplete="off" placeholder="请输入相册名称"></el-input>
        </el-form-item>
        <el-form-item label="相册排序">
          <el-input-number v-model="albumForm.order" :min="0" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAlbumVisible = false">取 消</el-button>
        <el-button type="primary" @click="createAlbumConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传弹框 -->
    <el-dialog title="上传" :visible.sync="uploadVisible" width="60%">
      <el-upload
        class="upload-demo"
        drag
        action="/admin/image/upload"
        multiple
        style="width:100%;text-align:center"
        :headers="{token:$store.state.user.token}"
        :data="{image_class_id:this.activeAlbum}"
        :file-list="fileList"
        name="img"
        :on-error="uploadErr"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer">
        <el-button @click=" uploadVisible= false">取 消</el-button>
        <el-button type="primary" @click="uploadComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["layout"],
  data() {
    return {
      //相册分页
      albumPage: 1,
      albumTotal: 0,
      //相片分页
      imagepage: 1,
      imageTotal: 0,
      //搜索排序
      sortValue: "desc", //排序
      //搜索关键字
      keyword: "",
      //图片每页多少条数据
      limit: 10,
      //当前选中的索引
      activeIndex: 0,
      //当前删除的相册ID
      delAlbumIndex: 0,
      //相册
      albumList: [],
      //大图展开状态
      bigImgVisible: false,
      //当前查看/编辑的图片
      activeImg: 0,
      //相片列表
      imageList: [],
      //是否显示创建相册弹框
      dialogAlbumVisible: false,
      //当前修改的相册索引
      editAlbumIndex: -1, //创建状态下为-1
      albumForm: {
        name: "",
        order: 0
      },
      //选中图片列表
      chooseList: [],
      //是否显示上传相片弹框
      uploadVisible: false,
      fileList: []
    };
  },
  computed: {
    //当前选中相册的id
    activeAlbum() {
      let item = this.albumList[this.activeIndex];
      if (item) {
        return item.id;
      } else {
        return 0;
      }
    },
    //当前选中的图片数量
    nowNum() {
      return this.chooseList.length;
    },
    //图片请求地址
    imageListUrl() {
      return `/admin/imageclass/${this.activeAlbum}/image/${
        this.imagepage
      }?order=${this.sortValue}&keyword=${this.keyword}&limit=${this.limit}`;
    }
  },
  created() {
    this.init();
  },
  methods: {
    /* -----请求数据----- */
    //初始化数据(获取相册及相片列表)
    init() {
      this.layout.loading = true;
      this.axios
        .get(`/admin/imageclass/${this.albumPage}`, { token: true })
        .then(res => {
          let { data } = res.data;
          this.albumList = data.list;
          this.imageTotal = this.albumList[this.activeIndex].images_count;
          this.albumTotal = data.totalCount;
          this.getImageList();
          this.layout.loading = false;
        })
        .catch(err => {
          this.layout.loading = false;
        });
    },
    //获取图片列表
    getImageList() {
      this.layout.loading = true;
      this.axios
        .get(this.imageListUrl, {
          token: true
        })
        .then(res => {
          let { list } = res.data.data;
          if (list.length === 0) {
            this.imageList = [];
            this.layout.loading = false;
            return;
          }
          list.forEach(item => {
            item.isChoose = false;
            item.num = -1;
          });
          this.imageList = list;
          this.layout.loading = false;
        })
        .catch(err => {
          this.layout.loading = false;
        });
    },
    //修改相册
    getEditAlbum() {
      this.axios
        .post(`/admin/imageclass/${this.activeAlbum}`, this.albumForm, {
          token: true
        })
        .then(res => {
          this.$message.success("修改成功");
          //重新获取数据
          this.init();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除相册
    getDelAlbum() {
      this.axios
        .delete(`/admin/imageclass/${this.activeAlbum}`, {
          token: true
        })
        .then(res => {
          this.delAlbumIndex = 0;
          this.$message.success("删除成功");
          this.init();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //增加相册
    getAlbum() {
      this.axios
        .post("/admin/imageclass", this.albumForm, {
          token: true
        })
        .then(res => {
          this.init();
          this.$message.success("添加相册成功");
        });
    },
    //删除单张图片
    getDelImage(id) {
      this.axios
        .delete(`/admin/image/${id}`, {
          token: true
        })
        .then(res => {
          //刷新列表
          this.getImageList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
    },
    //批量删除图片
    getDelBatch(ids) {
      this.axios
        .post(`/admin/image/delete_all`, { ids: ids }, { token: true })
        .then(res => {
          this.init();
          this.chooseList = [];
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
    },
    //修改图片名称
    getEditImage(id, value) {
      this.axios
        .post(
          `/admin/image/${id}`,
          {
            id: id,
            name: value
          },
          {
            token: true
          }
        )
        .then(res => {
          this.$message({
            type: "success",
            message: "图片名称修改成功"
          });
          this.getImageList();
          console.log(res, "res修改图片名");
        });
    },

    /* ----相册处理方法---- */
    //选择相册
    chooseAlbum(item, index) {
      this.activeIndex = index;
      this.imageTotal = this.albumList[this.activeIndex].images_count;
      this.getImageList();
    },
    //创建/修改相册
    editAlbum(obj) {
      //编辑状态
      if (obj) {
        let { item, index } = obj;
        //初始化表单
        this.albumForm.name = item.name;
        this.albumForm.order = item.order;
        //修改状态
        this.dialogAlbumVisible = true;
        this.editAlbumIndex = index;
        return;
      }
      //创建状态
      this.albumForm.name = "";
      this.albumForm.order = 0;
      this.dialogAlbumVisible = true;
      this.editAlbumIndex = -1;
    },
    //点击确定创建/修改相册
    createAlbumConfirm() {
      //编辑状态
      if (this.editAlbumIndex > -1) {
        this.getEditAlbum();
        this.dialogAlbumVisible = false;
        return;
      }
      //创建状态
      this.getAlbum();
      this.dialogAlbumVisible = false;
    },
    //删除相册
    delAlbum(item) {
      let { id } = item;
      this.delAlbumIndex = id;
      this.$confirm("确定删除该相册", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.getDelAlbum();
      });
    },
    preAlbumPage() {
      this.albumPage -= 1;
      this.init();
    },
    nextAlbumPage() {
      this.albumPage += 1;
      this.init();
    },
    //图片上传失败
    uploadErr() {
      this.$message.error("上传失败，请重新上传");
      this.uploadVisible = false;
    },
    //点击确定上传图片
    uploadComfirm(value) {
      this.uploadVisible = false;
      this.fileList = [];
      //重新渲染数据
      this.init();
      // this.getImageList();
    },

    /*---- 图片处理方法 ----*/
    //查看大图
    showBigImg(index) {
      this.activeImg = index;
      this.bigImgVisible = true;
    },
    //修改图片名称
    editImgName(item) {
      this.$prompt("请输入新名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: item.name,
        inputValidator(val) {
          if (val == "") {
            return "图片名称不能为空";
          }
        }
      })
        .then(({ value }) => {
          this.getEditImage(item.id, value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //删除照片
    delImgItem(obj) {
      this.$confirm("确定删除该图片？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        if (obj) {
          let { id } = obj.item;
          this.getDelImage(id);
        } else {
          //批量删除
          let arr = [];
          this.imageList.forEach(item => {
            if (item.isChoose === true) {
              arr.push(item.id);
            }
          });
          this.getDelBatch(arr);
        }
      });
    },
    //选中相片
    chooseImage(item, id) {
      if (item.isChoose === false) {
        item.isChoose = true;
        this.chooseList.push(item);
        item.num = this.nowNum;
      } else if (item.isChoose === true) {
        item.isChoose = false;
        item.num = -1;
        //取消选中后需要改变编码的相片列表
        let changeList = this.chooseList.slice(id + 1);
        changeList.forEach(item => {
          item.num -= 1;
        });
        //取消选中后不需要改变的相片列表
        this.chooseList = this.chooseList.slice(0, id);
        this.chooseList.push(...changeList);
      }
    },
    //取消选中
    cancelChooseAll() {
      this.imageList.forEach(item => {
        item.isChoose = false;
      });
      this.chooseList = [];
    },
    //搜索
    searchImageList() {
      this.getImageList();
    },
    //修改每页显示图片数量
    handleSizeChange(val) {
      this.limit = val;
      this.getImageList();
    },
    //修改当前页码
    handleCurrentChange(val) {
      this.imagepage = val;
      this.getImageList();
    }
  }
};
</script>

<style lang="less" scoped>
.image-wrap {
  height: calc(100vh - 60px);
}
.active-alb {
  background-color: #f0f9eb;
  color: #67c23a;
}
.card-box {
  position: relative;
  .title {
    position: absolute;
    width: 100%;
    height: 24px;
    line-height: 24px;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    margin-top: -24px;
  }
  .tag {
    position: absolute;
    top: 0;
    right: 0;
  }
}
/deep/.el-card__body {
  padding: 0;
}

.el-header,
.el-footer {
  background-color: #eee;
  color: #333;
  text-align: center;
}
.el-footer {
  padding: 0;
}
/deep/.el-aside {
  text-align: center;
  height: calc(100vh - 180px);
}

/deep/.el-main {
  text-align: center;
  height: calc(100vh - 180px);
}
.el-footer {
  padding: 0;
}
</style>