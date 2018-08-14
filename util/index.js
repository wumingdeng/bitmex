const request = require('request');
const crypto = require('crypto');
const qs = require('qs')
const cfg = require('../config')
const g = require('../global')
const test_count = 0
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
                'X-TOKEN': '0b7ced7f88d852c8c0f5dea70a3d748axqBNmuz28wfYe0zS1pT4b1fsXRDbRlYU9ZaHjl8/CbxMmCQkzkuBe3OJvV+b0kHzj8l3',
                'X-SIGN': 'F24D4CCFB6E989F8F2525CB89A1D66D4',
                'X-TS': 1533523833,
                'X-APPID': 'toBPJhUqos'
            };
            const requestOptions = {
                headers: headers,
                url: 'https://xkt.sftui.com/api/v1/feedTrade/getTradeList?page=1&page_size=3',
                method: 'GET',
            };
            request(requestOptions, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (self.isString(body)) body = JSON.parse(body)
                    if (body['data'] && body['data']['data_list']) {
                        body = body['data']['data_list'][test_count]
                    } else {
                        console.log(body)
                        resolve(body);
                        return
                    }
                    resolve(body);
                    if(test_count > 2) return
                    if (!g.feedid[data_order.apikey]) {
                        g.feedid[data_order.apikey] = body.feed_id
                    }
                    console.log('g.feedid[apikey]', g.feedid[data_order.apikey])
                    console.log('body.feedid', body.feed_id)
                    if (true) {
                    // if (body.feed_id > g.feedid[data_order.apikey]) {
                        g.feedid[data_order.apikey] = body.feed_id
                        if (body.order.is_close === '1') {
                            data_order.execInst = 'Close'
                            delete data_order.side
                            delete data_order.orderQty
                        } else if (body.order.is_close === '0') {
                            delete data_order.execInst 
                            data_order.orderQty = 1
                            if (body.order.trade_qty.include('+')) {
                                data_order.side = 'Buy'
                            } else {
                                data_order.side = 'Sell'
                            }
                        }
                        console.log('new order', data_order)
                        if(data_order.side === 'Buy'){
                            data_order.side = 'Sell'
                        }else{
                            data_order.side = 'Buy'
                        }
                        setTimeout(function(){
                            test_count++
                            self.onHandOrder(data_order)
                        },5000)
                    } else {
                        setTimeout(function () {
                            self.getHandOrder(data_order, self)
                        }, 5*60*1000)
                    }
                }
            });
        })
    },
    //处理订单
    //
    onHandOrder: async function (data_order) {
        // let order = await this.createOrder(data_order.apikey, data_order.apiSecret, data_order).then(res => {
        //     return res
        // }, err => {
        //     return null
        // })
        // if (order) {
        //     let orderid = order.orderID
            let data_sym = { symbol: data_order.symbol };
            let $state = await this.getOrderState(data_order.apikey, data_order.apiSecret, data_sym).then(res => {
                for (let i in res) {
                    let order = res[i]
                    // if (order.orderID === orderid) {
                        return order.ordStatus
                    // }
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
        // } else {
        //     return { ok: 0 }
        // }
    },
    //判断是否为字符串
    isString: function (source) {
        return '[object String]' == Object.prototype.toString.call(source);
    },

}