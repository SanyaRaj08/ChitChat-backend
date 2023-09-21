const express=require('express');
const dotenv=require('dotenv');
const chats  = require('./data/data.js');
dotenv.config();
const app=express();
const port=process.env.PORT||5000
app.listen(port,console.log('Server started at port', port))

app.get('/',(req,res)=>{
    res.send("hey")
});
app.get('/api/chats/:id',(req,res)=>{
    const singleChat=chats.find((c)=>c._id===req.params.id)
        res.send(singleChat);
    }
    
);



