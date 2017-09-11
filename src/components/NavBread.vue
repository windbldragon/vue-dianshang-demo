<template>
  <div class="nav-bread">
    <div class="nav-bread-title" @click="gotoHome">
      {{title}}/
    </div>
    <slot></slot>
  </div>
</template>
<style>
  .nav-bread {
    display: flex;
    padding: 0 15%;
    background-color: #f0f0f0;
    height: 50px;
    align-items: center;
  }
  .nav-bread span {
    color: red;
  }
</style>
<script>
  export default {
      data(){
          return {
            title:'home'
          }
      },
    methods:{
      gotoHome(){
          this.$router.push('/');
      }
    }
  }
</script>
