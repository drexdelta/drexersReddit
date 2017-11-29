const knex = require('knex')(require('./knexfile'))

module.exports = {

  createUser ({ username, password , balance }) {
    console.log(`Add user ${username} with password ${password} and balance ${balance}\n` )
    var x = knex.column('username','password','balance').select().from('user')
    .then(function (rows) {
      for(var i = 0, iL = rows.length; i < iL; i++) {
        console.log(rows[i]);
      }
    })

    console.log("query successful\n");

    if(balance===""){

      console.log("balance is empty string");
      balance = 100;

    }

    return knex('user').insert({

        username,
        password,
        balance

      })
    },

  deposite({username , password , balance }){

    console.log("deposite in store.js")
    console.log('add user ${username} with password ${password} and balance ${balance}\n')
    return  knex('user').where('username' ,'=', username).where('password','=', password).increment('balance',balance)

  },

  withdraw({username , password , balance }){

    console.log("withdraw in store.js")
    console.log('add user ${username} with password ${password} and balance ${balance}\n')
    return  knex('user').where('username' ,'=', username).where('password','=', password).decrement('balance',balance)

  },

  deleteUser({username,password}){

   console.log("came to deleteuser in store.js");
   return knex('user').where('username','=',username).where('password','=',password).del();

  },

  LoginUser({username,password}){

    console.log("store.js + Login");
    console.log("un " , username , " pw " , password , "\n")
    return knex('user').where('username' , '=' , username).where('password','=',password).then(function(userEntry){
      
      if(userEntry.length == 0){
        console.log("user doesn't exist in store.js");
      }
      else{
        console.log("user exist in store.js");
      }
      return userEntry;
    })

  },

    getUserId({username,password}){
      return knex('user').select('id').where('username','=',username).where('password','=',password);
    },

  insertComment({username,password,comment,parent}){

    console.log("store.js + create comment");
    console.log(" un ", username , " pw " , password , "\n");
    console.log("comment " , comment , "\n");

    return knex('user').where('username','=',username).where('password','=',password).then(function(users){
      if(users.length === 0){
        console.log("user doens't exits in store.js");
        return users;
      }
      else{

        console.log(users[0].password);
        console.log(users[0].username);
        console.log("user was found");
        var user_id = users[0].id;

        console.log("user id of the user is " , user_id , "\n");
        var comment_content = comment;
        var downvotes = 0;
        var upvotes = 0;

        return knex('comments').insert({

            comment_content,
            user_id,
            downvotes,
            upvotes,
            parent

        }).then(function(){
            console.log("insering done in store.js");
            return knex('comments').max('comment_id').then(function(ret){

                console.log(' max value in store.js ' , ret[0]);
                return ret;

            });
        });

      }

    });
  },



    getComments({parent}){

        console.log("came to store.js for fatching comments, where parent  = " , parent);
        console.log("giong for query");

        return knex.where('comments.parent' , '=' , parent).select('comments.comment_id','comments.user_id','comments.comment_content','user.username','comments.upvotes' , 'comments.downvotes').from('comments').leftJoin('user','comments.user_id','user.id').then(function(resTable){
            console.log("size of table " , resTable.length);

            for(var i = 0 ; i < resTable.length ; i++){
                console.log(resTable[i]);
            }

            return resTable;

        });

    },

    getDownVoteEntry({userId,commentId}){

        console.log(" in the getting downvote entry " , userId , " " , commentId);
        return knex('downvotes').where('comment_id' , '=' , commentId).where('user_id' ,'=' , userId).then(function(res){
            return res;
        });

    },

    removeDownVote({userId,commentId}) {

        console.log(" came to remove downvote ", userId, " ", commentId);
        return knex('downvotes').where('comment_id', '=', commentId).where('user_id', '=', userId).del().then(function(){
            return knex('comments').where('comment_id' , '=' , commentId).decrement('downvotes',1);
        });

    },

    addUpvoteEntry({userId,commentId}){

        console.log(" came to add upvote ", userId, " ", commentId);
        console.log(" user id + 10 " , (userId + 10));
        console.log(" comment id + 10 " , (commentId+10));
        return knex('comments').where('comment_id' , '=' , commentId).increment('upvotes',1).then(function(){
            return knex('upvotes').insert({
                comment_id : commentId,
                user_id : userId
            });
        });

    },

    getUpVoteEntry({userId,commentId}){

        console.log(" in the getting upvotes entry in store.js " , userId , " " , commentId);
        return knex('upvotes').where('comment_id' , '=' , commentId).where('user_id' ,'=' , userId).then(function(res){
            return res;
        });

    },

    removeUpVote({userId,commentId}){

        console.log(" came to remove upvote ", userId, " ", commentId);
        console.log(commentId + 10);
        console.log(userId + 10);
        return knex('upvotes').where('comment_id', '=', commentId).where('user_id', '=', userId).del().then(function(){
            return knex('comments').where('comment_id' , '=' , commentId).decrement('upvotes' , 1);
        });

    },

    addDownVoteEntry({userId,commentId}){

        console.log(" came to add upvote ", userId, " ", commentId);
        return knex('downvotes').insert({
            comment_id : commentId,
            user_id : userId
        }).then(function(){
            return knex('comments').where('comment_id' , '=' , commentId).increment('downvotes' , 1);
        });

    }

}
