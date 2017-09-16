import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Goodslist from '../views/GoodsList.vue'
import Cart from '../views/Cart.vue'
import Test from '../views/test.vue'
import Address from '../views/Address.vue'
import Order from '../views/Order.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Goodslist',
      component: Goodslist
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/order',
      name: 'Order',
      component: Order
    }
  ]
})
