<template>
  <div class="goodList-main">
    <AllHeader @headerClickLogin="headerClickLogin" @headerClickLogout="headerClickLogout"></AllHeader>
    <NavBread>
      <span>Goods</span>
    </NavBread>
    <div>
      <!--TODO:侧边弹出模态框-->
      <!--<div class="goodList-main-top">-->
        <!--<div @click="test">sort by:</div>-->
        <!--<a href="#">Default</a>-->
        <!--<a @click="sortPrice()">Price</a>-->
      <!--</div>-->
      <!--<div class="goodList-main-left test" :class="{'showtest':showtest222}">-->
        <!--<h5>price</h5>-->
        <!--<div>-->
          <!--<a href="javascript:void(0)" :class="{'hasChecked':hasChecked==='all'}" @click="clickAll">all</a>-->
        <!--</div>-->
        <!--<div v-for="(item,index) in priceList" @click="clickPrice(index)">-->
          <!--<a href="javascript:void(0)"-->
             <!--:class="{'hasChecked':hasChecked===index}">{{item.startPrice}}-{{item.endPrice}}</a>-->
        <!--</div>-->
      <!--</div>-->


      <div class="goodList-main-middle">
        <div class="goodList-main-left">
          <h5>price</h5>
          <div>
            <a href="javascript:void(0)" :class="{'hasChecked':hasChecked==='all'}" @click="clickAll">all</a>
          </div>
          <div v-for="(item,index) in priceList" @click="clickPrice(index)">
            <a href="javascript:void(0)" :class="{'hasChecked':hasChecked===index}">{{item.startPrice}}-{{item.endPrice}}</a>
          </div>
        </div>
        <div class="goodList-main-right">
          <ul>
            <li class="goodList-main-right-goods" v-for="(item,index) in goodsData">
              <img v-lazy="'/static/'+item.productImage" alt="图片"/>
              <div class="goods-name">
                {{item.productName}}
              </div>
              <div class="goods-price">
                {{item.salePrice}}
              </div>
              <button @click="addCart(item._id,item.productId)">
                加入购物车
              </button>
            </li>
          </ul>
        </div>
      </div>
      <!--下拉加载更多-->
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"
           class="goodList-loadmore"
           v-show="!noData">
        加载更多...
        <img src="../assets/loading-spinning-bubbles.svg" alt="加载中">
      </div>
    </div>
    <Model :title="title" :btn="btn" :showModel="alertModel" @closeModel="close" v-if="alertModel"></Model>
    <div class="modeltest" v-show="overLayFlag" @click.stop="closeModel"></div>
  </div>
</template>
<style>
  .modeltest {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
  }

  .test {
    width: 150px !important;
    background-color: red;
    position: absolute;
    right: -170px;
    z-index: 300;
    transition: right .5s ease-out;
  }

  .showtest {
    right: 0;
    transition: right .5s ease-out;
  }

  .goodList-main {

  }

  .goodList-main-top {
    display: flex;
    margin: 50px 15% 0 15%;
    background-color: #fff;
    justify-content: flex-end;
    padding: 20px 30px 20px 0;
  }

  .goodList-main-top a {
    margin-left: 20px;
    text-decoration: none;
    color: #333;
  }

  .goodList-main-top a:hover {
    color: #d1434a;
  }

  .goodList-main-middle {
    display: flex;
    margin: 50px 15% 0 15%;
    padding-bottom: 70px;
  }

  .goodList-main-left {
    width: 15%;
    padding-left: 20px;
  }

  .goodList-main-left h5 {
    font-size: 24px;
    color: #605F5F
  }

  .goodList-main-left div {
    margin-top: 30px;
  }

  .goodList-main-left div a {
    text-decoration: none;
    cursor: pointer;
    transition: padding-left .3s ease-out;
    color: #333;
  }

  .goodList-main-left div a:hover {
    color: #ee7a23;
    transition: padding-left .3s ease-out;
    padding-left: 20px;
  }

  .goodList-main-right {
    width: 85%;
  }

  .goodList-main-right ul {
    display: flex;
    flex-wrap: wrap;
  }

  .goodList-main-right-goods {
    background-color: #fff;
    list-style: none;
    margin-left: 10px;
    margin-bottom: 10px;
    border: 1px solid #e9e9e9;
    transition: all .5s ease-out;
  }

  .goodList-main-right-goods:hover {
    box-shadow: 0 0 10px #999;
    transition: all .5s ease-out;
    border-color: #ee7a23;
    transform: translateY(-10px);
  }

  .goods-name,
  .goods-price {
    margin-left: 10px;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .goods-price {
    color: red;
  }

  .goodList-main-right button {
    width: 90%;
    margin: 0 5% 10px 5%;
    padding: 10px 0;
    color: red;
    border: 1px solid red;
    background: transparent;
  }

  .goodList-main-right-goods img {
    width: 220px;
    height: 220px;
  }

  .hasChecked {
    color: #ee7a23 !important;
  }

  .goodList-loadmore {
    margin: 0 15%;
    text-align: center;
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
        goodsData: [],
        priceList: [
          {startPrice: 0, endPrice: 100},
          {startPrice: 100, endPrice: 500},
          {startPrice: 500, endPrice: 1000},
          {startPrice: 1000, endPrice: 2000},
        ],
        hasChecked: 'all',
        showtest222: false,
        overLayFlag: false,
        sortFlag: true,
        page: 1,
        pageSize: 4,
        busy: false,
        noData: false,
        hasSort: false,
        title:'',
        alertModel:false,
        btn:''
      }
    },
    components: {
      AllHeader,
      NavBread,
      Model,
    },
    mounted(){
      this.getGoodsList();
    },
    methods: {
      getGoodsList(index){
        let params = {
          page: this.page,
          pageSize: this.pageSize,
        }
        if (index === 1) {
          params.sort = this.sortFlag ? 1 : -1;
        }
        if (index === 3) {
          params.priceLevel = this.hasChecked;
        }
        if (index == 2 && this.hasChecked !== 'all') {
          params.priceLevel = this.hasChecked;
        }
        axios.get('/goods/list', {
          params: params
        }).then((res) => {
          if (index == 2) {
            this.goodsData = this.goodsData.concat(res.data.result.list)
            if (res.data.result.count < this.pageSize) {
              this.busy = true;
              this.noData = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodsData = res.data.result.list;
          }
        })
          .catch(error => {
            alert(error);
          })
      },
      sortPrice(){
        this.page = 1;
        this.getGoodsList(1);
        this.sortFlag = !this.sortFlag;
      },
      loadMore(){
        this.busy = true;

        setTimeout(() => {
          this.page++;
          this.getGoodsList(2);
        }, 500);
      },
      addCart(id, productId){
        axios.post('/goods/addCart', {_id: id, productId: productId}).then((res) => {
          if (res.data.status === '1') {
            this.title=res.data.msg;
            this.btn='确定';
          } else {
            this.title='加入购物车成功';
            this.btn='确定';
          }
          this.alertModel=true;
        })
          .catch((err) => {
            alert(err);
          })
      },
      close(){
        this.alertModel=false;
      },
      headerClickLogin(){
        this.title='登陆成功';
        this.btn='确定';
        this.alertModel=true;
      },
      headerClickLogout(){
        this.title='登出成功';
        this.btn='确定';
        this.alertModel=true;
      },


      clickAll(){
        this.hasChecked = 'all';
        this.page = 1;
        this.getGoodsList();
      },
      clickPrice(index){
        this.hasChecked = index;
        this.page = 1;
        this.getGoodsList(3);
      },
      test(){
        this.showtest222 = true;
        this.overLayFlag = true;
      },
      closeModel(){
        this.showtest222 = false;
        this.overLayFlag = false;
      }
    },

  }
</script>
