const pool=require('../connection')

const writings_poetries=async (req,res)=>{
    try{

        const query1=`Select * from poetries`;

        const values=await pool.query(query1);
        res.render('poetries',{data:values.rows});

    }
    catch(e){
        console.error(e);
        res.status(500).send("Error fetching data from databse");
    }
};

const writings_stories=async (req,res)=>{
    try{

        const query1=`Select * from stories`;

        const values=await pool.query(query1);
        res.render('stories',{data:values.rows});

    }
    catch(e){
        console.error(e);
        res.status(500).send("Error fetching dasta from databse");
    }
};


const content=async (req,res)=>{
   try{
    
    const id =req.params.id;
    const text=req.query.text;
    console.log(id);
    console.log(text);


    if(text==`poems`)
    {
        const fetchquery=`Select * from poetries where id=id`;
        const data=await pool.query(fetchquery);
        res.render('content',{data:data.rows,text:'poetries'});
    }
    else{
        const fetchquery=`Select * from stories where id=id`;
        const data=await pool.query(fetchquery);
        res.render('content',{data:data.rows,text:'stories'});

    }


   }
   catch(e)
   {
     console.log(e);
     res.status(500).send("Error fetching content");
   }
    
}

module.exports={writings_poetries,writings_stories,content}