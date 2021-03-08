const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parseproducts = data => {
  const $ = cheerio.load(data);

  return $('.product-container')
    .map((i, element) => {
      // console.log(element);
      const name = $(element)
        .find('.product-name')
        .attr('title');
      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );
      const photo = $(element)
        .find('.product_img_link')
        .attr('href');
      const brand = 'adresse';
      const link = $(element)
      .find('.productList-link')
      .attr('href');
      return {name, price, photo, brand, link};
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
