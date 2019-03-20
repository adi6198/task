const {google} = require('googleapis');
const express=require('express');
const router=express.Router();
let mongo=require('mongoose');
const localstorage= require('local-storage');
const jwt = require('jsonwebtoken');
const Schema=mongo.Schema;
let UsersSchema=new Schema({
  email:{type:String},
  displayName:{type:String},
  image:{type:String},
  currentstatus:{type:Boolean},

},{verionKey:false});
let UserModel=mongo.model('users',UsersSchema,'users');


const config={
  CLIENT_ID:"866841371425-r6ibmkvvdhg5kk510qhtbcrbbjtvkdc9.apps.googleusercontent.com",
  CLIENT_SECRET:"j-rq3oxvBCB2JtqhE5MYPSX-",
  REDIRECT_URL:"http://localhost:4000/user/userinfo"}


  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.profile',
    ];

const oauth2Client = new google.auth.OAuth2(config.CLIENT_ID,config.CLIENT_SECRET,config.REDIRECT_URL);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt:"consent"
});

function checkCredential(){
oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        console.log(tokens.refresh_token);
      }
      console.log(tokens.access_token);
  });
}

router.get('/',(req,res,next)=>{
    // console.log("Called2");  
  res.status(200).send({url:url});
  // res.redirect(url);
});



router.route('/userinfo').get(async (req,res,next)=>{
    console.log("Called");
	const code=req.query.code;
	try{
      const {tokens} = await oauth2Client.getToken(code);
       oauth2Client.setCredentials(tokens);
       localstorage.set("token",tokens);
      const plus=google.plus({version: 'v1', auth:oauth2Client});

       plus.people.get({userId: 'me',personFields:'displayName'}, (err, result) => {
       if (err) return console.log('The API returned an error: ' + err); 
            const user={
            email:result.data.emails[0].value,
            displayName:result.data.displayName,
            image:result.data.image.url,
            currentstatus:true,
            }
         
          UserModel.findOneAndUpdate({email:user.email},{ $set:{currentstatus:true}},function(err,data){   
            if(err) return console.log(err);
            if(!data){
              let usermodel=new UserModel(user); 
              usermodel.save(function(err,resp){
              if(err) return resp.send(err);
              const  id=resp._id;
              console.log(id);
              console.log("record has been inserted!");
              console.log(res);
              let payload = { subject: id }
              let token = jwt.sign(payload, 'secretkey');
              res.status(200).redirect('http://localhost:4200/list?token='+token);
              });
            }else{
              const id=data._id;
              console.log("record already inserted!");
              res.status(200).redirect('http://localhost:4200/list?id='+id);
            } 
          });
        });
    }catch(error){
      console.log(error);}
  });

router.route('/userData').get((req,res,next)=>{
  console.log(req.query.id);

  UserModel.findOne({_id:req.query.id},function(err,data){
  if(err) return res.send(err);
  console.log("data:"+data);
  res.send({userDetail:data});
  });
});

//   router.routeget('/logout',(req,res,next)=>{
//     console.log(req.query.id);
//     UserModel.findByIdAndUpdate(req.query.id,{$set:{currentstatus:'false'}},function(err,data){   
//       if(err) return console.log(err);
//     console.log(data);
//     data.currentstatus=false;
//     res.send({data:data});
//     });

// });


router.get("/status",function(req,res){
  const userid=req.query.id;
  console.log(userid);

  UserModel.findOne({_id:userid},function(error,data){
     if(error) return res.send(error);
     console.log(data);
     res.send({data:data});
 })
});
  


module.exports=router;

//   const oauth2Client = new google.auth.OAuth2(
//     '',
//     '',
//     'http://localhost:4000/issues'
//   );
