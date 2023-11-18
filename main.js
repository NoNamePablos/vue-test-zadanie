/*https://stackoverflow.com/questions/10883211/why-does-my-http-localhost-cors-origin-not-work*/

const API_ENDPOINT="https://skylord.ru/test";

const STATUS={
    0:'Не проверено',
    1:'Редактируется',
    2:'Готово'
}

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
                console.log("response: ",data);
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

const VBadge={
    name:'VBadge',
    template:`
        <div class="badge" :class="classIntent">
        {{text}}
        </div> 
    `,
    props:{
      text:{
          type:String,
          required:false,
      },
      intent:{
          type:String,
          required:false,
          default:'default'
      }
    },
    computed:{
        classIntent(){
            return `badge-${this.intent}`;
        }
    }
}

const VInput={
    name:"VInput",
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

const VButton={
    name:"VButton",
    template:`
    <button class="button" :class="classIntent" >
      <slot></slot>
    </button>
    `,
    props:{
        intent:{
            type:String,
            required:false,
            default: 'default'
        }
    },
    computed:{
        classIntent(){
            return `button-${this.intent}`;
        }
    }
}

const VDefaultLayout={
    name:'VDefaultLayout',
    template:`
       <div class="container">
        <router-view v-slot="{Component}">
            <template v-if="Component">
        
                 <Suspense>
                    <component :is="Component"></component>
                        <template #fallback>
                            Loading...
                        </template>
                 </Suspense>
        
            </template>
        </router-view>
       </div>  
    `
}

const VForm={
    name:"VForm",
    template: `
        <form class="form">
           <slot/>
        </form>   
    `
}




const PostItem={
    template:`
       <div class="post-item">
           <div class="post-item__body">
                <div class="post-item__title" @click="redirectPage">{{item?.title}}</div>
                <VForm @submit.prevent="submit" v-if="isEditing">
                    <VInput v-model="postItem.title" placeholder="Title" label="Title"  />
                    <div class="form-controls">
                           <div class="form-controls__title">Управление</div>
                           <VButton :intent="'primary'">Обновить</VButton>
                           <VButton intent="error" @click="handleEdit">Отменить</VButton>        
                    </div>
                </VForm>
            </div>
           <div class="post-item__controls">
               <VButton :intent="'success'" @click="handleEdit">Редактировать</VButton>
               <VButton intent="error" @click="deletePost">Удалить</VButton>
           </div>
       </div>
    `,
    data(){
        return {
            isEditing:false,
            itemId:-1,
            postItem:{
                title:this.item.title
            }
        }
    },
    mounted() {
      this.itemId=this.item.id;
    },
    props:{
        item:{
            type:Object,
            required:true,
        }
    },
    methods:{
        handleEdit(){
            this.isEditing=!this.isEditing;
        },
        submit(){
            if(this.postItem.title!==""){
                usePosts().updatePostById(this.itemId,this.postItem)
                    .then(response=>{
                        this.$emit('update',response.id)
                        this.handleEdit()
                    })
            }
        },
        deletePost(){
            this.$emit('delete',this.itemId);
        },
        redirectPage(){
            this.$router.push(`/${this.itemId}`);
        }
    }
}

const Home={
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
        PostItem,
    },
    template:`
        <VForm @submit.prevent="submit()">
           <VInput v-model="postForm.title" placeholder="Title" label="Title"  />
           <VInput v-model="postForm.text" placeholder="Text" label="Text"  />
               <VButton :intent="'primary'">Добавить</VButton>
        </VForm>
       <div class="post-list">
            <div class="post-list__title">Список постов</div>
            <div class="post-list__cards">
                <PostItem :item="post" @delete="deletePost" @update="updatePosts" v-for="post in posts" :key="post.id" />
            </div>
        </div>
       
`,
    mounted() {
        this.fetchPosts();
    },
    methods: {
        async deletePost(id){
            usePosts().deletePostById(id)
                .then(response=>this.fetchPosts())
        },
        async updatePosts(id){
            usePosts().fetchPosts().then((response)=>{
                this.posts=response;
            })
        },
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
}
const Detail={
    template:`
        <div class="detail">
            <router-link class="button-link"  to="/" >Назад</router-link>
            <div class="detail__title">Пост №{{pageID}}</div>
            <div class="detail-body">
                <VBadge :text="itemStatus" :intent="item.status"  />
                <div class="detail-prop">
                    <div class="detail-prop__title">Название:</div>
                    <div class="detail-prop__value">{{item.title}}</div>
                </div>
                <div class="detail-prop">
                    <div class="detail-prop__title">Описание:</div>
                    <div class="detail-prop__value">{{itemDescription}}</div>
                </div>
           </div>
       </div> 
    `,
    data(){
        return{
            pageID:this.$route.params.id,
            item: {},
            loading:true,
        }
    },
    created(){
        this.fetchPost();
    },
    watch:{

    },
    computed: {
      badgeColor(){

      },
      itemDescription(){
          return this.item.text!==""?this.item.text:'Описание не заполнено'
      },
        itemStatus(){
            if(!this.loading){
                return  STATUS[this.item.status];
            }
        }
    },
    methods:{
        fetchPost(){
            usePosts().fetchPostsById(this.pageID)
                .then(response=>this.item=response)
                .finally(this.loading=false)
        }
    }


}

var app =  Vue.createApp({})

const routes = [
    { path: '/', component: Home },
    { path: '/:id', component: Detail },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})
const UI_ELEMENTS=[VInput,VButton,VDefaultLayout,VForm,VBadge];
UI_ELEMENTS.forEach((el)=>{
    app.component(el.name,el);
})
app.use(router)
app.mount('#app')