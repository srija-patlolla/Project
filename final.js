const express = require('express')
const request=require('request')
const app = express()
const port = 4000

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./serviceAccountkey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();




app.set("view engine","ejs")
app.get('/', (req, res) => {
  res.render('history')
})

app.get('/signin', (req, res) => {
    res.render('signin')
  })

  app.get("/signinsubmit",(req,res)=>{
    const email=req.query.email;

    const pwd=req.query.pwd; 
    db.collection('users')
    .where('email', '==', email)
    .where('password', '==', pwd)
    .get()
    .then((docs)=>{
      if(docs.size>0){
        res.render("historyevents");
      }
      else{
        res.render("signinfail");
      }
  });
  });

  app.get('/signup', (req, res) => {
    res.render('signup')
  })

 app.get("/signupsubmit",(req,res)=>{
  const fullname=req.query.fullname;

  const email=req.query.email;

  const pwd=req.query.pwd;

  db.collection('users').add({
   name:fullname,
   email:email,
   password:pwd,

})
.then(() =>{
  res.render("signin");
});

 });

 app.get('/history',(req,res)=>{
  const name=req.query.name;
  //res.send(name)
  var datainfo=[];

  request.get({
    url: 'https://api.api-ninjas.com/v1/historicalevents?text=' + name,
    headers: {
      'X-Api-Key': 'WU9NSwgvxMiSgg3npA8jFMIZauXRehaPXw3TAQ16'
    },
  }, function(error, response, body)  
 {
  const data=JSON.parse(body)
     var a=data[0].year;
     var b=data[0].month;
     var c=data[0].day;
     var d=data[0].event;
     datainfo.push(a)
     datainfo.push(b)
     datainfo.push(c)
     datainfo.push(d)
     res.render("historyfound",{user:datainfo})  
})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})