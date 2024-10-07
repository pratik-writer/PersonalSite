const express=require('express')
const app=express();
const dust=require('dustjs-express');
const path=require('path');
const userroutes=require('./router/routes');




app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('dust', dust.engine(useHelpers=true));
app.set('view engine', 'dust');
app.set('views', path.join(__dirname,'/views'));

app.get('/',userroutes);

app.listen(3000,()=>{
    console.log("Listening on port 3000!!!!!!!");
})