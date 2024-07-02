<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "App",
  components: {},
  created() {
    if (localStorage.eleToken) {
      const decoded = jwt_decode(localStorage.eleToken); //解析
      //把token存储到vuex中
      this.$store.dispatch("setAuthenticated", !this.isEmpty(decoded)); //判断是否授权
      this.$store.dispatch("setUser", decoded); //判断是否授权
    }
  },
  methods: {
    isEmpty(value) {
      //判断接收的数据是否为空，为空就返回真
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  },
};
</script>
<style>
html,
body,
#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
