<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col><el-button type="primary">添加角色</el-button></el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesLists" :border="true" stripe="">
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getRoles } from "network/home";
export default {
  name: "Roles",
  data() {
    return {
      rolesLists: [],
    };
  },
  created() {
    this.rolesList();
  },
  methods: {
    rolesList() {
      let _this = this;
      getRoles().then(res=>{
        console.log('res',res);
        if(res.meta.status !== 200) return _this.$message({
          message: res.meta.msg,
          center: true,
          type: 'error'
        })
        _this.rolesLists = res.data;
      })
    }
  },
};
</script>
<style lang="less" scoped>
</style>