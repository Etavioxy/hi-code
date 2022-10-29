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
      this.data = JSON.parse(txt);
    });
  }
})
.use(hljsVuePlugin)
.use(markdownitVue)
.mount('#app')
