// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentFilters = {brand:"all", reasonable: false, recent:false, sort:"null"};
let favoriteProducts = [];
let allProducts

// selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectReasonable = document.querySelector('#reasonable-check');
const selectRecent = document.querySelector('#recent-check');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbDisplayedProducts = document.querySelector('#nbDisplayedProducts');
const p50 = document.querySelector('#p50');
const p90 = document.querySelector('#p90');
const p95 = document.querySelector('#p95');
var fav = document.querySelectorAll('.fav-check');
var lastRelease = document.querySelector('#last-release');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      // `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
      `http://localhost:8092/products/search?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/*
 Small functions
*/
//Subtract 14 days to th actual date and return it
Date.prototype.minusDays = function(days) {
  this.setDate(this.getDate() - parseInt(days));
  return this;
};
//Calcultate x percentile (price) of a list
const percentile = (arr, q) => {
  var k = Object.assign([], arr);
  const sorted = k.sort((a, b) => a.price - b.price);
  return sorted[Math.round(q * (sorted.length - 1))];
};

//Return the product matching by uuid in list of products
const findProductByUuid = (products, id) => {
  return products.find(x => x.uuid == id);
};

/*
 Apply filters on products
*/
const applyfilter = (products, filters) => {
  
  var afterproducts = Object.assign([], products);
  
  //Brand filter
  if ((filters.brand!='all')&&(filters.brand!=undefined)){
    var afterproducts = products.filter(k => k.brand===filters.brand);
  };

  //Recent filter
  if ((filters.recent==true)){
    var a = [];
    afterproducts.forEach(function(product) {
      let productDate = new Date(product.released);
      let currentTime = new Date();
      var twoWeeksAgo = currentTime.minusDays(14);
      if (productDate > twoWeeksAgo) { a.push(product); }
    })
    afterproducts = a;
  };

  //Reasonable prices
  if(filters.reasonable==true){
    var afterproducts = products.filter(k => k.price<50);
  }

  //Sort filter
  if ((filters.sort!='null')&&(filters.sort!=undefined)){
    if (filters.sort=="price-asc"){ afterproducts.sort((a, b) => (a.price > b.price) ? 1 : -1)} //lowest highest
    else if (filters.sort=="price-desc") {afterproducts.sort((a, b) => (a.price > b.price) ? -1 : 1)}
    else if (filters.sort=="date-asc") {afterproducts.sort((a, b) => (new Date(a.released) > new Date(b.released)) ? -1 : 1)}
    else if (filters.sort=="date-desc") {afterproducts.sort((a, b) => (new Date(a.released) > new Date(b.released)) ? 1 : -1)}
  };
  return afterproducts;
};



/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = (products, filters) => {
  //Applaying filters
  var afterproducts = applyfilter(products, filters);

  //Create products section
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = "product-item";
  var template = afterproducts
    .map(product => {
      //Add https when missing
      if (product.photo.includes("http") == false) {
        product.photo = "https:"+product.photo;
      }
      //Create html
      return `
      <div class="product" id=${product.uuid} alt=${product.brand}>
      <img class="product-img" id=${product.uuid} src=${product.photo}>
        <div class="product-desc">
          <span class="product-brand">${product.brand}</span>
          <a href="${product.link}"  class="product-name">${product.name}</a>
          <span  class="product-price">${product.price}</span>
          <label class="heart-label"><input type="checkbox" class="fav-check" value=${product.uuid}>❤</label>
        </div>
      </div>
    `;
    })
    .join('');

  //If no product
  if (afterproducts.length==0){
    template = `<div class="noproduct">
                  <p>Il n'y a pas de produits correspondant à votre rechrche sur cette page :(<br>Rendez-vous à la page suivante !</p>
                </div>`;
  }
  
  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '';
  sectionProducts.appendChild(fragment);

  //Set all favorite products to red
  var a = document.getElementById("products").querySelectorAll('.fav-check').forEach(item => {
    if (favoriteProducts.filter(p => p.uuid == item.value).length > 0) { //if in favoriteProducts => heart is red, checkbox is checked
      item.parentElement.style.color="rgb(201, 96, 47)";
      item.checked = true;
    };
  });

  //Add event listener on fav's checkboxes
  var k = document.getElementById("nbfavtext");
  fav = document.getElementById("products").querySelectorAll('.fav-check').forEach(item => {
    item.addEventListener("click", event => {
      var p = findProductByUuid(currentProducts,event.target.value);
      if (event.target.checked) {
        favoriteProducts.push(p);
        item.parentElement.style.color="rgb(201, 96, 47)";
        k.innerText = favoriteProducts.length;
      }
      else {
        favoriteProducts = favoriteProducts.filter(k => k.uuid != event.target.value);
        item.parentElement.style.color="black";
        k.innerText = favoriteProducts.length;
      }
    });
  });

};

/**
 * Render Page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render Indicators Page selector
 * @param  {Object} products
 * @param  {Object} pagination
 */
const renderIndicatorsPagination = (pagination) => {
  // console.log(pagination);
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
};

/**
 * Render Indicators Products selector
 * @param  {Object} products 
 * @param  {Object} filters
 */
const renderIndicatorsProducts = (products, filters) => {
  var productscopy = Object.assign([], products);
  var p = applyfilter(productscopy, filters);
  spanNbDisplayedProducts.innerHTML = p.length;  
  p50.innerHTML = percentile(productscopy,0.5).price;
  p90.innerHTML = percentile(productscopy,0.9).price;
  p95.innerHTML = percentile(productscopy,0.95).price;
  lastRelease.innerHTML = productscopy.sort((a, b) => (new Date(a.released) > new Date(b.released)) ? -1 : 1)[0].released;
};

const render = (products, pagination, filters) => {
  var p = Object.assign({}, pagination)
  renderPagination(pagination);
  renderIndicatorsPagination(pagination);
  renderIndicatorsProducts(products, filters);
  renderProducts(products, filters);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination, currentFilters));
});

//Select the page to display
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination, currentFilters));
});

//Select the brand to display
selectBrand.addEventListener('change', event => {
  currentFilters.brand = event.target.value;
  fetchProducts(currentPagination.currentPage, selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination, currentFilters));
});

//Select the recent products
selectRecent.addEventListener('change', event => {
  if(event.target.checked) {
    currentFilters.recent=true;
  } else {
    currentFilters.recent=false;
  };
  fetchProducts(currentPagination.currentPage, selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination, currentFilters));
});

//Select the reasonable price
selectReasonable.addEventListener('change', event => {
  if(event.target.checked) {
    currentFilters.reasonable=true;
  } else {
    currentFilters.reasonable=false;
  };
  fetchProducts(currentPagination.currentPage, selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination, currentFilters));
});

//Select the brand to display
selectSort.addEventListener('change', event => {
  currentFilters.sort = event.target.value;
  fetchProducts(currentPagination.currentPage, selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination, currentFilters));
});


//Display page
document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination, currentFilters))
);












// products.forEach((el) => {console.log(el.price);})
  // p50.innerHTML = percentile(products, .50).price;
  // p90.innerHTML = percentile(products, .90).price;
  // p95.innerHTML = percentile(products, .95).price;









  /**
   * Animations
   */

//NAVBAR

  const navbar = document.querySelector(".navbar");
  const menu = document.querySelector(".menu-list");
  const cancelBtn = document.querySelector(".cancel-btn");
  const menuBtn = document.querySelector(".menu-btn");

  menuBtn.onclick = () => {
      menu.classList.add("active")
      menuBtn.classList.add("hide")
  }

  cancelBtn.onclick = () => {
      menu.classList.remove("active")
      menuBtn.classList.remove("hide")
  }

  window.onscroll = () => {
      var logo = document.getElementById("navbar-logo");
      this.scrollY > 20 ? navbar.classList.add("sticky") : navbar.classList.remove("sticky");
      this.scrollY > 20 ? logo.style.display = "none" : logo.style.display = "block";
  }
