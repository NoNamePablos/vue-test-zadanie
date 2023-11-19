/*https://stackoverflow.com/questions/10883211/why-does-my-http-localhost-cors-origin-not-work*/

const API_ENDPOINT="https://skylord.ru/test";

const STATUS={
    0:'Не проверено',
    1:'Редактируется',
    2:'Готово',
    length:3
}

//hook со всеми crud операциями
const usePosts=()=>{

    async function fetchPosts(){
        try{
            const response=await fetch(API_ENDPOINT);
            if(!response.ok){
                throw  new Error("Fetch error");
                return;
            }
                const data=await response.json();
                return data;
        }catch (e){
            console.log(e)
        }
    }
    async function createPost(item){
        try{
            const response=await fetch(`${API_ENDPOINT}/`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(item)
            })
            if(!response.ok){
                throw  new Error("Create Post error");
                return;
            }
                const data=await  response.json();
                return data;

        }catch (e){
            console.log(e)
        }
    }
    async function fetchPostsById(id){
        try{

             const response= await fetch(`${API_ENDPOINT}/${id}`)
            if(!response.ok){
                throw  new Error("Fetch by id  error");
                return;
            }
                const data=await response.json();
                return data;
        }catch (e){
            console.log(e)
        }
    }
    async function deletePostById(id){
        try {
            const response=await fetch(`${API_ENDPOINT}/${id}`,{
                method:'DELETE'
            })
            if(!response.ok){
                throw  new Error("Delete post error");
                return;
            }
                const data=await response.json();
                return data;

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
            if(!response.ok){
                throw  new Error("Update post error");
                return;
            }
                const data=await response.json();
                return data;

        }catch (e){
            console.log(e);
        }
    }
    return {fetchPosts,createPost,fetchPostsById,deletePostById,updatePostById}
}

//UI-Элементы
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
          type:[String,Number],
          required:false,
          default:'0'
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

//Компонент делки
const PostItem={
    template:`
       <div class="post-item">
           <div class="post-item__body">
                <VBadge :text="convertStatus" :intent="item.status" v-if="isFull"  />
                <div class="post-item__prop">
                    <div class="post-item__prop-name">Название</div>
                    <div class="post-item__prop-value" @click="redirectPage">{{item?.title}}</div>
                </div>    
                <div class="post-item__prop" v-if="isFull">
                      <div class="post-item__prop-name">Описание</div>
                    <div class="post-item__prop-value">{{itemDescription}}</div>
                </div>   
                <VForm @submit.prevent="submit" v-if="isEditing">
                    <div class="form-header">Редактирование</div>
                    <select v-model="item.status"  name="select" v-if="isFull">
                        <option :value="idx"  :key="idx" v-for="(item,idx) in statusArray">{{item}}</option>
                    </select>
                    <VInput v-model="item.title" placeholder="Title" label="Title"  />
                    <textarea name="description" v-model="item.text" v-if="isFull" />
                    <div class="form-controls">
                           <div class="form-controls__title">Управление</div>
                           <VButton :intent="'primary'">Обновить</VButton>
                           <VButton intent="error" @click="handleEdit">Отменить</VButton>        
                    </div>
                </VForm>
            </div>
           <div class="post-item__controls">
               <VButton :intent="'success'" @click="handleEdit">Редактировать</VButton>
               <VButton intent="error" v-if="!isFull" @click="deletePost">Удалить</VButton>
           </div>
       </div>
    `,
    data(){
        return {
            isEditing:false,
        }
    },
    props:{
        item:{
            type:Object,
            required:true,
        },
        isFull:{
            type:Boolean,
            required:false,
            default:false,
        }
    },
    computed:{
        itemDescription(){
            return this.item.text!==""?this.item.text:'Описание не заполнено'
        },
        convertStatus(){
                return  STATUS[this.item.status];
        },
        statusArray(){
            return Array.from(STATUS);
        }
    },
    methods:{
        handleEdit(){
            this.isEditing=!this.isEditing;
        },
        submit(){
            if(this.item.title==="")return;
                usePosts().updatePostById(this.item.id,this.item)
                    .then(response=>{
                        this.$emit('update',response.id)
                        this.handleEdit()
                    })

        },
        deletePost(){
            this.$emit('delete',this.item.id);
        },
        redirectPage(){
            this.$router.push(`/${this.item.id}`);
        }
    }
}
//Главная стр
const Home={
    data() {
        return {
            posts:[],
            searchString:"",
            postForm:{
                title:"",
            }
        };
    },
    components:{
        PostItem,
    },
    computed:{
      searchedPosts(){
          return this.posts.filter((post)=>post.title.toLowerCase().includes(this.searchString.toLowerCase()));
      }
    },
    template:`
        <VForm @submit.prevent="submit()">
           <div class="form-header">Добавить пост</div>
           <VInput v-model="postForm.title" placeholder="Название" label="Название"  />
               <VButton :intent="'primary'">Добавить</VButton>
        </VForm>
        <VForm style="margin-top: 15px" @submit.prevent="">
           <VInput v-model="searchString" placeholder="Поиск" label="Поиск"  />
        </VForm>
       <div class="post-list">
            <div class="post-list__title">Список постов</div>
            <div class="post-list__cards">
                <PostItem :item="post" v-if="searchedPosts!=0" @delete="deletePost" @update="updatePosts" v-for="post in searchedPosts" :key="post.id" />
                <div v-else>Список пуст</div>
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
            if(this.postForm.title==="")return;
            usePosts().createPost(this.postForm)
                .then(response=>usePosts().fetchPostsById(response.id))
                .then(data=>this.posts=[...this.posts,data])
                .finally(this.postForm.title="");
        },
        submit(){
            this.createPost();
        }
    },
}

//Детальная стр
const Detail={
    template:`
        <div class="detail">
            <router-link class="button-link"  to="/" >Назад</router-link>
            <div class="detail__title">Пост №{{pageID}}</div>
            <div class="detail-body">
                <PostItem :item="item" :is-full="true" />
           </div>
       </div> 
    `,
    data(){
        return{
            pageID:this.$route.params.id,
            item: {},
        }
    },
    components: {
      PostItem
    },
    created(){
        this.fetchPost();
    },
    methods:{
        fetchPost(){
            usePosts().fetchPostsById(this.pageID)
                .then(response=>this.item=response)

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
    routes,
})
const UI_ELEMENTS=[VInput,VButton,VDefaultLayout,VForm,VBadge];
UI_ELEMENTS.forEach((el)=>{
    app.component(el.name,el);
})
app.use(router)
app.mount('#app')