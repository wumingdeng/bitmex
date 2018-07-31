const request = require('request');
const crypto = require('crypto');
const qs = require('qs')
const cfg = require('../config')

module.exports = {
    getOrderState: async function (apiKey, apiSecret, data) {
        return new Promise((resolve, reject) => {
            let verb = 'GET',
                path = '/api/v1/order',
                expires = new Date().getTime() + (60 * 1000); // 1 min in the future

            let query = '?' + qs.stringify(data);
            let signature = crypto.createHmac('sha256', apiSecret).update(verb + path + query + String(expires)).digest('hex');
            let headers = {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signature
            };

            let $url = cfg.server_path + path + query
            const requestOptions = {
                headers: headers,
                url: $url,
                method: verb,
            };

            request(requestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (util.isString(body)) body = JSON.parse(body)
                    resolve(body);
                }
            });
        })
    },
    createOrder: async function (apiKey, apiSecret, data) {
        return new Promise((resolve, reject) => {
            let verb = 'POST',
                path = '/api/v1/order',
                expires = new Date().getTime() + (60 * 1000), // 1 min in the future
                postBody = JSON.stringify(data);

            let signature = crypto.createHmac('sha256', apiSecret).update(verb + path + String(expires) + postBody).digest('hex');
            let headers = {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'api-expires': expires,
                'api-key': apiKey,
                'api-signature': signature
            };

            let $url = cfg.server_path + path
            const requestOptions = {
                headers: headers,
                url: $url,
                method: verb,
                body: postBody
            };

            request(requestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (util.isString(body)) body = JSON.parse(body)

                    resolve(body);
                }
            });
        })
    },
    getHandOrder: async function () {
        return new Promise((resolve, reject) => {
            let headers = {
                'X-TOKEN': 'f774c8b8d287a0ef55e052801dba7936QYa6QrxM1l+jNFmPTEq/wc34J12lqEZkYhUzPLpC0R8i14R6LPzIc1qxctW/2WAnAg0s',
                'X-SIGN': '4B0AD231352D02CD16163531702855BE',
                'X-TS': 1533021904,
                'X-APPID': 'toBPJhUqos'
            };
            const requestOptions = {
                headers: headers,
                url: 'https://xkt.sftui.com/api/v1/feedTrade/getTradeList?page=1&page_size=1',
                method: 'GET',
            };
            request(requestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (util.isString(body)) body = JSON.parse(body)
                    body = body['data']['data_list'][0]
                    resolve(body);
                }
            });
        })
    },
    //判断是否为字符串
    isString: function (source) {
        return '[object String]' == Object.prototype.toString.call(source);
    },
}