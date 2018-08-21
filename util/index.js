const request = require('request');
const crypto = require('crypto');
const qs = require('qs')
const cfg = require('../config')
const g = require('../global')
var test_count = 0
var test_Arr = [0, 7, 1]
const TRADE_DEBUG = true //不交易 ，测试时候用，
module.exports = {
    //获取订单的状态
    getOrderState: async function (apiKey, apiSecret, data) {
        let self = this
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
                    if (self.isString(body)) body = JSON.parse(body)
                    resolve(body);
                }
            });
        })
    },

    //创建订单
    createOrder: async function (apiKey, apiSecret, data) {
        let self = this
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
                    if (self.isString(body)) body = JSON.parse(body)
                    resolve(body);
                }
            });
        })
    },
    //获取接口数据
    getHandOrder: async function (data_order, $self) {
        let self = $self ? $self : this
        return new Promise((resolve, reject) => {
            let headers = {
                'X-TOKEN': '4feaf6d8937eeba020339d9618830e6bIlMSCpP9aLDBkkHAMVRbCFfr7hPWeysFgdGJ7Zrbj7aOEq3W4NkKUmEou7yf3Bh8qBIT',
                'X-SIGN': '0AE62D23CC94AA91BFA02BB92D0454C7',
                'X-TS': 1534254436,
                'X-APPID': 'toBPJhUqos'
            };
            const requestOptions = {
                headers: headers,
                url: 'https://api.xkt.one/api/v1/analyst/getAnalystTradeList?analyst_id=100003&page=1&page_size=20',
                method: 'GET',
            };
            request(requestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (self.isString(body)) body = JSON.parse(body)
                    if (body['data'] && body['data']['data_list']) {
                        body = body['data']['data_list']
                    } else {
                        resolve(body);
                        return
                    }
                    resolve(body);
                    body = body[test_Arr[test_count]]
                    if (test_count > 2) return
                    if (!g.feedid[data_order.apikey]) {
                        g.feedid[data_order.apikey] = body.feed_id
                    }
                    console.log('g.feedid[apikey]', g.feedid[data_order.apikey])
                    console.log('body.feedid', body.feed_id)
                    if (true) {
                        // if (body.feed_id > g.feedid[data_order.apikey]) {
                        g.feedid[data_order.apikey] = body.feed_id
                        if (body.order.is_close === 1) {
                            data_order.execInst = 'Close'
                            delete data_order.side
                            delete data_order.orderQty
                        } else if (body.order.is_close === 0) {
                            delete data_order.execInst
                            data_order.orderQty = 1
                            if (body.order.trade_qty.includes('+')) {
                                data_order.side = 'Buy'
                            } else {
                                data_order.side = 'Sell'
                            }
                        }
                        console.log('new order', data_order)
                        setTimeout(function () {
                            test_count++
                            self.onHandOrder(data_order)
                        }, 1000)
                    } else {
                        setTimeout(function () {
                            self.getHandOrder(data_order, self)
                        }, 5 * 60 * 1000)
                    }
                }
            });
        })
    },
    //处理订单
    //
    onHandOrder: async function (data_order) {
        let order = {}
        if (!TRADE_DEBUG) {
            order = await this.createOrder(data_order.apikey, data_order.apiSecret, data_order).then(res => {
                return res
            }, err => {
                console.log(err)
                return null
            })
        }
        if (order) {
            let orderid = order.orderID
            let data_sym = { symbol: data_order.symbol };
            let $state = await this.getOrderState(data_order.apikey, data_order.apiSecret, data_sym).then(res => {
                if(TRADE_DEBUG){
                    return res[0].ordStatus
                }else{
                    for (let i in res) {
                        let order = res[i]
                        if (order.orderID === orderid) {
                            return order.ordStatus
                        }
                    }
                }
                return null
            }, err => {
                return null
            })
            let hand = await this.getHandOrder(data_order).then(res => {
                return res
            }, err => {
                return null
            })
            return { ok: 1, state: $state, h: hand }
        } else {
            return { ok: 0 }
        }
    },
    //判断是否为字符串
    isString: function (source) {
        return '[object String]' == Object.prototype.toString.call(source);
    },

}