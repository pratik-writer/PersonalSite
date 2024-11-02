const express=require('express')
const app=express();
const dust=require('dustjs-express');
const bodyparser=require('body-parser');
const cons = require('consolidate');
const path=require('path');
const userroutes=require('./router/routes');
const pool=require('./connection')




app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({extended:true}));
app.engine('dust', dust.engine(useHelpers=true));
app.set('view engine', 'dust');
app.set('views', path.join(__dirname,'/views'));




app.use('/',userroutes);

app.listen(3000,()=>{
    console.log("Listening on port 3000!!!!!!!");
})