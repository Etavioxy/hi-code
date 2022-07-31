const fs = require('fs')
const url = require('url')
const http = require('http')

function readCode(){
  a = fs.readdirSync("assets/'").map(item => ({name:item, text:fs.readFileSync("assets/'/" + item).toString('utf-8')}))
  return JSON.stringify(a)
}

const server = http.createServer((req, res) => {
  console.log('connect')
  let pathname = url.parse(req.url).pathname

  console.log('pathname: ', pathname)

  if( pathname === '/code' ){
    res.end(readCode())
    return ;
  }

  if( pathname.indexOf('.') === -1 ) pathname += 'index.html';

  fs.readFile('src'+pathname, (err, data) => {
    if(err){
      console.log(err.message)
      res.end('404')
      return ;
    }
    res.end(data)
  })

})

console.log('listen on 8080')

server.listen(8080, '127.0.0.1')
