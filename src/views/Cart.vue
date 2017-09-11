<template>
  <div>
    <all-header @headerClickLogin="headerClickLogin" @headerClickLogout="headerClickLogout"></all-header>
    <nav-bread>
      <span>Carts</span>
    </nav-bread>
    <div class="cart-main">
      <h2>我的购物车</h2>
      <div class="cart-title">
        <p class="cart-goods">商品</p>
        <p>价格</p>
        <p>数量</p>
        <p>总价</p>
        <p>操作</p>
      </div>
      <div class="cart-item" v-for="cartsData in cartsData">
        <div class="cart-goods">
          <input type="checkbox" class="cart-goods-input" v-model="cartsData.isChecked"
                 @change="editCart(cartsData,'check')">
          <img v-lazy="'/static/'+cartsData.productImage" alt="tupian">
          <span>{{cartsData.productName}}</span>
        </div>
        <div>
          {{cartsData.salePrice}}
        </div>
        <div class="cart-calculate">
          <button @click="editCart(cartsData,'minus')">-</button>
          <span>{{cartsData.productNum}}</span>
          <button @click="editCart(cartsData,'add')">+</button>
        </div>
        <div>
          {{cartsData.productNum * cartsData.salePrice}}
        </div>
        <div>
          <button @click="delCart(cartsData.productId)">
            删除
          </button>
        </div>
      </div>
      <div class="cart-footer">
        <p class="cart-checkAll" v-on:click="checkAll">全选</p>
        <p class="cart-total">总计{{totalFee|currency}}</p>
        <p class="cart-submit" @click="submitInfo">提交</p>
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
  .cart-main {
    margin: 0 15%;
  }

  .cart-main h2 {
    padding: 50px 0;
  }

  .cart-title {
    display: flex;
    background-color: #605F5F;
    padding: 20px 0;
    color: #fff;
  }

  .cart-item {
    border: 1px solid #605F5F;
    border-top: 0;
  }

  .cart-title p,
  .cart-item div {
    width: 16.7%;
    text-align: center;
  }

  .cart-calculate button {
    width: 25px;
    height: 25px;
  }

  .cart-goods-input {
    margin-right: 20px;
  }

  .cart-main .cart-goods {
    width: 33.4%;
  }

  .cart-item {
    display: flex;
    padding: 20px 0;
    align-items: center;
  }

  .cart-item .cart-goods {
    width: 33.4%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cart-item .cart-goods img {
    width: 100px;
  }

  .cart-footer {
    display: flex;
    align-items: center;
    margin-top: 30px;
    font-size: 24px;
    background-color: #fff;
  }

  .cart-footer .cart-checkAll {
    width: 40%;
    padding-left: 30px;
  }

  .cart-footer .cart-total {
    width: 40%;
    text-align: right;
    padding-right: 50px;
  }

  .cart-footer .cart-submit {
    width: 20%;
    text-align: center;
    padding: 20px 0;
    background-color: red;
  }
</style>
<script>
  import AllHeader from '../components/Header.vue'
  import NavBread from '../components/NavBread.vue'
  import Model from '../components/Model.vue'
  import {currency} from '../util/currency'
  import axios from 'axios'
  export default {
    data(){
      return {
        cartsData: [],
        title: '',
        btn: '',
        alertModel: false,
        showOtherBtn: false,
        productId: '',
        checkAllFlag: '0',
      }
    },
    components: {
      AllHeader,
      NavBread,
      Model,
    },
    computed:{
      totalFee(){
          let fee=0;
          this.cartsData.map(item=>{
              if(item.isChecked){
                fee+=parseInt(item.salePrice)*parseInt(item.productNum);
              }
          });
        return fee;
      }
    },
    mounted(){
      this.init();
    },
    //TODO:局部过滤器
    filters:{
      currency
    },
    methods: {
      init(){
        axios.get('/users/getCarts').then((res) => {
          if (res.data.status === '1') {
            this.title = '查询购物车失败';
            this.btn = '确定';
            this.alertModel = true;
            alert(res.data.msg);
          } else {
            this.cartsData = res.data.result;
            this.cartsData.map((item, index) => {
              if (item.checked === '1') {
                this.$set(item, 'isChecked', true);
              } else if (item.checked === '0') {
                this.$set(item, 'isChecked', false);
              }
            })
          }
        })
      },
      headerClickLogin(){
        this.title = '登陆成功';
        this.btn = '确定';
        this.alertModel = true;
      },
      headerClickLogout(){
        this.title = '登出成功';
        this.btn = '确定';
        this.alertModel = true;
      },
      close(){
        this.alertModel = false;
      },
      delCart(productId){
        this.title = '您确定要删除该商品吗';
        this.btn = '确定';
        this.showOtherBtn = true;
        this.alertModel = true;
        this.productId = productId;
      },
      makesure(){
        axios.get('/users/delCart', {params: {productId: this.productId}}).then(res => {
          if (status === '1') {
            this.title = res.data.msg;
            this.btn = '确定';
            this.alertModel = true;
            this.showOtherBtn = false;
          } else {
            this.title = '删除成功';
            this.btn = '确定';
            this.alertModel = true;
            this.showOtherBtn = false;
            this.cartsData = res.data.result;
          }
        })
      },
      editCart(data, flag){
        if (flag === 'add') {
          data.productNum++;
        }
        else if (flag === 'minus') {
          if (data.productNum <= 1) {
            return;
          }
          data.productNum--;
        }
        else if (flag === "check") {
          data.checked = data.checked === '1' ? '0' : '1';
        }
        let params = {
          productId: data.productId,
          productNum: data.productNum,
          checked: data.checked,
        };
        axios.post('/users/editCart', params).then(res => {
          if (res.data.status === '1') {
            this.title = res.data.msg;
            this.btn = '确定';
            this.alertModel = true;
            this.showOtherBtn = false;
          }
        }).catch(err=>{
            alert(err);
        })
      },
      checkAll(){
        this.checkAllFlag = this.checkAllFlag === '0' ? '1' : '0';
        axios.post('/users/checkAll',{checkAllflag:this.checkAllFlag})
          .then((res)=>{
            this.cartsData.map(item => {
              if (this.checkAllFlag === '0') {
                this.$set(item, 'isChecked', false);
              }else {
                this.$set(item, 'isChecked', true);
              }
            });
        }).catch(err=>{
            alert(err);
        })
      },
      submitInfo(){
          let count=0;
          this.cartsData.map(item=>{
              if(item.checked==='0'){
                count++
              }
          })
        if(count!==0){
              return;
        }
        this.$router.push({path:'/address'})
      }
    }
  }
</script>
