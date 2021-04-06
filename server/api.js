const cors = require('cors');
var util = require('util')
const express = require('express');
const helmet = require('helmet');
const db = require('./db');


const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'WebAPP';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = 'mongodb+srv://WebAPPUser:WebAPPUser@webapp.gteyh.mongodb.net/WebAPP?retryWrites=true&w=majority';

let client = null;
let database = null;

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack2': true});
});

app.get('/product/:id', async (request, response) => {
  var product_id = request.params.id;
  const res = await db.find({'uuid' : product_id});
  response.send(res);
});

const getMetaData = async (page, size, q) => {
  const nb = q.length;
  const pageCount = parseInt(nb/size);
  return {"currentPage" : page,"pageCount":pageCount,"pageSize":size,"count":nb} 
}


//I have implemeted all the requested queries (as asked in workshop 6), and used the method of .skip to get page of a given size
//But for a better presentation, I chose to display products sorted by uuid (in orden to not have only sockets on the first page)
//And used a query were all the products are selected and then split into chunck of the size SIZE and page PAGE.


//ALL PRODUCTS
app.get('/all_products', async (request, response)=>{

  var price = request.query.price;
  var limit = request.query.limit;
  var brand = request.query.brand;
  var res = [];
  
  if (price == undefined) {price = 1000000};
  if (limit == undefined) {limit = 1000000};

  if (request.query.brand == undefined) {
    res = await db.aggregate([
      {
        "$match": {"price": { $lte: parseInt(price) }}
       },
       {
          "$sort": {"price": 1}
       },
       {
         "$limit": parseInt(limit)
       }])
  }
  else{
    res = await db.aggregate([
      {
        "$match": { "$and" : [{"price": { $lte: parseInt(price) }}, {"brand" : brand}]}
       },
       {
          "$sort": {"price": 1}
       },
       {
         "$limit": parseInt(limit)
       }])
  }
  
  let meta = await getMetaData(0,res.length, res);
    
  let res_products = {
    "success" : true,
    "data" : {
      "result" : res,
      "meta": meta
    }
  }

response.send(res_products);
});


//BRAND and  PRICE and LIMIT
app.get('/products', async (request, response)=>{

  var price = request.query.price;
  var limit = request.query.limit;
  var brand = request.query.brand;
  var res = [];
  
  if (price == undefined) {price = 1000000};
  if (limit == undefined) {limit = 1000000};

  if (request.query.brand == undefined) {
    res = await db.aggregate([
      {
        "$match": {"price": { $lte: parseInt(price) }}
       },
       {
          "$sort": {"price": 1}
       },
       {
         "$limit": parseInt(limit)
       }])
  }
  else{
    res = await db.aggregate([
      {
        "$match": { "$and" : [{"price": { $lte: parseInt(price) }}, {"brand" : brand}]}
       },
       {
          "$sort": {"price": 1}
       },
       {
         "$limit": parseInt(limit)
       }])
  }
  
  let meta = await getMetaData(0,res.length, res);
    
  let res_products = {
    "success" : true,
    "data" : {
      "result" : res,
      "meta": meta
    }
  }

response.send(res_products);
});


//By PAGE and SIZE (volontairement sort par uuid car plus sympa que d'avoir que des chaussettes en première page)
app.get('/products/search', async (request, response)=>{

  let page = parseInt(request.query.page);
  let size = parseInt(request.query.size);
  const whichpage= page!=0 ? page*size : 0;

  const all_products = await db.find();
  const products = await db.findByPage([{"$sort": {"uuid": 1} }], whichpage, size);
  let meta = await getMetaData(page,size, all_products);
    
  let res_products = {
    "success" : true,
    "data" : {
      "result" : products,
      "meta": meta
    }
  }

response.send(res_products);
});


//By PAGE and SIZE but sorted on all products
app.get('/products/searchall', async (request, response)=>{

  let page = parseInt(request.query.page);
  let size = parseInt(request.query.size);

  const all_products = await db.aggregate([{"$sort": {"uuid": 1} }]);
  // console.log('l'+all_products);
  all_products.forEach(e => {console.log(JSON.stringify(e))});
  var chunks = [];

  var i,j,temparray = [];
  for (i=0,j=all_products.length; i<j; i+=size) {
      temparray = all_products.slice(i,i+size);
      chunks.push(temparray);
  }

  const products = chunks[page];
  products.forEach(e => {console.log(e)});
  let meta = await getMetaData(page,size, all_products);
    
  let res_products = {
    "success" : true,
    "data" : {
      "result" : products,
      "meta": meta
    }
  }

response.send(res_products);
});


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);