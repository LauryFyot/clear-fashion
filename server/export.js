/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand');
const db = require('./db');
const allpages = require('./allpages');

async function sandbox () {
  try {
    
    console.log('Create products');
    products = await allpages.scrapeAllProducts();
    console.log('Got '+Object.keys(products).length+' products !');

    console.log('Insert products');
    const result = await db.insert(products);

    db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();