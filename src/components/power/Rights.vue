<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table :data="rightsLists" :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限" prop="authName"></el-table-column>
        <el-table-column label="访问路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import {getRightsList} from 'network/home';
export default {
  name: 'Rights',
  data() {
    return {
      //权限列表
      rightsLists: [],
    }
  },
  created() {
    this.rightsList();
  },
  methods: {
    rightsList() {
      let _this = this;
      getRightsList('list').then(res=> {
        console.log(res);
        if(res.meta.status !== 200) return _this.$message({
          message: res.meta.msg,
          center: true,
          type: 'error'
        })
        _this.rightsLists = res.data;
      })
    }
  },
}
</script>
<style lang="less" scoped>

</style>