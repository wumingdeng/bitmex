const request = require('request');
const crypto = require('crypto');
const qs = require('qs')

let orderid = '6ce55f13-a74a-c3ed-333d-e83f7126473c'
// const apiKey = "BPNRYXoKeispmoyg_kIA5Wky";
// const apiSecret = "M0gSC9Y4Wucv98UDbgAw2yQWzN2-uKr9D--h3WlWFk9ULitW";
const apiKey = "VfOfva1t297l6jRtjTcLcvvq";
const apiSecret = "NwPQBFnWiqMYb0EvMF6KYHB2SL3a4ZffsFctpTyDoR0nDluW";

let verb = 'GET',
    path = '/api/v1/orderBook/L2',
    expires = new Date().getTime() + (60 * 1000), // 1 min in the future
    // 'ordType': "Limit", // String | Order type. Valid options: Market, Limit, Stop, StopLimit, MarketIfTouched, LimitIfTouched, MarketWithLeftOverAsLimit, Pegged. Defaults to 'Limit' when `price` is specified. Defaults to 'Stop' when `stopPx` is specified. Defaults to 'StopLimit' when `price` and `stopPx` are specified.
    // data = {symbol:'EOSU18', side: "Buy",orderQty:'1',price:'0.0000089',ordType:'Limit'};
    data = {symbol:'XBT', depth: "Buy",orderQty:'1',price:'0.0000089',ordType:'Limit'};

let query = '', postBody = '';
if (verb === 'GET')
    query = '?' + qs.stringify(data);
else
    // Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
    // and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
    postBody = JSON.stringify(data);

let signature = crypto.createHmac('sha256', apiSecret).update(verb + path + query + String(expires) + postBody).digest('hex');

let headers = {
    'content-type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
    // https://www.bitmex.com/app/apiKeysUsage for more details.
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
};

let $url = 'https://www.bitmex.com' + path
// let $url = 'https://testnet.bitmex.com' + path
const requestOptions = {
    headers: headers,
    url: $url,
    method: verb,
};

if (verb === 'POST') {
    requestOptions.body = postBody
} else {
    requestOptions.url = $url + query
}

request(requestOptions, function (error, response, body) {
    if (error) { console.log(error); }
    console.log(body);
});