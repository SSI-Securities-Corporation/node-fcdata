
const signalr = require("./signalR");


function addSlash(str) {
    return str.substr(-1) !== "/" ? (str + "/") : str
}

var api = {
    GET_ACCESS_TOKEN: "api/v2/Market/AccessToken",
    GET_SECURITIES_LIST: "api/v2/Market/Securities",
    GET_SECURITIES_DETAILs: "api/v2/Market/SecuritiesDetails",
    GET_INDEX_COMPONENTS: "api/v2/Market/IndexComponents",
    GET_INDEX_LIST: "api/v2/Market/IndexList",
    GET_DAILY_OHLC: "api/v2/Market/DailyOhlc",
    GET_INTRADAY_OHLC: "api/v2/Market/IntradayOhlc",
    GET_DAILY_INDEX: "api/v2/Market/DailyIndex",
    GET_DAILY_STOCKPRICE: "api/v2/Market/DailyStockPrice",
    SIGNALR: "v2.0/signalr"
}

function resoleURL(baseURL, query) {
    return addSlash(baseURL) + query;
}
var constants = {
    AUTHORIZATION_HEADER: "Authorization",
    AUTHORIZATION_SCHEME: "Bearer"
}
var client = {};
var events = {
    onData: "onData",
    onError: "onError",
    onConnected: "onConnected",
    onReconnecting: "onReconnecting",
    onReconnected: "onReconnected"
}
exports.streamClient = client;
exports.api = api;
exports.constants = constants;

/**
 * Events streaming
 */
exports.events = events;
/**
 * Init client stream order
 * @param {{url: string, token: "Bearer <accessToken>"}} options
 */
exports.initStream = function (options) {
    var url = resoleURL(options.url, api.SIGNALR);
    client = new signalr.client(
        url,
        ["FcMarketDataV2Hub"],
        10,
        true
    );
    client.serviceHandlers.connected = function (connection) {
        if (client._eventsListener.hasOwnProperty(events.onConnected)) {
            client._eventsListener[events.onConnected]();
        }
    }
    client.serviceHandlers.reconnected = function (connection) {
        if (client._eventsListener.hasOwnProperty(events.onReconnected)) {
            client._eventsListener[events.onReconnected]();
        }
    }
    client.serviceHandlers.reconnecting = function (connection) {
        if (client._eventsListener.hasOwnProperty(events.onReconnecting)) {
            client._eventsListener[events.onReconnecting]();
        }
    }
    client._eventsListener = [];
    client.headers['Authorization'] = options.token;

    client.on("FcMarketDataV2Hub", "Broadcast", function (message) {
        if (client._eventsListener.hasOwnProperty(events.onData)) {
            client._eventsListener[events.onData](message);
        }
    });

    client.on("FcMarketDataV2Hub", "Reconnected", function (message) {
        console.log("Reconnected" + message);
    });

    client.on("FcMarketDataV2Hub", "Disconnected", function (message) {
        console.log("Disconnected" + message);
    });

    client.on("FcMarketDataV2Hub", "Error", function (message) {
        console.log(message);
        if (client._eventsListener.hasOwnProperty(events.onError)) {
            client._eventsListener[events.onError](events.onError, message);
        }
    });
}

/**
 * Start listen stream from server.
 */
exports.start = function start() {
    client.start();
    return client;
}
/**
 * Subcribe event from server
 * @param {string} event value of {@link exports.events}
 * @param {(data: {})=>void} func delegate
 */
exports.bind = function (event, func) {
    //eventsListener.on(event, func);
    client._eventsListener[event] = func;
}
/**
 * Un-Subcribe event from server
 * @param {string} event value of {@link exports.events}
 * @param {(data: {})=>void} func delegate
 */
exports.unbind = function (event, func) {
    //eventsListener.removeListener(event, func);
    delete client._eventsListener[event];
}
/**
 * Switch channel
 * @param {string} channel select channel to subcribe X:ALL, X-TRADE:ALL bla bla ....
 * 
 */
exports.switchChannel = function (channel) {
    //eventsListener.removeListener(event, func);
    client.invoke(
        'FcMarketDataV2Hub',
        'SwitchChannels',
        channel
      );
}