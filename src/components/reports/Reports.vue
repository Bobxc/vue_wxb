<template>
  <div class="reports">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="reports-card">
      <div id="main" ref="echartsRef" style="width: 1000px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from "echarts";
import _ from "lodash";
import { getReports } from "network/reports";
export default {
  name: "Reports",
  data() {
    return {
      optionList: {},
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    // var myChart = echarts.init(document.getElementById("main"));
    var myChart = echarts.init(this.$refs.echartsRef);

    getReports().then((res) => {
      console.log(res);
      if (res.meta.status === 200) {
        this.optionList = res.data;
        // 指定图表的配置项和数据
        _.merge(this.optionList, this.options);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(this.optionList);
      }
    });
  },
  methods: {},
};
</script>
<style lang="less" scoped>
</style>