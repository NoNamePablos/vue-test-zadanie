/*Vue.prototype.$axios=axios.create({
    baseURL:'https://skylord.ru/test',
});*/
/*https://stackoverflow.com/questions/10883211/why-does-my-http-localhost-cors-origin-not-work*/
var app =  Vue.createApp({
    /*router: router,*/
    data() {
        return {
            posts:[]
        };
    },
    template:`<div>123</div>`,
    mounted() {
        this.fetchPosts(); // check auth on mount
    },
    methods: {
       async fetchPosts(){
           try {
               const response = await fetch('https://skylord.ru/test/', {
                   method: 'GET',
                    headers:{
                        Referer:'http://127.0.0.1:5500/',
                        'Access-Control-Allow-Origin':'*'
                    }
               })
               console.log(response);
         const result = await  response.json();
         console.log("res: ",result);
            //    return result;
           } catch (err) {
               console.log(err);
           }

       }
    },
}).mount('#app');