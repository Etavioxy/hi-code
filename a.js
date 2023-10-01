const fs = require('fs')
const url = require('url')
const http = require('http')
const process = require('process')
const path = require('path')

if( process.argv.length<=2 ){
  console.log('usage: node a.js [codedir]')
  process.exit(0x1);
}
let codeDir = process.argv[2];
codeDir.replace('~', process.env.HOME)

// from string to {code:'', comment:''}
// the comment in /* */ will be extracted to {comment}
function parseCode(s){
  s = s.trimRight();
  let match = Array.from(s.matchAll(/(\/\*)|(\*\/)/g));
  if( match.length<2 ) return {code:s};
  let [l,r] = match.slice(match.length-2, match.length).map(x=>x.index);
  if( s.length-2!=r ) return {code:s};
  return {
    code: s.substr(0, l-1),
    comment: s.substr(l+3, r-l-3)
  };
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
      text: parseCode(fs.readFileSync(path.join(codeDir,item)).toString('utf-8'))
    }));
  });
  return JSON.stringify(a);
}

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname
  console.log('connect - pathname: ', pathname)

  if( pathname === '/code' ){
    res.end(readCode())
    return ;
  }

  if( pathname === '/' ) pathname += 'index.html';

  pathname = 'public'+pathname;
  fs.readFile(pathname, (err, data) => {
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
