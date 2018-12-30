const http2 = require('http2')
const https = require('https')
const fs = require('fs')

const Koa = require('koa')
const serve = require('koa-static')
const convert = require('koa-convert')
const serverpush = require('koa-server-push')

// Https options valid for both http/1.1 and http/2 server
const httpsOptions = {
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.cert')
}

// create and listen http/1.1 server with https
const appHttp1Port = 3001
const appHttp1 = new Koa()
appHttp1.use(convert(serve('./www')))
https
  .createServer(httpsOptions, appHttp1.callback())
  .listen(appHttp1Port, () => console.log(`HTTP/1.1 secured server listen on port ${appHttp1Port}`))

// Create and listen http/2 server with https and push
const appHttp2Port = 3002
const appHttp2 = new Koa()
appHttp2.use(serverpush()) // read push_manifest.json and add push headers
appHttp2.use(convert(serve('./www')))
http2
  .createSecureServer(httpsOptions, appHttp2.callback())
  .listen(appHttp2Port, () => console.log(`HTTP/2 secured server listen on port ${appHttp2Port}`))
