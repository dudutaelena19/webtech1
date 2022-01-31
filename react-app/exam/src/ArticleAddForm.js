import {useState} from 'react'

function ArticleAddForm(props){
const {onAdd}=props
const [id,setId]=useState('')
const [title,setTitle]=useState('')
const [abstract,setAbstract]=useState('')
const [date,setDate]=useState('')

const add=(evt)=>{
onAdd({
    id,
    title,
    abstract,
    date
})
}

return(
    <div>
    <h6>Add an article</h6>

        <div>
            <input type='number' placeholder='id' onChange={(evt)=>setId(evt.target.value)}/>
        </div>


        <div>
            <input type='text' placeholder='title' onChange={(evt)=>setTitle(evt.target.value)}/>
        </div>

        <div>
        <input type='text'  placeholder='content' onChange={(evt)=>setAbstract(evt.target.value)}/>
         </div>

         <div>
         <input type='date'  placeholder='date' onChange={(evt)=>setDate(evt.target.value)}/>
          </div>

         <div>
         <input type='button' value='addMe' onClick={add}/>
          </div>
    </div>
)
}

export default ArticleAddForm;