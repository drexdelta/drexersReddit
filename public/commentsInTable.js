const CreateUser = document.querySelector('.CreateUser')
const DeleteUser = document.querySelector('.DeleteUser')
const LoginUser = document.querySelector('.LoginUser')

function printComments(){

  console.log("going for the fatching comments\n");
  var x = 1;
  post('/getComments' , {x} ).then(function(res){

      res.json().then(function(comments){

        //each x make a comment

        var commentsTable = document.getElementById('commentsTable');
        
        var row = commentsTable.insertRow(0);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        var c3 = row.insertCell(2);
        var c4 = row.insertCell(3);
        var c5 = row.insertCell(4);

        c1.innerHTML = "username";
        c2.innerHTML = "comment";
        c3.innerHTML = "upvotes";
        c4.innerHTML = "downvotes";
        c5.innerHTML = "comment_id";

        for(var i = 0 ; i < comments.length ; i++){

            var row = commentsTable.insertRow(i+1);
            
            var cell1 = row.insertCell(0);   
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);

            var newBtn = document.createElement('button');

            cell1.innerHTML = comments[i].username;
            cell2.innerHTML = comments[i].comment_content;
            cell3.innerHTML = comments[i].upvotes;
            cell4.innerHTML = comments[i].downvotes;
            cell5.innerHTML = comments[i].comment_id;
          
        }

      })

  });

  console.log("moved further in the printComment function from fatch");

}



// addUpvote for given comment id and user id
// also send reqeust to server, just print there and confirm
function addUpvoteButton(comment_id,user_id,upvotes,downvote,){

}


// add downvote for given comment id and user id
// also send reqeust to server, just print there and confirm


CreateUser.addEventListener( 'submit', (e) => {

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

  post( '/insertComment',{username,password,comment}).then(function(x){

      if(x.status==200){
        alert("comment successfully added");
      }else{
        alert("comment was not added");
      }
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

