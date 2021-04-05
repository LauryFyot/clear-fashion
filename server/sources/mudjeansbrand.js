const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} pages to browse
 */
const parsepages = data => {
    const $ = cheerio.load(data);
    return $('.header-nav-list').map((i, element) => {
        var endURL = $(element).find('.header-nav-link').attr('href');
        return {endURL};
    })
    .get();
};

/**
 * Return all the pages to scrape for a given brand shop
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrapepages = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parsepages(data);
  }

  console.error(status);

  return null;
};

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parseproducts = data => {
  const $ = cheerio.load(data);

  return $('.product-link')
    .map((i, element) => {
      const name = $(element)
        .find('.product-title')
        .find('a')
        .text();
      const price = $(element)
          .find('.product-price')
          .text();
      const photo = $(element)
        .find('.img')
        .find('img')
        .attr('src');
      const brand = 'mudjeans';
      const link = $(element)
      .find('.product-title')
      .find('a')
      .attr('href');
      const uuid = uuidv5(String(link), uuidv5.URL);
      return {uuid, name, price, photo, brand, link};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrapeproducts = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseproducts(data);
  }

  console.error(status);

  return null;
};
