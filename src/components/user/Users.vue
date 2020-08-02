<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="40">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="queryInfo.userList" :border="true" :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialoVisible(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogColsed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  userList,
  userState,
  postAddUser,
  getUser,
  putEditUser,
  deleteRemoveUser,
} from "network/home";
export default {
  name: "Users",
  data() {
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱"));
      }
    };
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的手机号"));
      }
    };

    return {
      //用户列表参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
        userList: [],
        total: 0,
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表
    getUserList() {
      let _this = this;
      userList(
        _this.queryInfo.query,
        _this.queryInfo.pagenum,
        _this.queryInfo.pagesize
      ).then((res) => {
        if (res.meta.status !== 200) {
          return _this.$message({
            message: res.meta.msg,
            center: true,
            type: "error",
          });
        }
        _this.queryInfo.userList = res.data.users;
        _this.queryInfo.total = res.data.total;
      });
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      let _this = this;
      _this.queryInfo.pagesize = newSize;
      _this.getUserList();
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      let _this = this;
      _this.queryInfo.pagenum = newPage;
      _this.getUserList();
    },
    //监听 switch 开关状态的改变
    userStateChanged(userInfo) {
      let _this = this;
      userState(userInfo.id, userInfo.mg_state).then((res) => {
        if (res.meta.status === 200) {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "success",
          });
        } else {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "error",
          });
          userInfo.mg_state = !userInfo.mg_state;
        }
      });
    },
    //重置添加用户表单
    addDialogColsed() {
      let _this = this;
      _this.$refs.addFormRef.resetFields();
    },
    //添加新用户
    addUser() {
      let _this = this;
      _this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        //可以发送添加新用户的网络请求
        postAddUser(_this.addForm).then((res) => {
          if (res.meta.status !== 201) {
            _this.$message({
              message: res.meta.msg,
              center: true,
              type: "error",
            });
          } else {
            _this.$message({
              message: res.meta.msg,
              center: true,
              type: "success",
            });
            _this.addDialogVisible = false;
            _this.getUserList();
          }
        });
      });
    },
    //显示修改用户信息对话框
    editDialoVisible(id) {
      let _this = this;
      _this.editDialogVisible = true;
      getUser(id).then((res) => {
        if (res.meta.status !== 200) {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "error",
          });
        } else {
          _this.editForm = res.data;
        }
      });
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      let _this = this;
      _this.$refs.editFormRef.resetFields();
    },
    //提交修改用户信息
    editUser() {
      let _this = this;
      _this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        //发起修改用户信息请求
        let params = {
          id: _this.editForm.id,
          email: _this.editForm.email,
          mobile: _this.editForm.mobile,
        };
        putEditUser(params).then((res) => {
          if (res.meta.status !== 200)
            return _this.$message({
              message: res.meta.msg,
              center: true,
              type: "error",
            });
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "success",
          });
          _this.editDialogVisible = false;
          _this.getUserList();
        });
      });
    },
    //删除用户
    removeUser(id) {
      let _this = this;
      //弹窗询问是否删除用户数据
      _this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRemoveUser(id).then((res) => {
            console.log(res);
            if (res.meta.status == 200) {
              _this.$message({
                type: "success",
                center: true,
                message: res.meta.msg,
              });
            }
            _this.getUserList();
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            center: true,
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
</style>