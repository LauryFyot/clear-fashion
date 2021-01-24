// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}]

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);


/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable

const cheapestTshirt = 'https://www.loom.fr/collections/tous-les-vetements/products/le-t-shirt';
console.log(cheapestTshirt);

/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

 console.log(marketplace);

// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable

const nbproducts = marketplace.length;
console.log(nbproducts);

// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have

var allbrandList = [];
marketplace.forEach(element => {
  allbrandList.push(element.brand);
});
let uniqueBrandList = [...new Set(allbrandList)];
console.log(uniqueBrandList);
console.log("List of unique brands :");
console.log(uniqueBrandList.length);

// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable

marketplace.sort((a, b) => (a.price > b.price) ? 1 : -1);
var sortedPriceMkp = marketplace;
console.log("Sort by price :");
console.log(sortedPriceMkp);

// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable

var sortedDateMkp = Object.assign([], marketplace);
sortedDateMkp.sort((a, b) => (new Date(a.date) > new Date(b.date)) ? -1 : 1);
console.log("Sort by date :");
console.log(sortedDateMkp);

// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list

var filteredMkp = marketplace.filter(k => k.price>50 && k.price<100);
console.log("Products between 50€ and 100€ :");
console.log(filteredMkp);

// 🎯 TODO: Average Basket
// 1. Determine the average basket of the marketplace
// 2. Log the average

let s = 0;
marketplace.forEach(function (el) {
  s+=el.price;
});
var avgBasket = s/marketplace.length;
console.log("Average price :");
console.log(avgBasket);

/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands

const brands = {};

marketplace.forEach(function(product) {
  if (Object.keys(brands).includes(product.brand) == false){
    brands[product.brand] = marketplace.filter(k => k.brand == product.brand);
  };
});

console.log("Dict of brand/products :");
console.log(brands);

// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort

for (const [key, value] of Object.entries(brands)){
  value.sort((a, b) => (a.price > b.price) ? -1 : 1);
};

console.log("Dict of brand/products by price :");
console.log(brands);

// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort

// for (const [key, value] of Object.entries(brands)){
//   value.sort((a, b) => (new Date(a.date) > new Date(b.date)) ? 1 : -1);
// };

// console.log("Dict of brand/products by date");
// console.log(brands);


/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products

const percentile = (arr, q) => {
    const sorted = arr.sort((a, b) => a.price - b.price);
    return sorted[Math.round(q * (sorted.length - 1))];
  };

console.log("P90 price value of each brand :");
for (const [key, value] of Object.entries(brands)){ //key:brand|value:list of its products
  console.log(percentile(value, .90).brand+" : "+percentile(value, .90).price);
};

/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
];

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.


console.log("New products :")
Date.prototype.minusDays = function(days) {
  this.setDate(this.getDate() - parseInt(days));
  return this;
};

COTELE_PARIS.forEach(function(product) {
  let productDate = new Date(product.released);
  let currentTime = new Date();
  var twoWeeksAgo = currentTime.minusDays(14);
  
  if (productDate > twoWeeksAgo) {
    console.log(product);
  }
});

// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€

const reasonablePrice = function(tab) {
  var b = true;
  tab.forEach(product => {
    if (product.price>100) { b = false; return b;} //If one product is higher than 100 => return
  });
  return b;
};

console.log("Is COTELE PARIS reasonable ?");
console.log(reasonablePrice(COTELE_PARIS));

// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product

console.log("Find product with specific uuid :");
COTELE_PARIS.forEach(product =>{
  if (product.uuid == "b56c6d88-749a-5b4c-b571-e5b5c6483131") {
    console.log(product);
    return;
  };
});

//or

var result = COTELE_PARIS.filter(product => {
  return product.uuid === "b56c6d88-749a-5b4c-b571-e5b5c6483131";
});
console.log(result);


// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product


var res = COTELE_PARIS.filter(function( product ) {
  return product.uuid !== "b56c6d88-749a-5b4c-b571-e5b5c6483131";
});
console.log("Delete product with specific uuid (COTELE_PARIS without this item) :");
console.log(res);

// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;
jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?

console.log("Both objects have now an attribute \"favorite\" set to true :");
console.log(blueJacket);
console.log(jacket);
//Both objects have now an attribute "favorite" set to true

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties

console.log("Change an object without changing the other one :");
// jacket = {...blueJacket, favorite:true};
//or
jacket = Object.assign({}, blueJacket, {favorite: true});
console.log(blueJacket);
console.log(jacket);



/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage

console.log("Save MY_FAVORITE_BRANDS to the localStorage :")
localStorage.setItem('MY_FAVORITE_BRANDS', JSON.stringify(MY_FAVORITE_BRANDS));
var MFB = localStorage.getItem('MY_FAVORITE_BRANDS');
console.log('retrievedObject: ', JSON.parse(MFB));