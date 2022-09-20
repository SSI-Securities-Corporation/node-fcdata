/** @START_CONFIG */
const rxjs = require('rxjs');
const express = require('express');
const config = require('./config.js');
const marketStreaming = require('./Streamings/marketStreaming');
const axios = require('axios');
const app = express();
const port = 3020;
/** @END_CONFIG */

app.get('/Securities', (req, res) => {
  let lookupRequest = {}
  lookupRequest.market = "HOSE";
  lookupRequest.pageIndex = 4;
  lookupRequest.pageSize = 100;

  axios.get(config.market.ApiUrl + "Securities?lookupRequest.market=" + lookupRequest.market
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

app.get('/SecuritiesDetails', (req, res) => {
  let lookupRequest = {}
  lookupRequest.market = "DER";
  lookupRequest.symbol = "";
  lookupRequest.pageIndex = 1;
  lookupRequest.pageSize = 1000;

  axios.get(config.market.ApiUrl + "SecuritiesDetails"
    + "?lookupRequest.market=" + lookupRequest.market
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize
    + "&lookupRequest.symbol=" + lookupRequest.symbol)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

app.get('/IndexComponents', (req, res) => {
  let lookupRequest = {}
  lookupRequest.indexCode = "";
  lookupRequest.pageIndex = 1;
  lookupRequest.pageSize = 1000;

  axios.get(config.market.ApiUrl + "IndexComponents"
    + "?lookupRequest.indexCode=" + lookupRequest.indexCode
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

app.get('/IndexList', (req, res) => {
  let lookupRequest = {}
  lookupRequest.exchange = "HOSE";
  lookupRequest.pageIndex = 1;
  lookupRequest.pageSize = 1000;

  axios.get(config.market.ApiUrl + "IndexList"
    + "?lookupRequest.exchange=" + lookupRequest.exchange
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

app.get('/DailyOhlc', (req, res) => {
  let lookupRequest = {}
  lookupRequest.symbol = "VN30F2112";
  lookupRequest.fromDate = "06/12/2021";
  lookupRequest.toDate = "16/12/2021";
  lookupRequest.pageIndex = 1;
  lookupRequest.pageSize = 1000;
  lookupRequest.ascending = true;

  axios.get(config.market.ApiUrl + "DailyOhlc"
    + "?lookupRequest.symbol=" + lookupRequest.symbol
    + "&lookupRequest.fromDate=" + lookupRequest.fromDate
    + "&lookupRequest.toDate=" + lookupRequest.toDate
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize
    + "&lookupRequest.ascending=" + lookupRequest.ascending)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

app.get('/IntradayOhlc', (req, res) => {
  let lookupRequest = {}
  lookupRequest.symbol = "VN30F1M";
  lookupRequest.fromDate = "15/11/2021";
  lookupRequest.toDate = "15/12/2021";
  lookupRequest.pageIndex = 1;
  lookupRequest.pageSize = 1000;
  lookupRequest.ascending = false;

  axios.get(config.market.ApiUrl + "IntradayOhlc"
    + "?lookupRequest.symbol=" + lookupRequest.symbol
    + "&lookupRequest.fromDate=" + lookupRequest.fromDate
    + "&lookupRequest.toDate=" + lookupRequest.toDate
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize
    + "&lookupRequest.ascending=" + lookupRequest.ascending)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

app.get('/DailyIndex', (req, res) => {
  let lookupRequest = {}
  lookupRequest.indexId = "HNX30";
  lookupRequest.fromDate = "27/01/2021";
  lookupRequest.toDate = "27/01/2021";
  lookupRequest.pageIndex = 1;
  lookupRequest.pageSize = 1000;
  lookupRequest.ascending = true;

  axios.get(config.market.ApiUrl + "DailyIndex"
    + "?lookupRequest.indexId=" + lookupRequest.indexId
    + "&lookupRequest.fromDate=" + lookupRequest.fromDate
    + "&lookupRequest.toDate=" + lookupRequest.toDate
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize
    + "&lookupRequest.ascending=" + lookupRequest.ascending)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

app.get('/DailyStockPrice', (req, res) => {
  let lookupRequest = {}
  lookupRequest.symbol = "VN30F1M";
  lookupRequest.market = "";
  lookupRequest.fromDate = "01/12/2021";
  lookupRequest.toDate = "04/12/2021";
  lookupRequest.pageIndex = 1;
  lookupRequest.pageSize = 1000;

  axios.get(config.market.ApiUrl + "DailyStockPrice"
    + "?lookupRequest.symbol=" + lookupRequest.symbol
    + "&lookupRequest.fromDate=" + lookupRequest.fromDate
    + "&lookupRequest.toDate=" + lookupRequest.toDate
    + "&lookupRequest.pageIndex=" + lookupRequest.pageIndex
    + "&lookupRequest.pageSize=" + lookupRequest.pageSize
    + "&lookupRequest.market=" + lookupRequest.market)
    .then(response => {
      res.send(JSON.parse(JSON.stringify(response.data)));
    }).catch(error => { console.log(error); });
});

const rq = axios.create({
  baseURL: config.market.ApiUrl,
  timeout: 5000
})

rq({
  url: config.market.ApiUrl + "AccessToken",
  method: 'post',
  data: {
    consumerID: config.market.id,
    consumerSecret: config.market.priKey,
  }
}).then(response => {
  if (response.data.status === 200) {
    let token = "Bearer " + response.data.data.accessToken;
    axios.interceptors.request.use(function (axios_config) {
      axios_config.headers.Authorization =  token;
      return axios_config;
    });

    marketStreaming.initStream({
      url: config.market.HubUrl,
      token: token,
    });

    var mkClient = marketStreaming.start();

    mkClient.serviceHandlers.connected = function (connection) {
      mkClient.invoke(
        'FcMarketDataV2Hub',
        'SwitchChannels',
        'X-QUOTE:ALL'
      );
    }

    mkClient.serviceHandlers.reconnecting = function (connection) {
      mkClient.invoke(
        'FcMarketDataV2Hub',
        'SwitchChannels',
        'X:ALL'
      );
    }
  } else {
    console.log(response.data.message)
  }

}, reason => {
  console.log(reason);
})

app.listen(port, 'localhost', () => console.log(`Example app listening on port ${port}!`));
