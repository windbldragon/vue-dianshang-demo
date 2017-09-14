<template>
  <div>
    <div>
      <all-header></all-header>
      <nav-bread>
        <span>地址</span>
      </nav-bread>
      <div class="address">
        <div class="address-top">
          <h3>收货地址</h3>
          <div class="address-main">
            <div class="address-one" v-for="(item,index) in addressListFilter"
                 @click="checkHandle(index)"
                 :class="{'checked-style':checkedIndex==index}">
              <p>{{item.userName}}</p>
              <p>{{item.streetName}}</p>
              <p class="address-num">{{item.postCode}}</p>
              <div class="address-one-bottom">
                <p v-if="item.isDefault">默认地址</p>
                <p v-else style="color: red" @click="setAddress(item.addressId)">设为默认</p>
                <p class="address-del" @click="delAddress(item.addressId)">删除</p>
              </div>
            </div>
            <div class="add-address">
              <p>新增地址</p>
            </div>
          </div>
          <p class="address-more" @click="loadMore" v-if="limitArr!=addressList.length">更多</p>
          <p class="address-more" @click="loadMore" v-else>收起</p>
        </div>
        <!--<div class="address-bottom">-->
          <!--<h3>配送方式</h3>-->
          <!--<div>-->
            <!--<p class="address-method">发送方式</p>-->
          <!--</div>-->
        <!--</div>-->
        <div class="address-checkout">
          <p>结算</p>
        </div>
      </div>
    </div>
    <model
      :title="title"
      :btn="btn"
      :showModel="alertModel"
      @closeModel="close"
      v-if="alertModel"
      :showOtherBtn="showOtherBtn"
      @makesure="makesure">
    </model>
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
    width: 19%;
    border: 2px solid #e9e9e9;
    margin-right: 10px;
    margin-bottom: 20px;
    height: 130px;
    padding: 20px;
    background-color: #fff;
  }

  .address-one:hover {
    border-color: #ee7a23;
    cursor: pointer;
  }

  .checked-style {
    border-color: #ee7a23 !important;
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
    width: 19%;
    border: 2px solid #e9e9e9;
    margin-right: 10px;
    height: 130px;
    padding: 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .address-more {
    text-align: center;
    color: #ee7a23;
    margin-top: 20px;
    font-size: 20px;
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

  .address-del {
    color: red;
  }
  .address-checkout {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 70px;
    height: 10px

  }
  .address-checkout p{
    width: 6%;
    text-align: center;
    padding: 20px 70px;
    background-color: red;
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
        addressList: [],
        limitArr: 3,
        checkedIndex: 0,
        title: '',
        btn: '',
        alertModel: false,
        showOtherBtn: false,
        addressId: ''
      }
    },
    components: {
      AllHeader,
      NavBread,
      Model,
    },
    computed: {
      addressListFilter(){
        return this.addressList.slice(0, this.limitArr);
      }
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        axios.get('/users/getAddress').then((res) => {
          this.addressList = res.data.result;
        })
          .catch(err => {
            alert(err);
          })
      },
      loadMore(){
        if (this.limitArr != this.addressList.length) {
          this.limitArr = this.addressList.length;
        } else {
          this.limitArr = 3
        }
      },
      checkHandle(index){
        this.checkedIndex = index;
        console.log(this.checkedIndex);
      },
      setAddress(addressId){
        let params = {
          addressId: addressId,
        };
        axios.post('/users/setDefaultAddress', params).then((res) => {
          this.addressList = res.data.result;
        })
          .catch(err => {
            alert(err);
          })
      },
      delAddress(addressId){
        this.title = '您确定要删除此地址吗？'
        this.btn = '确定';
        this.alertModel = true;
        this.showOtherBtn = true;
        this.addressId = addressId;
      },
      close(){
        this.alertModel = false;
      },
      makesure(){
        axios.get('/users/delAddress', {params:{addressId: this.addressId}}).then((res)=>{
          this.alertModel = false;
          this.addressList=res.data.result;
        })
          .catch(err=>{
              alert(err);
          })
      }
    }
  }
</script>
