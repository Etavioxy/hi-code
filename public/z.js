var markdownit = window.markdownit()
  .use(texmath, {engine: katex, delimiters: 'dollars'});

var markdownitVue = (vue) => {
  vue.component('markdownit',{
    props:{
      text:{type:String,default:''}
    },
    computed:{
      html(){
        return markdownit.render(this.text);
      }
    },
    template:"<div v-html='html'></div>"
  })
};

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

const app = Vue.createApp({
  data(){
    return {
      data: {
        'hi-code':[
          {name:'code', text:{code:''}}
        ]
      }
    };
  },
  mounted(){
    fetch('code')
    .then((res)=>res.text())
    .then((txt)=>{
      let data = JSON.parse(txt);
      for (let [genre, code] of Object.entries(data)) {
        for (let x of code) {
          x.text = parseCode(x.text);
        }
      }
      this.data = data;
    }).then(()=>{
      // 从 URL 中获取 # 标记
      let hash = location.hash;
      // 去掉 # 号，得到 id 参数
      let id = hash.slice(1);
      // 根据 id 参数，获取对应的元素
      let element = document.getElementById(id);
      // 如果元素存在，滚动到该元素
      if (element) {
        element.scrollIntoView();
      }
    });
  }
})
.use(hljsVuePlugin)
.use(markdownitVue)
.mount('#app')
