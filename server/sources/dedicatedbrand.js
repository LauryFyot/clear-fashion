const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Array} pages to browse
 */
const parsepages = data => {
    const $ = cheerio.load(data);
    return $('.mainNavigation-link-subMenu-link a').map((i, element) => {
        var endURL = $(element).attr('href');
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

  return $('.productList-container .productList')
    .map((i, element) => {
      // console.log(element);
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      const photo = $(element)
        .find('.productList-image')
        .find('img')
        .attr('src');
      const brand = 'dedicated';
      const link = $(element)
      .find('.productList-link')
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
