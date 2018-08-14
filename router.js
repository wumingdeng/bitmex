const router = require('koa-router')()
const util = require('./util')

router.post('/test', async (ctx, next) => {
    let $apikey = 'VfOfva1t297l6jRtjTcLcvvq'
    let $apiSecret = 'NwPQBFnWiqMYb0EvMF6KYHB2SL3a4ZffsFctpTyDoR0nDluW'
    let $symbol = 'TRXU18'
    let $orderQty = 1
    let $ordType = 'Market'
    let $side = 'Buy'
    let data_order = { symbol: $symbol, side: $side, orderQty: $orderQty, ordType: $ordType, apikey: $apikey, apiSecret: $apiSecret };
    let result = await util.onHandOrder(data_order)
    ctx.body = result
})

module.exports = router