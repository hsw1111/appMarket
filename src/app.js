import Vue from 'vue'
import app from './app.vue'
import axios from  './api/axios_api.js'
import iView from 'iview';
import vuescroll from 'vue-scroll'
import 'minireset.css'
import 'iview/dist/styles/iview.css';
import router from './router/index.js'
import staticRoute from './router/staticRoute.js'
import './my-theme/index.less';
import store from './store/store'
import * as types from './store/types.js'


Vue.use(iView)
Vue.use(vuescroll)
Vue.prototype.axios = axios


// 自定义指令设置按钮权限
Vue.directive('has', {
    bind: function(el, binding) {
        if (!Vue.prototype.$_has(binding.value)) {
            // el.parentNode.removeChild(el);
            $(el).remove()
        }
    }
});
Vue.prototype.$_has = function(value) {
    let isExist=false;
    let btnPermsStr=window.localStorage.getItem("btnPerms");
    if(btnPermsStr==undefined || btnPermsStr==null){
      return false;
    }
    let btnPerms=JSON.parse(btnPermsStr);
    for(let i=0;i<btnPerms.length;i++){
      if(btnPerms[i].perms.indexOf(value)>-1){
        isExist=true;
        break;
      }
    }
    return isExist;
  };

  let authList = window.localStorage.getItem('authList')
  let token = window.localStorage.getItem('token')

if (authList) {
    store.commit(types.ADD_MENU, authList)
    store.commit(types.ADD_MENU, JSON.parse(authList))
    router.addRoutes(store.state.menus.items)
}

router.beforeEach((to, from, next) => {
    var userName = window.localStorage.getItem("userName")
    var password = window.localStorage.getItem("password")
    // 匹配不到路由跳转到notfound页面
    if (to.matched.length ===0) { 
        next({path:'/notfound'})
    }
    if(to.path === '/'){
        window.localStorage.clear()
        next({path:'/login'})
    }
    if(to.path === '/login'){
        window.localStorage.clear()
    }
    if(userName && password){
        next()
    }else{
        if(to.path=='/login'){
            console.log(333)
            next()
            
        }else{
            console.log(444)
            next({path:'/login'})
        }
        window.localStorage.clear()
    }
})

var vm = new Vue({
    el:"#app",
    router,
    render: h => h(app),
    store
})


