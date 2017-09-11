<template>
  <div>
    <div @click="test">test</div>
    <div style="margin-bottom:50px;"></div>
    <div v-for="item in data">
      <p>{{item.name}}</p>
      <input type="checkbox" v-model='item.checktest'>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        data: [{name: 'bailong'}, {name: 'yuhuichao'}, {name: 'love'}],
      }
    },
    created(){

    },
    mounted(){
      this.init();
    },
    updated(){
        console.log(1);
    },
    methods: {
      init(){
        this.data.map(item => {
          this.$set(item,'checktest',true);
        })
      },
      test(){
        this.data.map(item => {
          this.$set(item,'checktest',!item.checktest);
        })
        console.log(this.data)
      }
    }
  }
</script>
