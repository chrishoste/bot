const request = require('request');
const { Webhook } = require('discord-webhook-node');

const message = []

const hook = new Webhook("HERE WEBHOOCK LINK");

const link = "https://www.nvidia.com/de-de/shop/geforce/?page=1&limit=9&locale=de-de&manufacturer=NVIDIA&manufacturer_filter=NVIDIA~5,ACER~42,ASUS~59,DELL~34,EVGA~16,GAINWARD~6,GIGABYTE~36,HP~65,LENOVO~11,MSI~45,PNY~6,RAZER~14,ZOTAC~8";

request('https://api.nvidia.partners/edge/product/search?page=1&limit=9&locale=de-de&manufacturer=NVIDIA&manufacturer_filter=NVIDIA~5,ACER~42,ASUS~59,DELL~34,EVGA~16,GAINWARD~6,GIGABYTE~36,HP~65,LENOVO~11,MSI~45,PNY~6,RAZER~14,ZOTAC~8', (error, response, body) => {
  if (!error && response.statusCode == 200) {

    const data = JSON.parse(body)

    var isAvailible = false;
    const products = [];

    const featuredProduct = {
      displayName: data.searchedProducts.featuredProduct.displayName,
      productTitle: data.searchedProducts.featuredProduct.productTitle,
      prdStatus: data.searchedProducts.featuredProduct.prdStatus,
      retailers: data.searchedProducts.featuredProduct.retailers
    }

    products.push(featuredProduct);

    data.searchedProducts.productDetails.forEach(function (item) {

      const itemTemp = {
        displayName: item.displayName.replace('Ti','').trim(),
        productTitle: item.productTitle,
        prdStatus: item.prdStatus,
        retailers: item.retailers
      }

      products.push(itemTemp);
    });

    products.forEach((item) => {
      if (item.prdStatus != "out_of_stock") {
        isAvailible = true
      } else {
        console.log(item.displayName + " " + item.prdStatus);
      }
    });

    console.log(Date())

    if (isAvailible) {
      var names = products.map(function(item) {
        return item['displayName'] + " --- " + item['prdStatus'] + "\n";
      });
      sendDiscord(names.toString())
    }
  }
});

function sendDiscord(message) {
  hook.info('**NVIDIA RESTOCK**', message, link);
}