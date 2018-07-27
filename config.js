const CONF = {
    development: {
        port:3000,
        server_path:'https://www.bitmex.com'
    },
    production: {
        port:3000,
        server_path:'https://www.bitmex.com'
    }
}

let config
if (process.env.NODE_ENV === 'development') {
  config = CONF.development
} else if (process.env.NODE_ENV == 'production') {
    config = CONF.production
} else{
    config = CONF.production
}
module.exports = config;