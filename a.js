const fs = require('fs')
const url = require('url')
const http = require('http')
const process = require('process')
const path = require('path')

if( process.argv.length<=2 ){
  console.log('usage: node a.js [codedir] [--debug?]')
  process.exit(0x1);
}
let codeDir = process.argv[2];
let debugOn = process.argv[3] === "--debug"
codeDir.replace('~', process.env.HOME)

if( debugOn ){
  console.log('debugOn', debugOn)
  console.log('codeDir', codeDir)
}

function readCode(){
  let classifyFile = path.join(codeDir, '.classify.json');
  let a = {};
  try{
    fs.accessSync(classifyFile, fs.constants.R_OK);
    a = JSON.parse(fs.readFileSync(classifyFile));
  }catch(err){
    a = {'-*- code -*-': fs.readdirSync(codeDir)};
  }
  Object.keys(a).forEach(key => {
    a[key] = a[key].map(item => ({
      name: item,
      text: fs.readFileSync(path.join(codeDir,item)).toString('utf-8')
    }));
  });
  return JSON.stringify(a);
}

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname
  if( debugOn ){
    console.log('[debug] connect - pathname: ', pathname)
  }

  if( pathname === '/code' ){
    res.end(readCode())
    return ;
  }

  if( pathname === '/' ) pathname += 'index.html';

  pathname = 'public'+pathname;
  fs.readFile(pathname, (err, data) => {
    if(err){
      if( debugOn ){
        console.log('[debug]', err.message)
      }
      res.end('404')
      return ;
    }
    res.end(data)
  })

})

console.log('listen on http://0.0.0.0:8080')

server.listen(8080, '0.0.0.0')
