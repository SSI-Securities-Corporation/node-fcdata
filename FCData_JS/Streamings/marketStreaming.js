
const signalr = require("signalr-client");


function addSlash(str) {
    return str.substr(-1) !== "/" ? (str + "/") : str
}

var api = {
    SIGNALR: "signalr"
}

function resoleURL(baseURL, query) {
    return addSlash(baseURL) + query;
}

var client = {};

/**
 * Init client stream order
 * @param {{url: string, consumer_id:string,consumer_secret:string}} options
 */
exports.initStream = function (options) {
    var url = resoleURL(options.url, api.SIGNALR);
    client = new signalr.client(
        url,
        ["FcMarketDataV2Hub"],
        10,
        true
    );

    client._eventsListener = [];
    client.headers['Authorization'] = options.token;

    client.on("FcMarketDataV2Hub", "Broadcast", function (message) {
        console.log(message);
    });

    client.on("FcMarketDataV2Hub", "Reconnected", function (message) {
        console.log("Reconnected" + message);
    });

    client.on("FcMarketDataV2Hub", "Disconnected", function (message) {
        console.log("Disconnected" + message);
    });

    client.on("FcMarketDataV2Hub", "Error", function (message) {
        console.log(message);
    });
}
exports.streamClient = client;

/**
 * Start listen stream from server.
 */
exports.start = function start() {
    client.start();
    return client;
}

