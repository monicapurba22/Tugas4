<template>
  <div class="fillContainer">
    <div>
      <!-- 添加按钮 -->
      <el-form :inline="true" ref="add_data" :model="search_data">
        <!-- 筛选 -->
        <el-form-item label="按照时间筛选：">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
          >
          </el-date-picker>
          --
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="search"
            @click="handleSearch()"
            >筛选</el-button
          >
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button
            type="primary"
            size="small"
            icon="view"
            @click="handleAdd()"
            v-if="user.identity == 'manage'"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        max-height="450"
        border
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="70">
        </el-table-column>
        <el-table-column
          align="center"
          prop="date"
          label="创建时间"
          width="230"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="收支类型"
          width="140"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="describe"
          label="收支描述"
          width="150"
        >
        </el-table-column>
        <el-table-column align="center" prop="incode" label="收入" width="130">
          <template slot-scope="scope">
            <span style="color: #00d053">{{ scope.row.incode }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="expend" label="支出" width="130">
          <template slot-scope="scope">
            <span style="color: #f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="cash"
          label="账户现金"
          width="130"
        >
          <template slot-scope="scope">
            <span style="color: #4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注" width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          prop="operation"
          align="center"
          fixed="right"
          width="150"
          v-if="user.identity == 'manage'"
        >
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              icon="delete"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :formData="formData" :dialog="dialog" @update="getProfile" />
  </div>
</template>

<script>
import Dialog from "../components/Dialog";
export default {
  name: "fundList",
  data() {
    return {
      search_data: {
        startTime: "", //开始时间
        endTime: "", //结束时间
      },
      filterTableData: [], //进行时间过滤的容器
      formData: {
        type: "",
        describe: "",
        incode: "",
        expend: "",
        cash: "",
        remark: "",
        id: "", //序号
      },
      tableData: [],
      allTableData: [],
      dialog: {
        show: false, //默认隐藏弹窗，点击按钮后show改为true
        title: "", //用于添加或修改操作
        option: "edit", //点击按钮时默认为edit
      },
      paginations: {
        page_index: 1, //当前位于哪一页
        total: 0, //当前数据的总数
        page_size: 5, //一页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total,sizes,prev,pager,next,jumper", //翻页属性
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      //获取表格数据
      this.$axios
        .get("/api/profiles")
        .then((res) => {
          //获取response，里面包含了表格数据
          // console.log(res);
          this.allTableData = res.data;
          this.filterTableData = res.data;
          //设置分页数据
          this.setPaginations();
        })
        .catch((err) => console.log(err));
    },
    handleEdit(index, row) {
      //编辑
      console.log(this.dialog); //输出data中的dialog
      this.dialog = {
        show: true, //弹窗
        title: "修改资金信息",
        option: "edit",
      };

      //获取当前行的formData
      this.formData = {
        type: row.type,
        describe: row.describe,
        incode: row.incode,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id,
      };
    },
    handleDelete(index, row) {
      this.$axios.delete(`/api/profiles/delete/${row._id}`).then((res) => {
        this.$message("删除成功！");
        this.getProfile();
      });
    },
    handleAdd() {
      this.dialog = {
        show: true, //弹窗
        title: "添加资金信息",
        option: "add",
      };
      this.formData = {
        type: "",
        describe: "",
        incode: "",
        expend: "",
        cash: "",
        remark: "",
        id: "",
      };
    },
    setPaginations() {
      //分页属性设置
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      //设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      //改变当前页面显示的条数
      //切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size; //接收的多少条一页就把页面大小相应修改
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      //改变当前页面//页面跳转
      //获取当前页
      let index = this.paginations.page_size * (page - 1);
      //数据的总数
      let nums = this.paginations.page_size * page;
      //容器
      let tables = [];

      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
      }
    },
    handleSearch() {
      //筛选功能
      //判断开始时间和结束时间是否为空，为空就不进行筛选
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择时间区间",
        });
        this.getProfile();
        return;
      }

      //获取时间
      const sTime = this.search_data.startTime.getTime();
      const eTime = this.search_data.endTime.getTime();
      console.log(sTime);
      console.log(eTime);
      //过滤数据
      this.allTableData = this.filterTableData.filter((item) => {
        // console.log(item);
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime;
      });

      //分页数据的调用
      this.setPaginations();
    },
  },
  components: {
    Dialog,
  },
};
</script>

<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>