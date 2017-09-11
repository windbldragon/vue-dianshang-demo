var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var users = require('../models/user')

//连接Mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/xiaolong');

mongoose.connection.on("connected", function () {
  console.log("Mongodb connected success")
})

mongoose.connection.on("error", function () {
  console.log("Mongodb connected fail")
})

mongoose.connection.on("disconnected", function () {
  console.log("Mongodb connected disconnected")
})

//查询商品列表数据
//TODO:试一下params.参数,试过了，不能写成parma.page，必须写成下面这种格式
router.get('/list', function (req, res, next) {
  let sort = req.param('sort');
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let skip = (page - 1) * pageSize;
  let priceLevel = req.param('priceLevel');
  let priceGt = '', priceLte = '';
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 2000;
        break;
    }
  }
  let params = {};
  if (priceLevel) {
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte,
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  if (sort) {
    goodsModel.sort({'salePrice': sort});
  }
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    } else {
      res.json({
        status: '0',
        result: {
          count: doc.length,
          list: doc,
        }
      })
    }
  })
});


router.post('/addCart', (req, res, next) => {
  let userId = req.cookies.userId;
  if(!userId){
    res.json({
      status:'1',
      msg:'用户名不存在'
    })
  }else {
    let _id = req.body._id;
    let productId=req.body.productId
    users.findOne({userId: userId}, (err, userDoc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
        })
      } else {
        let goodsItem = '';
        if (userDoc._doc.cartList.length > 0) {
          userDoc._doc.cartList.some((item) => {
            if (item._doc.productId === productId) {
              goodsItem = item;
              item.productNum++;
              return true;
            }
          })
        }
        if (goodsItem) {
          userDoc.save((error) => {
            if (error) {
              res.json({
                status: 1,
                msg: err.message,
              })
            } else {
              res.json({
                status:1,
                msg:'success',
                result:userDoc._doc,
              })
            }
          })
        } else {
          Goods.findOne({_id: _id}, (err, doc) => {
            if (err) {
              res.json({
                stats: 1,
                msg: err.message,
              })
            } else {
              if (doc) {
                doc._doc.checked = 1;
                doc._doc.productNum = 1;
                userDoc._doc.cartList.push(doc);
                userDoc.save((err) => {
                  if (err) {
                    res.json({
                      status: 1,
                      msg: err.message,
                    })
                  } else {
                    res.json({
                      status: 0,
                      msg: 'success',
                      result: userDoc._doc
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})


module.exports = router

