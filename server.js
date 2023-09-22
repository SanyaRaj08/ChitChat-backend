const express=require('express');
const cors = require('cors');
// const dotenv=require('dotenv');
// const chats  = require('./data/data.js');
const connectDb  = require('./config/db.js');

const app=express();
const port=process.env.PORT||5000
app.use(cors());
connectDb();
app.use(express.json()) //to accept json data

//available routes
app.use('/api/auth',require('./routes/auth.js'));

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})












