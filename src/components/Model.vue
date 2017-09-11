<template>
  <div>
    <div class="model-show-login" :class="{'md-show':showModel}">
      <!--<div class="header-show-main">-->
      <div class="model-show-title">
        {{title}}
      </div>
      <button class="model-btn" @click="closeModel" v-if="!showOtherBtn">
        {{btn}}
      </button>
      <div class="model-btn-other" v-if="showOtherBtn">
        <button @click="sure">
          {{btn}}
        </button>
        <button @click="closeModel">
          取消
        </button>
      </div>
      <!--</div>-->
    </div>
    <div class="header-modeltest" v-show="showModel" @click="closeModel"></div>
  </div>
</template>
<style>
  .model-show-login {
    visibility: hidden;
    position: absolute;
    margin-right: 30px;
    background-color: #fff;
    width: 20%;
    left: 36%;
    top: 30%;
    padding: 50px 70px 50px 70px;
    z-index: 300;
    opacity: 0;
    transform: translateY(10%);
    transition: all 1s ease-out;
  }

  .model-show-title {
    font-size: 22px;
    margin-bottom: 20px;
    text-align: center;
  }

  .model-btn {
    width: 100%;
    border: 0;
    height: 50px;
    margin-top: 20px;
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
  .md-show {
    visibility: visible;
    transform: translateY(-10%);
    opacity: 1;
    transition: all 1s ease-out;
  }
  .model-btn-other {
    display: flex;
    justify-content: space-between;
  }
  .model-btn-other button {
    width: 40%;
    border: 0;
    height: 40px;
    margin-top: 20px;
    background-color: #009de6;
  }
</style>
<script>
  export default {
    props: ['title', 'btn', 'showModel','showOtherBtn'],
    data(){
      return {}
    },
    mounted(){
      console.log(this.title);
      console.log(this.showModel);
    },
    methods:{
      closeModel(){
          this.$emit('closeModel');
      },
      sure(){
        this.$emit('makesure');
      },
    }
  }
</script>
