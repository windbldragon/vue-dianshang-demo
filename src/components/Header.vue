<template>
  <div class="header-main">
    <h3>龙的小店</h3>
    <div class="header-main-main">
      <p class="header-main-nickName" v-if="nickName" @click="totest">{{nickName}}</p>
      <p class="header-main-nickName" @click="toCart" v-if="nickName">购物车</p>
      <p class="header-main-signIn" @click="login" v-if="!nickName">登录</p>
      <p class="header-main-signIn" @click="logout" v-if="nickName">登出</p>
    </div>
    <!--模态框-->
    <div class="header-show-login" :class="{'md-show':showLogin}">
      <!--<div class="header-show-main">-->
      <div class="header-show-title">
        登录
      </div>
      <div class="header-show-input">
        <input type="text" v-model="userName" placeholder="请输入用户名">
      </div>
      <div class="header-show-input">
        <input type="text" v-model="userPwd" placeholder="请输入密码" @keyup.enter="loginInfo">
      </div>
      <button class="header-login-btn" @click="loginInfo">
        登录
      </button>
      <!--</div>-->
    </div>
    <div class="header-modeltest" v-show="showLogin" @click="closeModel"></div>
  </div>
</template>
<style>
  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 100px;
    padding: 0 15%;
  }

  .header-main-main {
    display: flex;
  }

  .header-main h3 {
    font-size: 24px;
  }

  .header-main-nickName {
    margin-right: 20px;
  }

  .header-show-login {
    visibility: hidden;
    position: absolute;
    margin-right: 30px;
    background-color: #fff;
    width: 20%;
    left: 36%;
    top: 30%;
    padding: 30px 70px 50px 70px;
    z-index: 300;
    opacity: 0;
    transform: translateY(10%);
    transition: all 1s ease-out;
  }

  .md-show {
    visibility: visible;
    transform: translateY(-10%);
    opacity: 1;
    transition: all 1s ease-out;
  }

  .header-show-title {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .header-show-input {
    margin-bottom: 20px;
    border: 1px solid #ccc;

  }

  .header-show-input input {
    width: 100%;
    font-size: 20px;
    border: 0;
    padding: 10px 0;
  }

  .header-login-btn {
    width: 100%;
    border: 0;
    height: 50px;
    background-color: #009de6;
  }

  .header-modeltest {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
  }
</style>
<script>
  import axios from 'axios'
  import Model from '../components/Model.vue'
  export default {
    data(){
      return {
        userName: '',
        userPwd: '',
        showLogin: false,
        nickName: '',
      }
    },
    components: {
      Model,
    },
    mounted(){
      this.checkLogin();
    },
    methods: {
      login(){
        this.showLogin = true;
      },
      logout(){
        axios.post('/users/logout').then((res)=>{
            this.nickName='';
          this.$emit('headerClickLogout')
//            alert('登出成功');
        }).catch((err)=>{
            alert(err);
        })
      },
      closeModel(){
        this.showLogin = false;
      },
      loginInfo(){
        let params = {
          userName: this.userName,
          userPwd: this.userPwd,
        };
        axios.post('/users/login', params).then(res => {
          if (res.data.status === '1') {
            alert(res.data.msg);
          } else {
            this.showLogin = false;
            this.nickName = res.data.result.nickName;
            this.$emit('headerClickLogin')
//            alert('登陆成功');
          }
        })
          .catch(error => {
            alert(error);
          })
      },
      checkLogin(){
        axios.get('/users/checkLogin').then((res) => {
          console.log(res);
          if (res.data.status==='1') {
            alert(res.data.msg);
          } else {
            this.nickName = res.data.result.nickName;
          }
        }).catch(err => {
          alert(err);
        })
      },
      toCart(){
        this.$router.push({path:'/cart'})
      },
      totest(){
          this.$router.push({path:'/test'})
      }
    }
  }
</script>
