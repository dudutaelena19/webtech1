const express=require('express');
const bodyParser=require('body-parser');
const Sequelize=require('sequelize');
const cors=require('cors');
const { query } = require('express');
const { DataTypes } = require('sequelize');

//ne conectam la sequelize
const sequelize=new Sequelize({
    dialect:'sqlite',
    storage:'sample.db',
    define:{
        timestamps:false
    }
})


const Article = sequelize.define('articles', {
    id:{
        primaryKey:true,
        allowNull:false,
        type:DataTypes.INTEGER,
        autoIncrement:true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{len: [5,30]}
    }    ,
    abstract:
    {
        type:DataTypes.STRING,
        allowNull:false
    },
    date:{
        type:DataTypes.DATE
    }

});


const Reference=sequelize.define('reference',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{len: [5,30]}
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    authors:{
        type:DataTypes.ENUM("author1","author2","author3")
    }
})


Article.hasMany(Reference);

const app=express();
app.use(cors());
app.use(bodyParser.json());

app.get('/sync',async(req,res)=>{
try{
    await sequelize.sync({force: true});
    res.status(201).json({message:'tables created'});
}catch(err)
{
    console.warn(err);
    res.status(500).json({message:'some error occured'})
}
});

app.get('/articles', async(req,res)=>{
    const {simplified, sortBy}=req.query;
    try{
       const article=await Article.findAll({
           attributes:simplified?{exclude:"id"}:undefined,
           order:sortBy ? [[sortBy],'ASC']:undefined
       });
       res.status(200).json(article);
    }catch(err)
    {
        console.warn(err);
        res.status(500).json({message:'some error occured'})
    }
});
app.post('/articles',async(req,res)=>{
    try{
        await Article.create(req.body);
        res.status(201).json({message:'created'})
    }catch(err)
    {
        console.warn(err);
        res.status(500).json({message:'some error occured'})
    }
});


app.get('/articles/:aid',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid,{include:Reference});
       if(article)
       {
           res.status(200).json(article);
       }else{
           res.status(404).json({message:'not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});
app.put('/articles/:aid',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid);
       if(article)
       {    await article.update(req.body,{fields:['id','title','abstract','date']});
           res.status(202).json({message: 'accepted'});
       }else{
           res.status(404).json({message:'not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});
app.delete('/articles/:aid',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid);
       if(article)
       {    await article.destroy();
           res.status(202).json({message: 'accepted'});
       }else{
           res.status(404).json({message:'not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});

app.get('/articles/:aid/references',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid);
       if(article)
       {    const reference = await article.getReferences();
           res.status(200).json(reference);
       }else{
           res.status(404).json({message:'not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});

app.post('/articles/:aid/references',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid);
       if(article)
       {    const reference = req.body;
            reference.articleId=article.id;
            await Reference.create(reference);
           res.status(201).json({message:'created'});
       }else{
           res.status(404).json({message:'not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});

app.get('/articles/:aid/references/:rid',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid);
       if(article)
       {    const references = await article.getReferences({where:{id:req.params.rid}});
            const reference=references.shift();
            if(reference){
                res.status(200).json(reference);
            }
            else{
                res.status(404).json({message:'reference not found'});
            }
       }else{
           res.status(404).json({message:'article not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});

app.put('/articles/:aid/references/:rid',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid);
       if(article)
       {    const references = await article.getReferences({where:{id:req.params.rid}});
            const reference=references.shift();
            if(reference){
                await reference.update(req.body);
                res.status(202).json({message:'accepted'});
            }
            else{
                res.status(404).json({message:'reference not found'});
            }
       }else{
           res.status(404).json({message:'article not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});
app.delete('/articles/:aid/references/:rid',async(req,res)=>{
    try{
        const article=await Article.findByPk(req.params.aid);
       if(article)
       {    const references = await article.getReferences({where:{id:req.params.rid}});
            const reference=references.shift();
            if(reference){
                await reference.destroy();
                res.status(202).json({message:'accepted'});
            }
            else{
                res.status(404).json({message:'reference not found'});
            }
       }else{
           res.status(404).json({message:'article not found'});
       }
        
     }catch(err)
     {
         console.warn(err);
         res.status(500).json({message:'some error occured'})
     }
});

app.listen(8080);