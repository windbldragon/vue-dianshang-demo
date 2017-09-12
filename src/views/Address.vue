<template>
  <div>
    <all-header></all-header>
    <nav-bread>
      <span>地址</span>
    </nav-bread>
    <div class="address">
      <div class="address-top">
        <h3>收货地址</h3>
        <div class="address-main" >
          <div class="address-one" v-for="item in addressList">
            <p>{{item.userName}}</p>
            <p>{{item.streetName}}</p>
            <p class="address-num">{{item.postCode}}</p>
            <div class="address-one-bottom">
            <p v-if="item.isDefault">默认地址</p>
            <p v-else></p>
            <p class="address-del">删除</p>
            </div>
          </div>
          <div class="add-address">
            <p>新增地址</p>
          </div>
        </div>
      </div>
      <div class="address-bottom">
        <h3>配送方式</h3>
        <div>
          <p class="address-method">发送方式</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .address {
    padding: 50px 15%;
    background-color: #f5f7fc;
  }

  .address-main {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .address-one {
    width: 20%;
    border: 2px solid #e9e9e9;
    margin-right: 10px;
    margin-bottom: 20px;
    height: 130px;
    padding: 20px;
    background-color: #fff;
  }
  .address-one p {
    margin-bottom: 10px;
  }
  .address-num {
    margin-top: 25px;
  }
  .address-one-bottom {
    display: flex;
    justify-content: space-between;
  }

  .add-address {
    width: 20%;
    border: 2px solid #e9e9e9;
    margin-right: 10px;
    height: 130px;
    padding: 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .address-method {
    width: 20%;
    text-align: center;
    margin-top: 20px;
    padding: 50px 0;
    border: 2px solid #e9e9e9;
  }

  .address-bottom {
    margin-top: 50px;
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
          addressList:[],
      }
    },
    components: {
      AllHeader,
      NavBread,
      Model,
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        axios.get('/users/getAddress').then((res) => {
          this.addressList=res.data.result;
        })
          .catch(err => {
            alert(err);
          })
      }
    }
  }
</script>
