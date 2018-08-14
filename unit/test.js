const request = require('request');
const crypto = require('crypto');
const qs = require('qs')

let orderid = '6ce55f13-a74a-c3ed-333d-e83f7126473c'
const apiKey = "VfOfva1t297l6jRtjTcLcvvq";
const apiSecret = "NwPQBFnWiqMYb0EvMF6KYHB2SL3a4ZffsFctpTyDoR0nDluW";

let verb = 'GET',
    path = '/api/v1/orderBook/L2',
    expires = new Date().getTime() + (60 * 1000), // 1 min in the future
    data = {symbol:'TRX',deth:0};

let query = '', postBody = '';
if (verb === 'GET')
    query = '?' + qs.stringify(data);
else
    postBody = JSON.stringify(data);

let signature = crypto.createHmac('sha256', apiSecret).update(verb + path + query + String(expires) + postBody).digest('hex');

let headers = {
    'content-type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature
};

let $url = 'https://www.bitmex.com' + path
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