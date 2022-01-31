import {useEffect,useState} from 'react'
import store from './ArticleStore'
import ArticleAddForm from './ArticleAddForm'
import Article from './Article'


function ArticleList() {
  const[articles,setArticles]=useState([]);
 
  useEffect(()=>{
    store.getArticles();
    store.emitter.addListener('GET_ARTICLES_SUCCESS',()=>{
      setArticles(store.data);
    })
  },[])

  const addArticle=(article)=>{
    store.addArticle(article);
  }

  const deleteArticle=(id)=>{
    store.deleteArticle(id);
  }

  const saveArticle=(id,article)=>{
    store.saveArticle(id,article);
  }

  return (
    <div>
    <h4>List of books</h4>
      {
        articles.map(e=><Article key={e.id} item={e} onDelete={deleteArticle} onSave={saveArticle}/>)
      }
      <ArticleAddForm onAdd={addArticle}/>
    </div>
  );
}

export default ArticleList;
