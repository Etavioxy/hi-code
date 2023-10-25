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
    });
  }
})
.use(hljsVuePlugin)
.use(markdownitVue)
.mount('#app')
