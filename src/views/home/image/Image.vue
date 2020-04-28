<template>
  <div class="image-wrap">
    <el-container>
      <el-header class="d-flex justify-content-start align-items-center">
        <el-select v-model="searchForm.sortValue" style="width:100px" class="mr-2" size="mini">
          <el-option label="降序" value="0"></el-option>
          <el-option label="升序" value="1"></el-option>
        </el-select>
        <el-input placeholder="请输入图片名称" style="width:150px" size="mini" class="mr-2"></el-input>
        <el-button type="primary" v-auth="'规则管理'">规则管理11111</el-button>

        <el-button type="success" size="mini" @click="search" class="mr-auto">搜索</el-button>
        <el-button type="warning" size="mini" @click="cancelChooseAll" v-if="nowNum>0">取消选中</el-button>
        <el-button type="danger" size="mini" @click="delImgItem" v-if="nowNum>0">批量删除</el-button>
        <el-button type="success" @click="editAlbum(false)" size="mini">创建相册</el-button>
        <el-button type="warning" @click="uploadImage" size="mini">上传图片</el-button>
      </el-header>
      <el-container>
        <!-- 左侧相册列表 -->
        <el-aside width="200px" class="border-right">
          <div
            v-for="(item,index) in albumList"
            :key="index"
            class="d-flex justify-content-start p-2 border-bottom"
            :class="activeAlbum==index?'active-alb':''"
            @click="activeAlbum = index"
          >
            <span class="mr-auto">{{item.name}}</span>
            <el-dropdown>
              <el-button plain type="primery" size="mini">
                {{item.number}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.stop.native="editAlbum({item,index})">编辑</el-dropdown-item>
                <el-dropdown-item @click.stop.native="delAlbum(index)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-aside>
        <!-- 右侧图片信息 -->
        <el-main class="p-3">
          <el-row :gutter="10">
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
                  <el-button size="mini" icon="el-icon-delete" @click="delImgItem({id})"></el-button>
                </el-button-group>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-footer class="d-flex justify-content-start align-items-center">
        <div class="footer-left border-right" style="width:200px;line-height:60px;flex-shrink:0">
          <el-button-group>
            <el-button icon="el-icon-arrow-left" size="mini">上一页</el-button>
            <el-button size="mini">
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
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          ></el-pagination>
        </div>
      </el-footer>
    </el-container>
    <!-- 大图 -->
    <el-dialog :visible.sync="bigImgVisible" width="60%" top="10vh">
      <img :src="imageList[activeImg].url" style="width:100%">
    </el-dialog>
    <!-- 创建/修改相册 -->
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
    <!-- 上传 -->
    <el-dialog title="上传" :visible.sync="uploadVisible" width="60%">
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        style="width:100%;text-align:center"
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
  data() {
    return {
      //搜索模块数据
      searchForm: {
        sortValue: 0 //排序
      },
      //当前选中的相册
      activeAlbum: 0,
      //相册
      albumList: [
        {
          order: 0,
          name: "相册1",
          number: "11"
        },
        {
          order: 1,
          name: "相册2",
          number: "22"
        },
        {
          order: 2,
          name: "相册3",
          number: "33"
        }
      ],
      //大图展开状态
      bigImgVisible: false,
      //当前查看/编辑的图片
      activeImg: 0,
      //相片列表
      imageList: [
        {
          id: 10,
          url: require("@/assets/images/1.jpg"),
          name: "相片0",
          isChoose: false,
          num: -1
        },
        {
          id: 11,
          url: require("@/assets/images/2.jpg"),
          name: "相片1",
          isChoose: false,
          num: -1
        },
        {
          id: 12,
          url: require("@/assets/images/3.jpg"),
          name: "相片2",
          isChoose: false,
          num: -1
        },
        {
          id: 13,
          url: require("@/assets/images/4.jpg"),
          name: "相片3",
          isChoose: false,
          num: -1
        },
        {
          id: 14,
          url: require("@/assets/images/5.jpg"),
          name: "相片4",
          isChoose: false,
          num: -1
        },
        {
          id: 15,
          url: require("@/assets/images/6.jpg"),
          name: "相片5",
          isChoose: false,
          num: -1
        },
        {
          id: 16,
          url: require("@/assets/images/7.jpg"),
          name: "相片6",
          isChoose: false,
          num: -1
        },
        {
          id: 17,
          url: require("@/assets/images/8.jpg"),
          name: "相片7",
          isChoose: false,
          num: -1
        },
        {
          id: 18,
          url: require("@/assets/images/9.jpg"),
          name: "相片8",
          isChoose: false,
          num: -1
        }
      ],
      //是否显示创建相册弹框
      dialogAlbumVisible: false,
      //当前修改的相册索引
      editAlbumIndex: -1, //创建状态下为-1
      albumForm: {
        name: "111",
        order: 10
      },
      //选中图片列表
      chooseList: [],
      //是否显示上传相片弹框
      uploadVisible: false,
      currentPage: 1
    };
  },
  computed: {
    nowNum() {
      return this.chooseList.length;
    }
  },
  methods: {
    //获取相册列表
    getAlbumList() {
      // this.axios.get('/admin/imageclass/:page?limit=[limit]')
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
        this.albumList[this.editAlbumIndex].name = this.albumForm.name;
        this.albumList[this.editAlbumIndex].order = this.albumForm.order;
        this.dialogAlbumVisible = false;
        return;
      }
      //创建状态
      this.albumList.push({
        name: this.albumForm.name,
        order: this.albumForm.order,
        number: "0"
      });
      this.dialogAlbumVisible = false;
    },
    //删除相册
    delAlbum(index) {
      this.$confirm("确定删除该相册", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.albumList.splice(index, 1);
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    //上传图片
    uploadImage() {
      this.uploadVisible = true;
    },
    //点击确定上传图片
    uploadComfirm(value) {
      console.log(value, "上传");
    },
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
          item.name = value;
          this.$message({
            type: "success",
            message: "图片名称修改成功"
          });
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
      let { id } = obj;
      console.log(id, "id");
      this.$confirm("确定删除该图片？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        if (id >= 0) {
          //普通删除
          this.imageList.splice(id, 1);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          console.log(11114567);
          //批量删除
          let list = this.imageList.filter(item => {
            return !item.isChoose === true;
          });
          this.imageList = list;
          this.chooseList = [];
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    //选中相片
    chooseImage(item, id) {
      if (item.isChoose === false) {
        this.chooseList.push(item);
        item.isChoose = true;
        item.num = this.nowNum;
        // console.log(this.chooseList);
      } else if (item.isChoose === true) {
        item.isChoose = false;
        item.num = -1;
        let changeList = this.chooseList.slice(id + 1);
        changeList.forEach(item => {
          item.num -= 1;
        });
        this.chooseList = this.chooseList.slice(0, id);
        this.chooseList.push(...changeList);
        // console.log("选中数组", this.chooseList, "改变的数据", changeList);
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
    search() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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