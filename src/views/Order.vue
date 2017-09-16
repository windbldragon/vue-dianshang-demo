<template>
  <div>
    <all-header></all-header>
    <nav-bread>
      <span>订单确认</span>
    </nav-bread>
    <div class="cart-main">
      <h2>我的购物车</h2>
      <div class="cart-title">
        <p class="cart-goods">商品</p>
        <p>价格</p>
        <p>数量</p>
        <p>总价</p>
      </div>
      <div class="cart-item" v-for="cartsData in cartsData">
        <div class="cart-goods">
          <img v-lazy="'/static/'+cartsData.productImage" alt="tupian"/>
          <span>{{cartsData.productName}}</span>
        </div>
        <div>
          {{cartsData.salePrice}}
        </div>
        <div class="cart-calculate">
          <span>{{cartsData.productNum}}</span>
        </div>
        <div>
          {{cartsData.productNum * cartsData.salePrice}}
        </div>
      </div>
      <div class="cart-footer">
        <p class="cart-total">总计￥{{totalFee}}元</p>
      </div>
      <div class="cart-footer">
        <p class="cart-submit" @click="payFee">付款</p>
      </div>
    </div>
  </div>
</template>
<style>
  .cart-main {
    margin: 0 15% 50px 15%;
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
    width: 20%;
    text-align: center;
  }

  .cart-calculate button {
    width: 25px;
    height: 25px;
  }

  .cart-main .cart-goods {
    width: 40%;
  }

  .cart-item {
    display: flex;
    padding: 20px 0;
    align-items: center;
  }

  .cart-item .cart-goods {
    width: 40%;
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
    justify-content: flex-end;
    margin-top: 30px;
    font-size: 24px;
  }

  .cart-footer .cart-total {
    width: 20%;
    text-align: center;
    padding: 20px 0;
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
  import axios from 'axios'
  export default {
    data(){
      return {
        cartsData: [],
        totalFee: 0,
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
        axios.get('/users/getCarts').then(res => {
          res.data.result.map((item) => {
            if (item.checked === '1') {
              this.cartsData.push(item);
              this.totalFee += parseInt(item.salePrice) * parseInt(item.productNum)
            }
          })
        })
          .catch(err => {
            alert(err);
          })
      },
      payFee(){
          let params={
            addressId:this.$route.query.addressId,
            orderTotalFee:this.totalFee,
          };
          axios.post('/users/pay',params).then(res=>{
              console.log(res);
          })
            .catch(err=>{
                alert(err)
            })
      }
    }
  }
</script>
