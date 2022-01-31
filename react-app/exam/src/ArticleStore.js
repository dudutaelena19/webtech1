import { EventEmitter } from "fbemitter";

const SERVER='http://localhost:8080';

class ArticleStore{
constructor(){
    this.data=[];
    this.emitter=new EventEmitter();
}

async getArticles()
{
    try{
        const response=await fetch(`${SERVER}/articles`);
        if(!response.ok){
            throw response
        }
        this.data=await response.json();
        this.emitter.emit('GET_ARTICLES_SUCCESS');
    }catch(err){
        console.warn(err);
        this.emitter.emit('GET_ARTICLES_ERROR');
    }
}

async addArticle(article)
{
    try{
        const response=await fetch(`${SERVER}/articles`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
            body:JSON.stringify(article)
         })
        if(!response.ok){
            throw response;
        }
        this.getArticles();
        }
        catch(err){
        console.warn(err);
        this.emitter.emit('ADD_ARTICLES_ERROR');
    }
}

async saveArticle(id,article){
    try{
        const response=await fetch(`${SERVER}/articles/${id}`,{
        method:'PUT',
        header:{
            'Content-Type':'application/json'
        },
            body:JSON.stringify(article)
         })
        if(!response.ok){
            throw response;
        }
        this.getArticles();
        }
        catch(err){
        console.warn(err);
        this.emitter.emit('UPDATE_ARTICLE_ERROR');
    }
}

async deleteArticle(id){
 try{
        const response=await fetch(`${SERVER}/articles/${id}`,{
        method:'DELETE'
         })
        if(!response.ok){
            throw response;
        }
        this.getArticles();
        }
        catch(err){
        console.warn(err);
        this.emitter.emit('DELETE_ARTICLE_ERROR');
    }
}
}

const store=new ArticleStore();


export default store;