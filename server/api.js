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
  console.log("hello route");
  response.send({'ack': true});
});

app.get('/product/:id', async (request, response) => {
  var product_id = request.params.id;
  console.log("uuid to query"+product_id);
  const res = await db.find({'uuid' : product_id});
  response.send(res);
});

const getMetaData = async (page, size, q) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const nb = q.length;
  //onst nb=4;
  const pageCount = parseInt(nb/size);
  return {"currentPage" : page,"pageCount":pageCount,"pageSize":size,"count":nb} 
}

// app.get('/products/search/:limit?/:brand?/:price?', async (request, response) => {
//   var limit = request.params.limit;
//   var brand = request.params.brand;
//   var price = request.params.price;
//   console.log("limit :"+limit+" | brand :"+brand+" | price :"+price);
//   const res = await db.aggregate([ { "$match": { "brand": brand } },  { "$match": { "brand": brand } }]);
//   response.send(res);
// });

// app.get('/products/search', async (request, response) => {
//   var limit = request.query.limit;
//   var brand = request.query.brand;
//   var price = parseInt(request.query.price);
//   let page = parseInt(request.query.page);
//   let size = parseInt(request.query.size);
//   const whichpage= page!=0 ? page*size : 0

//   console.log("limit :"+limit+" | brand :"+brand+" | price :"+price);
//   const res = await db.find({$and : [ {"brand":brand},{ "price": { $lte: 30 }}]});
//   console.log(res.length);

//   response.send(res);
// });



// app.get('/products/search', async (request, response)=>{

//   const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
//   const db =  client.db(MONGODB_DB_NAME);

//   let brand = request.query.brand;
//   let price = parseInt(request.query.price);
//   let page = parseInt(request.query.page);
//   let size = parseInt(request.query.size);
//   const whichpage= page!=0 ? page*size : 0;
  
//   if (request.query.price==undefined){price = 10000000;}
//   console.log("page :"+page+" | brand :"+brand+" | price :"+price);

//   const collection = db.collection(MONGODB_COLLECTION);
  

//   const query= await collection.find({$and : [ {'brand':brand}, { price: { $lte: price }}]}).toArray();
//   console.log('query', query);
  
//   console.log("whichpage :"+whichpage);
//   //page commence à 0 avec le skip
//   const prod = await collection.find({$and : [ {'brand':brand}, { price: { $lte: price }}]}).skip(whichpage).limit(size).toArray();
//   console.log('prod'+prod);

    
//   let meta = await getMetaData(page,size, query);
    
//   let products = {
//     "success" : true,
//     "data" : {
//     "result" : prod,
//     "meta": meta
//       }}
// response.send(products);
// });


app.get('/products/search', async (request, response)=>{

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection(MONGODB_COLLECTION);

  let page = parseInt(request.query.page);
  let size = parseInt(request.query.size);
  const whichpage= page!=0 ? page*size : 0;
  console.log("page :"+page+" | whichpage :"+whichpage);

  const all_products = await collection.find().toArray();
  console.log('query', all_products);
  const products = await collection.find().skip(whichpage).limit(size).toArray();
    
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