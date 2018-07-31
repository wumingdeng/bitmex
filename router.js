const router = require('koa-router')()
const util = require('./util')

router.post('/test', async (ctx, next) => {
    let apikey = 'VfOfva1t297l6jRtjTcLcvvq'
    let apiSecret = 'NwPQBFnWiqMYb0EvMF6KYHB2SL3a4ZffsFctpTyDoR0nDluW'
    let $symbol = 'TRXU18'
    let data_order = { symbol: $symbol, side: "Sell",orderQty:1, ordType: 'Market' };
    let order = await util.createOrder(apikey, apiSecret, data_order).then(res => {
        return res
    }, err => {
        return null
    })
    if(order){
        let orderid = order.orderID
        console.log('orderid',orderid)
        let data_sym = { symbol: $symbol};
        let $state = await util.getOrderState(apikey, apiSecret, data_sym).then(res => {
            for(let i in res){
                let order = res[i]
                if(order.orderID === orderid){
                    return order.ordStatus
                }
            }
            return null
        }, err => {
            return null
        })
        let hand = await util.getHandOrder().then(res => {
            return res
        }, err => {
            return null
        })
        ctx.body = {ok:1,state:$state,h:hand}
    }else{
        ctx.body = {ok:0}
    }
})

module.exports = router
