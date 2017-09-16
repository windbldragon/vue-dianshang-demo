var express = require('express');
var router = express.Router();
var Users = require('../models/user');
// var moment=require('moment')


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  let params = {
    userName: userName,
    userPwd: userPwd,
  };
  Users.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    } else {
      res.cookie('userId', doc._doc.userId, {
        path: '/',
        //maxAge单位为毫秒
        maxAge: 1000 * 60 * 60 * 5,
      });
      res.cookie('userName', doc._doc.userName, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 5,
      });
      res.json({
        status: '0',
        msg: 'success',
        result: doc._doc
      })
    }
  })
});

router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1,
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1,
  })
  res.json({
    status: '0',
    msg: 'success'
  })
});

router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    Users.findOne({userId: req.cookies.userId}, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
        })
      } else {
        res.json({
          status: '0',
          msg: 'success',
          result: doc._doc,
        })
      }
    })
  }
});

router.get('/getCarts', (req, res, next) => {
  let userId = req.cookies.userId;
  Users.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: 'success',
        result: doc._doc.cartList,
      })
    }
  })
});

router.get('/delCart', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.param('productId');
  Users.update({userId: userId}, {$pull: {cartList: {productId: productId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      Users.findOne({userId: userId}, (err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: '0',
            msg: 'success',
            result: doc._doc.cartList,
          })
        }
      })
    }
  })
});

router.post('/editCart', (req, res, next) => {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;
  Users.update({userId: userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: 'success',
        result: '',
      })
    }
  })
});

router.post('/checkAll', (req, res, next) => {
  let userId = req.cookies.userId;
  let checkAllflag = req.body.checkAllflag;
  Users.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    } else {
      doc._doc.cartList.map((item) => {
        if (checkAllflag === '0') {
          item.checked = '0'
        } else {
          item.checked = '1'
        }
      })
      doc.save((err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
          })
        } else {
          res.json({
            status: '0',
            msg: 'success',
            result: doc._doc
          })
        }
      })
    }
  })
});

router.get('/getAddress', (req, res, next) => {
  let userId = req.cookies.userId;
  Users.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    } else {
      res.json({
        status: '0',
        msg: 'success',
        result: doc._doc.addressList,
      })
    }
  })
});

router.post('/setDefaultAddress', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  Users.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      doc._doc.addressList.map(item => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      })
      doc.save((err, doc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
          })
        } else {
          res.json({
            status: '0',
            msg: 'success',
            result: doc._doc.addressList,
          })
        }
      })
    }
  })
});

router.get('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.param('addressId');
  Users.update({userId: userId}, {$pull: {addressList: {addressId: addressId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    } else {
      Users.findOne({userId: userId}, (err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.message
          })
        }else {
          res.json({
            status:'0',
            msg:'success',
            result:doc._doc.addressList,
          })
        }
      })
    }
  })
});

router.post('/pay',(req,res,next)=>{
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;
  let orderTotalFee=req.body.orderTotalFee;
  let creatDate=moment(new Date).format('YYYY-MM-DD');
  let orderId='';
  Users.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else {
      let userAddress='';
      let userGoodsList=[];
      doc._doc.addressList.some(item=>{
        if(item.addressId==addressId){
          userAddress=item;
          return true;
        }
      })
      doc._doc.cartList.map(item=>{
        if(item.checked=='1'){
          userGoodsList.push(item)
        }
      });
      let platform='222';
      //显示随机0~1，乘以10，随机0~10，floor之后是0~9整数
      let r1=Math.floor(Math.random()*10);
      let r2=Math.floor(Math.random()*10);
      let saveDate=Date.now()
      let orderId=platform+r1+saveDate+r2;
      let orderInfo={
        orderId,
        userAddress,
        userGoodsList,
        orderStatus:'1',
        orderTotalFee,
        creatDate,
      };
      //在orderList中插入订单方法一：
      // doc._doc.orderList.push(orderInfo);
      // doc.save((err,doc)=>{
      //   if(err){
      //     res.json({
      //       status:'1',
      //       msg:err.message
      //     })
      //   }else {
      //     res.json({
      //       status:'0',
      //       msg:'success',
      //       result:doc._doc
      //     })
      //   }
      // })
      //方法二：实践证明，这两种方法都可以，反而觉得第一种方法更简单明了
      Users.update({userId:userId},{$push:{orderList:orderInfo}},(err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.message
          })
        }else {
          Users.findOne({userId:userId},(err,doc)=>{
            res.json({
              status:'0',
              msg:'success',
              result:doc._doc
            })
          })

        }
      })
    }
  })

});

module.exports = router;
