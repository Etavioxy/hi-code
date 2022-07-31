//import Vue from 'vue';
//import hljs from 'highlight.js';

async function loadData(){
  let res = await fetch('code')
  let code = await res.json()
  let app = document.getElementById('app')
  code.forEach(item => {
    let h = document.createElement('h3')
    let code = document.createElement('code')
    h.innerHTML = item.name
    code.innerHTML = item.text
    app.appendChild(h)
    app.appendChild(code)
  })
}

loadData()

/*
const app = Vue.createApp({

});
*/