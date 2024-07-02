<template>
  <div class="dialog">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="form"
          :model="formData"
          :rules="form_rules"
          labelwidth="120px"
          style="margin: 10px; width: auto"
        >
          <!-- 收支类型 -->
          <el-form-item label="收支类型：">
            <el-select v-model="formData.type" placeholder="收支类型">
              <!-- 遍历数组 -->
              <el-option
                v-for="(formtype, index) in format_type_list"
                :key="index"
                :label="formtype"
                :value="formtype"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 收支描述 -->
          <el-form-item prop="describe" label="收支描述：">
            <el-input type="describe" v-model="formData.describe"></el-input>
          </el-form-item>
          <!-- 收入 -->
          <el-form-item prop="incode" label="收入：">
            <el-input type="incode" v-model="formData.incode"></el-input>
          </el-form-item>
          <!-- 支出 -->
          <el-form-item prop="expend" label="支出：">
            <el-input type="expend" v-model="formData.expend"></el-input>
          </el-form-item>
          <!-- 账户现金 -->
          <el-form-item prop="cash" label="账户现金：">
            <el-input type="cash" v-model="formData.cash"></el-input>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>

          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取消</el-button>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dialog",
  data() {
    return {
      // formData: {
      //   type: "",
      //   describe: "",
      //   incode: "",
      //   expend: "",
      //   cash: "",
      //   remark: "",
      //   id: "", //序号
      // },
      format_type_list: [
        //收支类型
        "提现",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账",
      ],
      form_rules: {
        //输入框的校验
        describe: [
          { required: true, message: "收支描述不能为空！", trigger: "blur" },
        ],
        incode: [
          { required: true, message: "收入不能为空！", trigger: "blur" },
        ],
        expend: [
          { required: true, message: "支出不能为空！", trigger: "blur" },
        ],
        cash: [
          { required: true, message: "账户现金不能为空！", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    dialog: Object,
    formData: Object,
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          //判断点击的是添加按钮还是编辑按钮
          const url =
            this.dialog.option === "add" ? "add" : `edit/${this.formData.id}`;

          // console.log(this.formData);
          //把数据传递到接口去
          this.$axios
            .post(`/api/profiles/${url}`, this.formData)
            .then((res) => {
              //添加成功
              this.$message({
                message: "数据添加成功",
                type: "success",
              });

              //隐藏弹窗
              this.dialog.show = false;

              //注册事件，由父级组件调用
              this.$emit("update");
            });
        }
      });
    },
  },
};
</script>

<style scoped>
</style>