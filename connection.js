const {Pool}=require('pg');


const {PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD}=process.env;

const pool=new Pool({
    user:PGUSER,
    host:PGHOST,
    database:PGDATABASE,
    password:PGPASSWORD,
    port:5432,
    ssl:{
        require:true
    }
});


module.exports=pool;