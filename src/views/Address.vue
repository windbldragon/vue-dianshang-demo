<template>
  <div>
    <all-header></all-header>
    <nav-bread>
      <span>地址</span>
    </nav-bread>
    <div class="address">
      <h3>收货地址</h3>
      <p class="add-address">新增地址</p>
    </div>
  </div>
</template>
<style>
  .address {
    padding: 50px 15%;
  }
</style>
<script>
  import AllHeader from '../components/Header.vue'
  import NavBread from '../components/NavBread.vue'
  import Model from '../components/Model.vue'
  import axios from 'axios'
  export default {
      data(){
          return {

          }
      },
    components:{
      AllHeader,
      NavBread,
      Model,
    }
  }
</script>
