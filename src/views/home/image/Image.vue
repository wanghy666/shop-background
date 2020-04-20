<template>
  <div class="image-wrap">
    <el-container>
      <el-header class="d-flex justify-content-start align-items-center">
        <el-select v-model="searchForm.sortValue" style="width:100px" class="mr-2" size="mini">
          <el-option label="降序" value="0"></el-option>
          <el-option label="升序" value="1"></el-option>
        </el-select>
        <el-input placeholder="请输入图片名称" style="width:150px" size="mini" class="mr-2"></el-input>
        <el-button type="success" size="mini" @click="search" class="mr-auto">搜索</el-button>
        <el-button type="success" @click="creatImage" size="mini">创建相册</el-button>
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
                <el-dropdown-item @click.native="editAlbum(index)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="delAlbum(index)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-aside>
        <!-- 右侧图片信息 -->
        <el-main class="p-3">
          <el-row :gutter="10">
            <el-col :sm="8" :md="6" :lg="4" v-for="(item,id) in imageList" :key="id">
              <el-card class="card-box mb-2">
                <img :src="item.url" style="width:100%;height:150px">
                <p class="title">{{item.name}}</p>
                <el-button-group class="my-3">
                  <el-button size="mini" icon="el-icon-view" @click="showBigImg(id)"></el-button>
                  <el-button size="mini" icon="el-icon-edit" @click="editImgName(id)"></el-button>
                  <el-button size="mini" icon="el-icon-delete"></el-button>
                </el-button-group>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
    <el-dialog :visible.sync="bigImgVisible" width="60%" top="10vh">
      <img :src="imageList[activeImg].url" style="width:100%">
    </el-dialog>
    <!-- <el-dialog title="创建相册" :visible.sync="dialogImageVisible">
      <el-form :model="form">
        <el-form-item label="相册名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>-->
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
          name: "相册1",
          number: "11"
        },
        {
          name: "相册2",
          number: "22"
        },
        {
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
          id: 0,
          url: require("@/assets/images/1.jpg"),
          name: "相片1"
        },
        {
          id: 1,
          url: require("@/assets/images/2.jpg"),
          name: "相片1"
        },
        {
          id: 2,
          url: require("@/assets/images/3.jpg"),
          name: "相片2"
        },
        {
          id: 3,
          url: require("@/assets/images/4.jpg"),
          name: "相片3"
        },
        {
          id: 4,
          url: require("@/assets/images/5.jpg"),
          name: "相片4"
        },
        {
          id: 5,
          url: require("@/assets/images/6.jpg"),
          name: "相片5"
        },
        {
          id: 6,
          url: require("@/assets/images/7.jpg"),
          name: "相片6"
        },
        {
          id: 7,
          url: require("@/assets/images/8.jpg"),
          name: "相片7"
        },
        {
          id: 8,
          url: require("@/assets/images/9.jpg"),
          name: "相片8"
        }
      ],
      //是否显示创建相册弹框
      dialogImageVisible: false
    };
  },
  methods: {
    editAlbum() {},
    delAlbum(index) {
      console.log(11111);
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
    //查看大图
    showBigImg(index) {
      this.activeImg = index;
      this.bigImgVisible = true;
    },
    //修改图片名称
    editImgName() {
      this.$prompt("请输入新名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "邮箱格式不正确"
      })
        .then(({ value }) => {
          console.log(value, 1111);
          this.$message({
            type: "success",
            message: "图片名称: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //搜索
    search() {},
    //创建相册
    creatImage() {},
    //上传图片
    uploadImage() {}
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
}
/deep/.el-card__body {
  padding: 0;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  // line-height: 60px;
}
/deep/.el-aside {
  // background-color: #d3dce6;
  // color: #333;
  text-align: center;
  // line-height: 200px;
  height: calc(100vh - 180px);
}

/deep/.el-main {
  // background-color: #e9eef3;
  // color: #333;
  text-align: center;
  // line-height: 200px;
  height: calc(100vh - 180px);
}
</style>