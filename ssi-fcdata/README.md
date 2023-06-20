[![Release package to registry.npmjs.org](https://github.com/SSI-Securities-Corporation/node-fcdata/actions/workflows/publish.yaml/badge.svg)](https://github.com/SSI-Securities-Corporation/node-fcdata/actions/workflows/publish.yaml)

# Installation
#### From npm (most stable)
``` javascript
npm install ssi-fcdata
```
#### Install behind proxy
```javascript
npm config set strict-ssl false
npm install --proxy http://<username>:<password>@<host>:<port> ssi-fcdata
```

# Sample usage
## Config
Get `ConsumerID` and `ConsumerSecret` from [iBoard](https://iboard.ssi.com.vn/support/api-service/management)
```javascript
//This is config for consumer have permission on all customer
var config = {
    ConsumerID: "",
    ConsumerSecret: "",

    URL: "https://fc-data.ssi.com.vn/",
    stream_url: "wss://fc-data.ssi.com.vn/",
};
```
## API
All api of FCData require header `Authorization: Bearer <accessToken>`. You need get accessToken, cache it ( expired in 8 hours) and use to [query data](#Query) or [streaming](#Streaming-Data)
#### Get accessToken
``` javascript
const client = require('ssi-fcdata')
const axios = require('axios')

const rq = axios.create({
    baseURL: config.URL,
    timeout: 5000
})

var access_token = "";

rq({
    url: client.api.GET_ACCESS_TOKEN,
    method: 'post',
    data: {
        consumerID: config.ConsumerID,
        consumerSecret: config.ConsumerSecret
    }
}).then(response => {
    if (response.data.status === 200) {
        access_token = response.data.data.accessToken;
        console.log(access_token)
    } else {
        console.log(response.data.message)
    }
}, reason => {
    console.log(reason);
})
```
#### Query
``` js
const client = require('ssi-fcdata')
const axios = require('axios')

const rq = axios.create({
    baseURL: config.URL,
    timeout: 5000
})
var request = {
    market: 'HOSE',
    pageIndex: 4,
    pageSize: 100
}
rq({
    url: client.api.GET_SECURITIES_LIST,
    method: 'get',
    headers: {
        [client.constants.AUTHORIZATION_HEADER]: client.constants.AUTHORIZATION_SCHEME + " " + access_token // <----- Get from accessToken
    },
    params: request
}).then(response => {
    console.log(JSON.stringify(response.data));
}).catch(error => {
    console.log(error);
})
```

## Streaming Data
Connect to server -> Connected -> Select channel to subcrible -> Receive data 
``` js
const client = require('ssi-fcdata')
client.initStream({
      url: config.stream_url,
      token: client.constants.AUTHORIZATION_SCHEME + " " + access_token,
    });
client.bind(client.events.onData, function(message){
    console.log(message)
})
client.bind(client.events.onConnected, function(){
    client.switchChannel("X-QUOTE:ALL")
})
client.start();
```


