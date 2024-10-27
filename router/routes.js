const express=require('express');
const router=express.Router();
const message=require('../controllers/mailmessage');



router.get('/',(req,res)=>{
    console.log("here homepage");
    res.render('homepage.dust');
})


router.get('/contact', (req, res) => {
    console.log("here");
    res.render('contact2.dust');
  })


  router.get('/writings', (req, res) => {
    console.log("here");
    res.render('writings.dust');
  })

  router.get('/stories', (req, res) => {
    res.render('stories.dust');
  })


  router.get('/poetries', (req, res) => {
    res.render('poetries.dust');
  })


  router.get('/content', (req, res) => {
    
    console.log("here");
    res.render('content.dust');
  })


  //Sending Message Portion

  router.post('/sendmessage',message.sendmessage);


module.exports=router;