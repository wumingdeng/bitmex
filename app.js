"use strict";

const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')

const log4js = require('koa-log4')
let logger_app = log4js.getLogger('app')
let logger_http = log4js.getLogger('http')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(log4js.koaLogger(log4js.getLogger("http"), { level: 'auto' }))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  logger_http.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//CORS 跨域
const whiteList = ['127.0.0.1']
app.use(async (ctx, next) => {
  // if (ctx.request.header.origin !== ctx.origin && whiteList.includes(ctx.request.header.origin)) {
  ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
  ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Max-Age', 3600 * 24);
  await next();
});

// routes
// 引入路由分发
const router = require('./router')
app.use(router.routes())

// error-handling
app.on('error', (err, ctx) => {
  console.log(err)
  logger_app.error('server error', err, ctx)
});

process.on('uncaughtException', function (err) {
  console.log('uncaughtException', err);
  logger_app.error('uncaughtException', err)
});


process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
  logger_app.error('unhandledRejection', error)
});



module.exports = app
