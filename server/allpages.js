/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const adressebrand = require('./sources/adressebrand');
const mudjeansbrand = require('./sources/mudjeansbrand');

const eshopDedicated = 'https://www.dedicatedbrand.com';
const eshopAdresse = 'https://adresse.paris/630-toute-la-collection?id_category=630&n=109';
const eshopMudJeans = 'https://mudjeans.eu/';

const productsExport = [];

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
      console.log(`🕵️‍♀️  browsing ${url} ...`);
      var products = await dedicatedbrand.scrapeproducts(url);
      for (const product of products) {
        product.link = eshop+product.link;
        allProducts.push(product);
      };
    };

    console.log(allProducts)
    console.log(allProducts.length)
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
        product.link = eshop+product.link;
        allProducts.push(product);
      };

    console.log(allProducts);
    console.log(allProducts.length);
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
      console.log(`🕵️‍♀️  browsing ${url} ...`);
      var products = await mudjeansbrand.scrapeproducts(url);
      for (const product of products) {
        product.link = eshop+product.link;
        allProducts.push(product);
      };
    };

    console.log(allProducts)
    console.log(allProducts.length)
    return allProducts;
    } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

// adresseProducts(eshopAdresse);

//ALL
async function prod() {
  try {
    var allProducts = [];

    await allProducts.push(adresseProducts(eshopAdresse))
    await allProducts.push(dedicatedProducts(eshopDedicated))
    await allProducts.push(mudJeansProducts(eshopMudJeans))
    console.log(allProducts);
    return allProducts;
    } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

prod();
// module.exports.dedicatedProducts = () => {
//   return prod();
// };