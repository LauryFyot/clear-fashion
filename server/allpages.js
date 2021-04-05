/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const adressebrand = require('./sources/adressebrand');
const mudjeansbrand = require('./sources/mudjeansbrand');

const eshopDedicated = 'https://www.dedicatedbrand.com';
const eshopAdresse = 'https://adresse.paris/630-toute-la-collection?id_category=630&n=109';
const eshopMudJeans = 'https://mudjeans.eu/';

var productsExport = [];

//DEDICATED
async function dedicatedProducts (eshop) {
  try {
    var allMainURLs = [];
    var allProducts = [];

    //Get all ends of URLS
    const endURLs = await dedicatedbrand.scrapepages(eshop);

    //Add the end to the path
    endURLs.forEach(item => {
        allMainURLs.push(eshop+item.endURL);
    });
    
    //For each page scrap all products
    for (const url of allMainURLs) {
      // console.log(`🕵️‍♀️  browsing ${url} ...`);
      var products = await dedicatedbrand.scrapeproducts(url);
      for (const product of products) {
        product.link = eshop+product.link;
        allProducts.push(product);
        productsExport.push(product);
      };
    };

    // console.log(allProducts)
    // console.log(allProducts.length)
    return allProducts;
    } catch (e) {
    console.error(e);
    process.exit(1);
  }
};


//ADRESSE
async function adresseProducts(eshop) {
  try {
    var allProducts = [];

    var products = await adressebrand.scrapeproducts(eshop);
      for (const product of products) {
        // product.link = eshop+product.link;
        allProducts.push(product);
        productsExport.push(product);
      };

    // console.log(allProducts);
    // console.log(allProducts.length);
    return allProducts;
    } catch (e) {
    console.error(e);
    process.exit(1);
  }
};


//MUDJEANS
async function mudJeansProducts(eshop) {
  try {
    var allMainURLs = [];
    var allProducts = [];

    //Get all ends of URLS
    var endURLs = await mudjeansbrand.scrapepages(eshop);
    endURLs = endURLs.filter(el => (el.endURL !== undefined) && (el.endURL.includes('collections')));

    //Add the end to the path
    endURLs.forEach(item => {
        allMainURLs.push(eshop+item.endURL);
    });
    
    //For each page scrap all products
    for (const url of allMainURLs) {
      // console.log(`🕵️‍♀️  browsing ${url} ...`);
      var products = await mudjeansbrand.scrapeproducts(url);
      for (const product of products) {
        const regexp = /\d+(?:\,\d+)?/g;
        const array = [...product.price.matchAll(regexp)];
        product.price = parseInt(array[0][0]);
        product.photo = 'https:'+product.photo;
        product.link = eshop+product.link;
        allProducts.push(product);
        productsExport.push(product);
      };
    };

    // console.log(allProducts)
    // console.log(allProducts.length)
    return allProducts;
    } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

async function prod() {
  try {
    var allProducts = [];
    var a = await adresseProducts(eshopAdresse);
    var b = await dedicatedProducts(eshopDedicated);
    var c = await mudJeansProducts(eshopMudJeans);
    allProducts = allProducts.concat(a, b, c);
    return allProducts;
    } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

module.exports.scrapeAllProducts = () => {
  console.log('lalala');
  return prod();
};