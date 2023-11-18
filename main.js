/*Vue.prototype.$axios=axios.create({
    baseURL:'https://skylord.ru/test',
});*/
/*https://stackoverflow.com/questions/10883211/why-does-my-http-localhost-cors-origin-not-work*/

const API_ENDPOINT="https://skylord.ru/test";

const usePosts=()=>{
    async function fetchPosts(){
        try{
            const response=await fetch(API_ENDPOINT);
            if(response.ok){
                const data=await response.json();
                return data;
            }else{
                throw  new Error("Custom Error");
            }
        }catch (e){
            console.log(e)
        }
    }
    async function createPost(item){
        console.log('CRETAE ITEN; ',item);
        try{
            const response=await fetch(`${API_ENDPOINT}/`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(item)
            })
            if(response.ok){
                const data=await  response.json();
                console.log("data",data);
                return data;
            }else{
                throw  new Error("Custom Error");
            }
        }catch (e){
            console.log(e)
        }
    }
    async function fetchPostsById(id){
        try{

             const response= await fetch(`${API_ENDPOINT}/${id}`)
            if(response.ok){
                const data=await response.json();
                console.log(data);
                return data;
            }else{
                throw  new Error("Custom Error");
            }
        }catch (e){
            console.log(e)
        }
    }
    async function deletePostById(id){
        try {
            const response=await fetch(`${API_ENDPOINT}/${id}`,{
                method:'DELETE'
            })
            if(response.ok){
                const data=await response.json();
                return data;
            }else {
                throw  new Error("Custom Error");
            }
        }catch (e){
            console.log(e);
        }
    }
    async function updatePostById(id,item){
        try {
            const response=await fetch(`${API_ENDPOINT}/${id}`,{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(item)
            })
            if(response.ok){
                const data=await response.json();
                return data;
            }else {
                throw  new Error("Custom Error");
            }
        }catch (e){
            console.log(e);
        }
    }
    return {fetchPosts,createPost,fetchPostsById,deletePostById,updatePostById}
}


const Input={
    template:`
        <div class="input" :class="{error:error}">
            <label>
                <div class="input-label">{{label}}</div>
                <input :type="tag" :placeholder="placeholder" class="" :value="modelValue" @input="handleInput" />
                <div class="input-error" v-if="error">
                    {{error}}
                </div>
            </label>        
        </div>
    `,
    methods: {
      handleInput(e){
          const value=e.target.value;
          this.$emit('update:modelValue',value);
      }
    },
    props:{
        label:{
            type:String,
            required:false,
        },
        placeholder:{
            type:String,
            required:false,
        },
        error:{
            type:String,
            required: false,
        },
        modelValue:{
            type:String,
            required:true,
        },
        tag:{
            type:String,
            required:false,
            default:'text'
        }
    }
}


const Form={
    template: `
       
    
    `
}

var app =  Vue.createApp({
    /*router: router,*/
    data() {
        return {
            posts:[],
            postForm:{
                title:"",
                text:"",
                status:1,
            }
        };
    },
    components:{
      Input,
    },
    template:`
       <form @submit.prevent="submit()" class="form">
           <Input v-model="postForm.title" placeholder="Title" label="Title"  />
           <Input v-model="postForm.text" placeholder="Text" label="Text"  />
           <button class="button button-primary" >Добавить</button>
           <div>{{postForm.title}}</div>
       </form>
       <div v-for="post in posts" :key="post.id">
        {{post.title}}
       </div>
       <div>{{posts}}</div>
`,
    mounted() {
        this.fetchPosts();
    },
    methods: {
       async fetchPosts(){
           usePosts().fetchPosts().then((response)=>{
               this.posts=response;
           })
       },
        async createPost(){
          usePosts().createPost(this.postForm)
              .then(response=>usePosts().fetchPostsById(response.id))
              .then(data=>this.posts=[...this.posts,data]);
        },
        submit(){
           this.createPost();
        }
    },
    //remove id 28
}).mount('#app');