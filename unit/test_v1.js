const request = require('request');
let i = 0
let fun = {
    getHand: function ($self) {
        i++
        let self = $self?$self:this
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
            if (error) { console.log(error); } else {
                body = JSON.parse(body)
                console.log(body['data']['data_list'][0]);
                setTimeout(function(){
                    self.getHand(self)
                }, 5000)
            }
        });
    }
}

fun.getHand()