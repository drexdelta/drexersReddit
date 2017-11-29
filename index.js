const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

app.post('/createUser', function(req, res){

  console.log("in");
  console.log(req.body.balance);

  store.createUser({
      username: req.body.username,
      password: req.body.password,
      balance : req.body.balance
    }).then(function(){res.sendStatus(200)});

})

app.post('/deposite' , function(req,res){
  
  console.log("came to deposite in the index.js");
  store.deposite({

      username: req.body.username,
      password: req.body.password,
      balance: req.body.balance

  }).then( function(e){
      console.log("check point ");
      
      /*for(var i = 0, iL = e.length; i < iL; i++) {
        console.log(e[i]);
      }*/

      res.sendStatus(200)
    });
})

app.post( '/LoginUser' , function(req,res){

  console.log("came to LoginUser in the index.js");
  var username = req.body.username;
  var password = req.body.password;
  console.log("reqeust came from " , username , " and " , password)

  return store.LoginUser({
    username : req.body.username,
    password : req.body.password
  }).then(function(result){

    if(result.length !== 0){
      console.log("user found in index.js");
      res.sendStatus(200);
    }
    else{
      console.log("user not found in index.js");
      res.sendStatus(401);
    }

  });

});

app.post('/DeleteUser' , function(req,res){

  console.log("came to delelte user in index.js");
  store.deleteUser({
    username : req.body.username,
    password : req.body.password
  }).then(function(e){

    console.log("check point in index.js");
    res.sendStatus(200);

  })

})

app.post('/withdraw' , function(req,res){

  store.withdraw({
      username: req.body.username,
      password: req.body.password,
      balance: req.body.balance
  }).then(function() { res.sendStatus(200)} )

})

app.post('/insertComment' , function(req,res){
  console.log("in the index.js for inserting comment\n");

  store.insertComment({
    username : req.body.username,
    password : req.body.password,
    comment : req.body.comment,
    parent : req.body.par
  }).then(function(result) {
    res.send(JSON.stringify(result[0]));
  });

})

app.post('/getComments' , function(req,res){

  console.log(" Loc : index.js , get children comments of  comment id " , req.body.par);
  debugger

  store.getComments({
      parent : req.body.par
  }).then(function(ret){

      for(var i = 0, iL = 4; i < iL; i++) {
        console.log("printing comments in index.js\n");
      }
        
      for(var i = 0  ,lim = ret.length ; i < lim ; i++){
        console.log(ret[i]);
      }

      console.log(" returned from store.js\n");
      console.log("giong to client\n");
      console.log(JSON.stringify(ret));
      res.send(JSON.stringify(ret));

      
      // print here the list, first confirm that we are returning here...

  });

})

app.post('/getUserId' , function(req,res){
    store.getUserId({
        username : req.body.username,
        password : req.body.password
    }).then(function(ret){
        console.log("in the index.js" , ret.id );
        res.send(JSON.stringify(ret[0].id));
    });
})

app.post('/upvote' , function(req,res){

    console.log("came for upvote in index.js");
    console.log(" cmt id " , req.body.cmtId , " user id "  , req.body.numUserId);

    store.getDownVoteEntry({
        userId : req.body.numUserId,
        commentId : req.body.cmtId
    }).then(function(ret){

        if(ret.length === 1){

            // in this case, we have found an downVote entry from given userid for the given commentid

            // so we need to remove this entry from downvote table, and then add new entry to the upvote table,
            // return count = 2;
            console.log(" down vote found with given user id and comment id ");

            store.removeDownVote({
                userId: req.body.numUserId,
                commentId: req.body.cmtId
            }).then(function () { // removing,

                // adding new upvote
                store.addUpvoteEntry({
                    userId: req.body.numUserId,
                    commentId: req.body.cmtId
                }).then(function () {
                    // return JSON value 2
                    var x = 2;
                    res.send(JSON.stringify(x));
                });

            });
        }
        else{

            console.log("else part\n");
            store.getUpVoteEntry({
                userId: req.body.numUserId,
                commentId: req.body.cmtId
            }).then(function(ret){
                if(ret.length === 1){
                    var x = 0;
                    res.send(JSON.stringify(x));
                }else{
                    store.addUpvoteEntry({
                        userId: req.body.numUserId,
                        commentId: req.body.cmtId
                    }).then(function(ret){
                        var x = 1;
                        res.send(JSON.stringify(x));
                    });
                }
            });

        }
    });
})

app.post('/downvote' , function(req,res){

    console.log("dwnvt btn pressed");
    console.log("userid " , req.body.numUserId);
    console.log(" comment id " , req.body.cmtId);

    store.getUpVoteEntry({
        userId : req.body.numUserId,
        commentId : req.body.cmtId
    }).then(function(ret){

        if(ret.length === 1){
            console.log("in the if part");
            store.removeUpVote({
                userId : req.body.numUserId,
                commentId : req.body.cmtId
            }).then(function(){
                store.addDownVoteEntry({
                    userId: req.body.numUserId,
                    commentId: req.body.cmtId
                }).then(function(){
                    var x = -2;
                    res.send(JSON.stringify(x));
                });
            });
        }
        else{
            console.log("in the else part");
            store.getDownVoteEntry({
                userId: req.body.numUserId,
                commentId: req.body.cmtId
            }).then(function(ret){
                if(ret.length === 1){
                    var x = 0;
                    res.send(JSON.stringify(x));
                }
                else{
                    store.addDownVoteEntry({
                        userId: req.body.numUserId,
                        commentId: req.body.cmtId
                    }).then(function(){
                        var x = -1;
                        res.send(JSON.stringify(x));
                    });
                }
            });
        }

    });
})

app.listen(7555, function(){

  console.log('Server running on http://localhost:7555')

})
