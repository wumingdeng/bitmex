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
                    resolve(body);
                }
            });
        })
    },
    getHandOrder: async function () {
        return new Promise((resolve, reject) => {
            let headers = {
                'X-TOKEN': 'c5b8bc9a6afb715eb8bf4d443b595c8eEXbY34idZMo8wEGRwN+jKIG6eXPKp7ERa1vsHWaN3gAZrIzhbl7GRXkboNuY5RUbA1/Y',
                'X-SIGN': '7057B21E0501161AF2CB12C4FECC3F58',
                'X-TS': 1532617776,
                'X-APPID': 'toBPJhUqos'
            };
            const requestOptions = {
                headers: headers,
                url: 'https://xkt.sftui.com/api/v1/feedTrade/getTradeList?page=1&page_size=20',
                method: 'GET',
            };
            request(requestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
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