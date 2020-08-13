<template>
  <div class="categorie">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="categorie-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategoriesDialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类列表 -->
      <tree-table
        :data="categoriesInfo.categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
        class="treeTable"
      >
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen;"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red;" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="warning">二级</el-tag>
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="categoriesInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="categoriesInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="categoriesInfo.total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @closed="addCategoriesDialogClosed">
      <el-form
        ref="addCategoriesFormRef"
        :rules="addCategoriesRules"
        label-width="100px"
        :model="addCategories"
        
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategories.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            expand-trigger="hover"
            :options="parentCariesLists"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            :clearable="true"
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCategories, postCategories } from "network/goods";
export default {
  name: "Categories",
  data() {
    return {
      categoriesInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        categoriesList: [],
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOK",
        },
        {
          label: "分类层级",
          type: "template",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      addDialogVisible: false,
      addCategories: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addCategoriesRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      parentCariesLists: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [],
    };
  },
  created() {
    this.categoriesList();
  },
  methods: {
    //商品分类数据列表
    categoriesList() {
      let _this = this;
      let params = {
        type: "",
        pagenum: _this.categoriesInfo.pageNum,
        pagesize: _this.categoriesInfo.pageSize,
      };
      getCategories(params).then((res) => {
        console.log(res);
        if (res.meta.status === 200) {
          _this.categoriesInfo.total = res.data.total;
          _this.categoriesInfo.categoriesList = res.data.result;
        } else {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "error",
          });
        }
      });
    },
    //父级分类的数据列表
    parentCariesList() {
      let _this = this;
      let params = {
        type: 2,
        pagenum: "",
        pagesize: "",
      };
      getCategories(params).then((res) => {
        console.log(res.data);
        if (res.meta.status === 200) {
          _this.parentCariesLists = res.data;
        } else {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "error",
          });
        }
      });
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      let _this = this;
      _this.categoriesInfo.pageSize = newSize;
      _this.categoriesList();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      let _this = this;
      _this.categoriesInfo.pageNum = newPage;
      _this.categoriesList();
    },
    //显示添加分类对话框
    addCategoriesDialogVisible() {
      let _this = this;
      _this.parentCariesList();
      _this.addDialogVisible = true;
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      let _this = this;
      console.log(this.selectedKeys);
      if (_this.selectedKeys.length > 0) {
        _this.addCategories.cat_pid =
          _this.selectedKeys[_this.selectedKeys.length - 1];
        _this.addCategories.cat_level = _this.selectedKeys.length;
        return;
      } else {
        _this.addCategories.cat_pid = 0;
        _this.addCategories.cat_level = 0;
      }
    },
    //点击提交 添加新的分类
    addCate() {
      let _this = this;
      let params = _this.addCategories;
      _this.$refs.addCategoriesFormRef.validate(valid => {
        if(!valid) return;
        postCategories(params).then(res => {
          console.log(res);
          if(res.meta.status === 201) {
            _this.$message({
              message: res.meta.msg,
              center: true,
              type: 'success'
            })
          } else {
            _this.$message({
              message: res.meta.msg,
              center: true,
              type: 'error'
            })
          }
          _this.categoriesList();
          _this.addDialogVisible = false;
        })
      })
    },
    //关闭对话框， 重置表单数据
    addCategoriesDialogClosed() {
      let _this = this;
      _this.$refs.addCategoriesFormRef.resetFields();
      _this.selectedKeys = [];
      _this.addCategories.cat_pid = 0;
      _this.addCategories.cat_level = 0;
    },
  },
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>