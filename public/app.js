const CreateUser = document.querySelector('.CreateUser')
const DeleteUser = document.querySelector('.DeleteUser')
const LoginUser = document.querySelector('.LoginUser')

function printComments(){

  console.log("going for the fatching comments\n");
  var par = -1;
  post('/getComments' , {par} ).then(function(res){

      res.json().then(function(comments){

        //each x make a comment
        var commentDiv = document.getElementById("commentDiv");

        for(var i = 0 ; i < comments.length ; i++){

            var x = comments[i];
            var newDiv = generateCommentDiv(x.user_id , x.comment_id , x.comment_content , x.username , x.upvotes , x.downvotes);
            commentDiv.appendChild(newDiv);

        }

      })

  });

  console.log("moved further in the printComment function from fatch");

}

// addUpvote for given comment id and user id
// also send reqeust to server, just print there and confirm
function generateCommentDiv(user_id,comment_id,comment_content,username,upvotes,downvotes){



    var content = document.createElement('span');
    var uname = document.createElement('span');
    var uid = document.createElement('span');
    var votes = document.createElement('span');
    var commentid = document.createElement('span');
    var replyDiv = document.createElement('div');
    var childrenDiv = document.createElement('div');
    var retDiv = document.createElement('div');

    content.innerHTML = "content = " + comment_content;
    uname.innerHTML = "uname " + username;
    uid.innerHTML = "u id " + user_id + " votes " ;
    votes.innerHTML = "" + (upvotes-downvotes);
    commentid.innerHTML = "" + comment_id;

    var downvoteBtn = document.createElement('button');
    var upvoteBtn = document.createElement('button');
    var replyBtn = document.createElement('button');


    downvoteBtn.innerHTML = "dwn";
    upvoteBtn.innerHTML = "up";
    replyBtn.innerHTML = "reply";

    //upvote functionality
    upvoteBtn.addEventListener('click',function(event){

        event.preventDefault();

        console.log(commentid.innerHTML);
        console.log(votes.innerHTML);
        var x = parseInt(votes.innerHTML);
        console.log("current votes" , x , " and request came for upvote");

        // implement server query here,,, and if promise success then only make changes
        var requestingUser = document.getElementById('myusername').value;
        var requestingUserPwd = document.getElementById('mypassword').value;
        var userId = document.getElementById('userId').value;
        if(userId === "")return;
        var numUserId = parseInt(userId);
        console.log("user id + 10 " , numUserId+10);

        console.log(" upvote request came from " ,requestingUser , " " , requestingUserPwd);
        console.log(" request came from " , userId);
        var cmtId = parseInt(commentid.innerHTML);
        console.log(" comment id " , cmtId);

        // send post request for upvote
        post('/upvote' , {numUserId,cmtId}).then(function(ret){

            ret.json().then(function(add){
                votes.innerHTML = ("" + (x+add));
            });

        });





    });

    downvoteBtn.addEventListener('click',function(event){

        event.preventDefault();

        console.log(commentid.innerHTML);
        console.log(votes.innerHTML);
        var x = parseInt(votes.innerHTML);
        console.log("current votes" , x , " and request came for upvote");

        // implement server query here,,, and if promise success then only make changes
        var requestingUser = document.getElementById('myusername').value;
        var requestingUserPwd = document.getElementById('mypassword').value;
        var userId = document.getElementById('userId').value;
        if(userId === "")return;
        var numUserId = parseInt(userId);
        console.log("user id + 10 " , numUserId+10);

        console.log(" upvote request came from " ,requestingUser , " " , requestingUserPwd);
        console.log(" request came from " , userId);
        var cmtId = parseInt(commentid.innerHTML);
        console.log(" comment id " , cmtId);


        // send post request for downvote
        post('/downvote' , {numUserId,cmtId}).then(function(ret){

            ret.json().then(function(add){
                votes.innerHTML = ("" + (x+add));
            });

        });

    });

    replyBtn.addEventListener('click',function(event){

        event.preventDefault();

        console.log("user id wih " , document.getElementById('userId').value , ' wants to reply to the commentid ' , comment_id);

        replyDiv.innerHTML = "";
        var inpField = document.createElement('input');

        // enter input filed in replyDiv, enter done button also , also provide 'cancle' button...
        inpField.setAttribute('placeholder' , "enter your reply here");
        inpField.setAttribute('type' , 'text');

        var doneBtn = document.createElement('button');
        var cancleBtn = document.createElement('button');

        doneBtn.innerHTML = "done";
        cancleBtn.innerHTML = "cancle";

        replyDiv.appendChild(inpField);
        replyDiv.appendChild(doneBtn);
        replyDiv.appendChild(cancleBtn);

        // if the user clicks on the "done" , insert comment in comment database...
        doneBtn.addEventListener('click' , function(innerEvent){

            innerEvent.preventDefault();
            //post request to generate new comment and then add to comment database
            console.log("done button clicked  ");
            console.log(" going to add children of commentid " , comment_id);

            var username = document.getElementById('myusername').value;
            var password = document.getElementById('mypassword').value;
            var comment = inpField.value;

            console.log(" user has written comment as : " , comment);
            console.log("request came from " , username ,' and his passowrd is ' ,  password);
            var par = comment_id;
            post( '/insertComment',{username,password,comment,par} ).then(function(ret){
                ret.json().then(function(newCommentId){


                    console.log("new comment id is " , newCommentId["max(`comment_id`)"]);
                    post('/getUserId' , {username,password}).then(function(ret2){

                        console.log(ret2);

                        ret2.json().then(function(commentingUserId){
                            console.log(" commenting userid " , commentingUserId);
                            var newCommentDiv = generateCommentDiv(commentingUserId , newCommentId["max(`comment_id`)"] , comment , username,0,0 );
                            childrenDiv.appendChild(newCommentDiv);
                        });
                    });
                })
            })
        });

        // if user clicks on "cancle" , then remove that reply div...
        cancleBtn.addEventListener('click' , function(innerEvent){

            innerEvent.preventDefault();
            // just clear the div inside the replyDiv;
            console.log(" request came to cancle the response");
            replyDiv.innerHTML = "";

            return;

        });

    });

    retDiv.appendChild(content);
    retDiv.appendChild(uname);
    retDiv.appendChild(uid);
    retDiv.appendChild(votes);
    retDiv.appendChild(commentid);
    retDiv.appendChild(upvoteBtn);
    retDiv.appendChild(downvoteBtn);
    retDiv.appendChild(replyBtn);
    retDiv.appendChild(replyDiv);
    retDiv.appendChild(childrenDiv);

    var par = comment_id;
    post( '/getComments' , {par} ).then(function(tempRet2){

        tempRet2.json().then(function(children) {

            console.log(" got children of commentid ", comment_id);
            console.log(" total children ", children.length);
            for (var i = 0; i < children.length; i++) {

                var x = children[i];
                var newDiv = generateCommentDiv(x.user_id, x.comment_id, x.comment_content, x.username, x.upvotes, x.downvotes);
                childrenDiv.appendChild(newDiv);

            }
        });
    });

    retDiv.appendChild(document.createElement('br'));
    retDiv.appendChild(document.createElement('br'));
    retDiv.appendChild(document.createElement('br'));
    retDiv.appendChild(document.createElement('br'));
    retDiv.appendChild(document.createElement('br'));
    retDiv.appendChild(document.createElement('br'));

    return retDiv;

}


// add downvote for given comment id and user id
// also send reqeust to server, just print there and confirm


CreateUser.addEventListener( 'submit', function(e){

  e.preventDefault();
  const username = CreateUser.querySelector('.username').value // why '.' is required ? before the class name ???
  const password = CreateUser.querySelector('.password').value 
  const balance = CreateUser.querySelector('.balance').value
  console.log("user name is" , username , password , balance , "\n")
  post('/createUser', { username, password , balance})
  printComments();

} )

DeleteUser.addEventListener( 'submit' , function(e){

  console.log("here in delete");
  e.preventDefault();
  const username = DeleteUser.querySelector('.username').value
  const password = DeleteUser.querySelector('.password').value
  console.log("in the deleteuser app.js");
  console.log(username , "\n", password);
  post('/DeleteUser' ,{username,password});
  printComments();

} )

LoginUser.addEventListener('submit',function(e){

  e.preventDefault();
  const username = LoginUser.querySelector('.username').value
  const password = LoginUser.querySelector('.password').value
  console.log("login request came for ", username , "   and " , password)
  post('/LoginUser',{username , password}).then(function(x){
    console.log(x.status);

    if(x.status === 200){
      alert("user authentication valid");
    }
    else
      alert("user authentication invalid");
  })
  printComments();

} )




document.getElementById('withdraw').onclick = function(e){

  console.log("here we came for withdraw request\n")
  const username = CreateUser.querySelector('.username').value // why '.' is required ? before the class name ???
  const password = CreateUser.querySelector('.password').value 
  const balance = CreateUser.querySelector('.balance').value
  console.log("WTIHDRAW REQUEST  : user name is" , username , password , balance , "\n")
  post('/withdraw' , {username , password , balance})
  e.preventDefault();
  printComments();


};

document.getElementById('deposite').onclick = function(e){

  const username = CreateUser.querySelector('.username').value // why '.' is required ? before the class name ???
  const password = CreateUser.querySelector('.password').value 
  const balance = CreateUser.querySelector('.balance').value
  console.log("DEPOSITE REQUEST  : user name is" , username , password , balance , "\n")
  post( '/deposite' , {username , password , balance} )
  e.preventDefault();
  printComments();

};

document.getElementById('commentBtn').onclick = function(e){
  
  e.preventDefault();
  const username = CreateUser.querySelector('.username').value
  const password = CreateUser.querySelector('.password').value
  const comment = CreateUser.querySelector('.commentText').value

  console.log("came comment request from " , username , " and comment is \n" , comment , " \ngoing to server\n");
  var par = -1;
  post( '/insertComment',{username,password,comment,par}).then(function(ret){

      ret.json().then(function(innerRet){

          console.log("new comment id is " ,innerRet);

      });

      /*
      if(x.status === 200){
        alert("comment successfully added");
      }else{
        alert("comment was not added");
      }
      */

      printComments();

  });
  

}

document.getElementById('upvoteBtn').onclick = function(e){

  e.preventDefault();

  const username = CreateUser.querySelector('.username').value
  const password = CreateUser.querySelector('.password').value
  const commentId = CreateUser.querySelector('.commentId').value;
  console.log("username " , username , " passowrd " , password , " cmt - id " , commentId , "\n");

 
  console.log("request came for upvote");

}

document.getElementById('downvoteBtn').onclick = function(e){

  e.preventDefault();

  const username = CreateUser.querySelector('.username').value
  const password = CreateUser.querySelector('.password').value
  const commentId = CreateUser.querySelector('.commentId').value;
  console.log("username " , username , " passowrd " , password , " cmt - id " , commentId , "\n");
  
  console.log("request came for downvote");
  
}

document.getElementById('getComments').onclick = function(e){

  e.preventDefault();

  printComments();

}
function post(path, data){

  return window.fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
};

