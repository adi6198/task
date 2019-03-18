const {google} = require('googleapis');
var express=require('express');
var url = require('url');
var ls = require('local-storage');
var app=express();



const googleConfig = {
    clientId: '866841371425-r6ibmkvvdhg5kk510qhtbcrbbjtvkdc9.apps.googleusercontent.com',
    clientSecret: 'j-rq3oxvBCB2JtqhE5MYPSX-', // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'http://localhost:3000/red' // this must match your google api settings
  };



  const oauth2Client = new google.auth.OAuth2(
    '866841371425-r6ibmkvvdhg5kk510qhtbcrbbjtvkdc9.apps.googleusercontent.com',
    'j-rq3oxvBCB2JtqhE5MYPSX-',
    'http://localhost:3000/red'
  );

  function createConnection() {
    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
    );
  }

  const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/contacts.readonly'
  ];

  function getConnectionUrl(auth) {
    //console.log("Auth : "+auth);
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: defaultScope
    });
  }


function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    console.log("URL : "+url);
    return url;
  }


  app.get('/',function(red,res){
     res.redirect(urlGoogle());
  });

app.get('/red',async function(red,response){
  
    var q = url.parse(red.url, true);
    //console.log(url.parse(red.url));
    const {tokens} = await oauth2Client.getToken(q.query.code);
    oauth2Client.setCredentials(tokens);
    // console.log("Client : "+google.auth.oauth2);
    ls.set('rtoken',tokens);
    response.redirect('/contact'); 
});

module.exports=app;