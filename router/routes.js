const express=require('express');
const router=express.Router();
const message=require('../controllers/mailmessage');
const writings=require('../controllers/writings');



router.get('/',(req,res)=>{
    console.log("here homepage");
    res.render('homepage.dust');
})


router.get('/contact', (req, res) => {

    const showSuccess = req.query.success === 'true';
    
    console.log("here");
    res.render('contact2.dust', {
        showSuccess: showSuccess // Pass the success status to the template
    });
  })


  router.get('/writings',writings.writings_stories);

  router.get('/stories',writings.writings_stories);


  router.get('/poetries',writings.writings_poetries);


  router.get('/content/:id',writings.content);

  router.get('/aboutme',(req,res)=>{
    res.render('aboutme.dust')
  });


  //Sending Message Portion

  router.post('/sendmessage',message.sendmessage);


module.exports=router;