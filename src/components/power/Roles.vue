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
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesLists" :border="true" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbotoom','vcenter', index1 === 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="['vcenter', index2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      closable
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleDialoVisible(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹出层 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogColsed"
    >
      <el-tree
        ref="treeRef"
        :data="rightLists"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRoleClosed"
    >
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        :rules="addRoleRulesForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRoleClosed"
    >
      <el-form
        label-width="100px"
        :model="editRoleForm"
        :rules="editRoleRulesForm"
        ref="editRoleFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoles,
  deleteRoleRight,
  getRightsTree,
  postAllotRights,
  postAddRole,
  putEditRole,
  deleteRole,
} from "network/home";
export default {
  name: "Roles",
  data() {
    return {
      rolesLists: [],
      // 分配权限弹出层
      setRightDialogVisible: false,
      // 权限数据
      rightLists: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      defKeys: [],
      roleId: "",
      addRolesDialogVisible: false,
      editRolesDialogVisible: false,
      addRoleForm: {},
      editRoleForm: {},
      addRoleRulesForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
      editRoleRulesForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.rolesList();
  },
  methods: {
    //角色列表
    rolesList() {
      let _this = this;
      getRoles().then((res) => {
        if (res.meta.status !== 200)
          return _this.$message({
            message: res.meta.msg,
            center: true,
            type: "error",
          });
        _this.rolesLists = res.data;
      });
    },
    //根据id删除对应的权限
    removeRightById(role, rightId) {
      let _this = this;
      _this
        .$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          deleteRoleRight(role.id, rightId).then((res) => {
            if (res.meta.status === 200) {
              role.children = res.data;
              _this.$message({
                type: "success",
                message: res.meta.msg,
                center: true,
              });
            } else {
              _this.$message({
                type: "error",
                message: res.meta.msg,
                center: true,
              });
            }
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除",
            center: true,
          });
        });
    },
    //分配权限弹出层
    showSetRightDialog(role) {
      let _this = this;
      _this.roleId = role.id;
      /* 获取权限数据 */
      getRightsTree("tree").then((res) => {
        if (res.meta.status === 200) {
          _this.rightLists = res.data;
        } else {
          _this.$message({
            message: res.meta.msg,
            type: "error",
            center: true,
          });
        }
      });
      _this.getLeafKeys(role, _this.defKeys);
      _this.setRightDialogVisible = true;
    },
    //通过递归，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      let _this = this;
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        _this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框的关闭事件
    setRightDialogColsed() {
      let _this = this;
      _this.defKeys = [];
    },
    //点击为角色分配权限
    allotRights() {
      let _this = this;
      const arr = [
        ..._this.$refs.treeRef.getCheckedKeys(),
        ..._this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = arr.join(",");
      postAllotRights(_this.roleId, idStr).then((res) => {
        if (res.meta.status === 200) {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "success",
          });
          _this.rolesList();
          _this.setRightDialogVisible = false;
        } else {
          _this.$message({
            message: res.meta.msg,
            center: true,
            type: "error",
          });
        }
      });
    },
    //显示添加角色对话框
    addRoleDialogVisible() {
      let _this = this;
      _this.addRolesDialogVisible = true;
    },
    //添加角色
    addRole() {
      let _this = this;
      _this.$refs.addRoleFormRef.validate((valid) => {
        if (!valid) return;
        postAddRole(_this.addRoleForm).then((res) => {
          if (res.meta.status === 201) {
            _this.$message({
              message: res.meta.msg,
              center: true,
              type: "success",
            });
            _this.addRolesDialogVisible = false;
            _this.rolesList();
          } else {
            _this.$message({
              message: res.meta.msg,
              center: true,
              type: "error",
            });
          }
        });
      });
    },
    //重置添加角色表单
    addRoleClosed() {
      let _this = this;
      _this.$refs.addRoleFormRef.resetFields();
      _this.addRoleForm = {};
    },
    //显示编辑角色对话框
    editRoleDialoVisible(role) {
      let _this = this;
      _this.roleId = role.id;
      _this.editRoleForm = role;
      _this.editRolesDialogVisible = true;
    },
    //提交编辑角色
    editRole() {
      let _this = this;
      _this.$refs.editRoleFormRef.validate((valid) => {
        if (valid) {
          putEditRole(_this.roleId, _this.editRoleForm).then((res) => {
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
            }
            _this.editRolesDialogVisible = false;
            _this.rolesList();
          });
        } else {
          return false;
        }
      });
    },
    //重置编辑角色表单
    editRoleClosed() {
      let _this = this;
      _this.$refs.editRoleFormRef.resetFields();
      _this.editRoleForm = {};
      _this.roleId = "";
    },

    //删除角色
    deleteRole(role) {
      let _this = this;
      _this
        .$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          deleteRole(role.id).then((res) => {
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
            }
            _this.rolesList();
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除",
            center: true,
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbotoom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>