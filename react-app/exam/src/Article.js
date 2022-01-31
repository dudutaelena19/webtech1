import {useState} from 'react'


function Article(props){
const {item, onDelete, onSave }=props;
const [isEditing, setIsEditing]=useState(false)
const [id,setId]=useState(item.id)
const [title,setTitle]=useState(item.title)
const [abstract,setAbstract]=useState(item.abstract)
const [date,setDate]=useState(item.date)

const deleteArticle=(evt)=>{
onDelete(item.id);
}

const saveArticle=(evt)=>{
onSave(item.id,{
    id,
    title,
    abstract,
    date
})

setIsEditing(false);
}

const edit=()=>{
    setIsEditing(true);
}

const cancel=()=>{
    setIsEditing(false);
}


return(
    <div>
    {
        isEditing
        ?
        (
            <>
            <table>
            <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Abstract</th>
                <th>Date</th>
            </tr>
            <tr>
                <td><input type='number' value={id} onChange={(evt)=>setId(evt.target.value)}/> {item.id}</td>
                <td><input type='text' value={title} onChange={(evt)=>setTitle(evt.target.value)}/> {item.title}</td>
                <td><input type='text'  value={abstract} onChange={(evt)=>setAbstract(evt.target.value)}/>{item.abstract}</td>
                <td><input type='date'  value={date} onChange={(evt)=>setDate(evt.target.value)}/>{item.date}</td>
             
            </tr>
            </table>

                <input type='button' value='save' onClick={saveArticle}/>
                <input type='button' value='cancel' onClick={cancel}/>
           
            </>
        )
        : (
            <>
               
                    <table>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Abstract</th>
                        <th>Date</th>
                    </tr>
                    <tr>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.abstract}</td>
                        <td>{item.date}</td>
                     
                    </tr>
                    <input type='button' value='delete' onClick={deleteArticle}/>
                    <input type='button' value='edit' onClick={edit}/>
                    </table>
                            
                </>
    
        )
    }
 
    
   </div>
    
)

}

export default Article;