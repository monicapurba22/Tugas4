//vuex
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const types = {
  SET_AUTHENTICATED: " SET_AUTHENTICATED",//判断是否认证通过
  SET_USER: "SET_USER"
}
const state = {
  isAuthenticated: false,//是否授权
  user: {},//解析token后获取的用户信息存在这里
}
const getters = {
  isAuthenticated: state => state.isAuthenticated,//获取当前是否为授权状态
  user: state => state.user
}
const mutations = {
  //设置是否授权的方法
  [types.SET_AUTHENTICATED](state, isAuthenticated) {//规定了一个方法，类型就是SET_AUTHENTICATED
    if (isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    } else {
      state.isAuthenticated = false
    }
  },
  [types.SET_USER](state, user) {
    if (user) {
      state.user = user;
    } else {
      state.user = {};
    }
  }
}
const actions = {
  setAuthenticated: ({ commit }, isAuthenticated) => {
    commit(types.SET_AUTHENTICATED, isAuthenticated);
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user);
  },
  clearCurrent:({commit})=>{//清除状态
    commit(types.SET_AUTHENTICATED,false);//设为非授权状态
    commit(types.SET_USER,null);//用户设置为空
  }
}


export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})