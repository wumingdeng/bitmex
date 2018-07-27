const request = require('request');

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
    if (error) { console.log(error); }
    console.log(body);
});