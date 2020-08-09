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
        <el-col><el-button type="primary">添加分类</el-button></el-col>
      </el-row>
      <!-- 商品分类列表 -->
      <el-table :data="categoriesInfo.categoriesList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效"></el-table-column>
        <el-table-column prop="cat_level" label="分类层级"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import { getCategories } from "network/goods";
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
  },
};
</script>
<style lang="less" scoped>
</style>