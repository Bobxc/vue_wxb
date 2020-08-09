<template>
  <div class="goods">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="goods-card">
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="goodsInfo.query" :clearable="true" @clear="goodsList">
            <el-button slot="append" icon="el-icon-search" @click="goodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" class="add-goods-btn">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsInfo.goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="750px"></el-table-column>
        <el-table-column prop="goods_price" label="单价（元）" width="100px"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
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
        :current-page="goodsInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsInfo.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getGoods } from "network/goods";
export default {
  name: "Goods",
  data() {
    return {
      goods: [],
      goodsInfo: {
        query: "",
        goodsList: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
    };
  },
  created() {
    this.goodsList();
  },
  methods: {
    //商品列表
    goodsList() {
      let _this = this;
      let params = {
        query: _this.goodsInfo.query,
        pagenum: _this.goodsInfo.pageNum,
        pagesize: _this.goodsInfo.pageSize,
      };
      getGoods(params).then((res) => {
        console.log(res);
        if (res.meta.status === 200) {
          _this.goodsInfo.goodsList = res.data.goods;
          _this.goodsInfo.total = res.data.total;
        } else {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: 'error'
          })
        }
      });
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      let _this = this;
      _this.goodsInfo.pageSize = newSize;
      _this.goodsList();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      let _this = this;
      _this.goodsInfo.pageNum = newPage;
      _this.goodsList();
    },
  },
};
</script>
<style lang="less" scoped>
.add-goods-btn {
  margin-left: 20px;
}
</style>