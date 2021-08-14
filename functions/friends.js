const functions = require('firebase-functions');
const admin= require('firebase-admin');
const cors = require('cors')({origin: "https://www.pollaris.ie"});

//admin.initializeApp();


exports.searchUsers=functions.https.onRequest((request,response)=>{
     
    cors(request,response,()=>{
      let myData=[];
      var userName=request.query.username; //should contain the object containing the username
      console.log("Searching for: "+userName);
      var usersRef=admin.firestore().collection("users");

       usersRef.where("username","==",userName).get().then( (querySnapshot)=>{ //searching for a particular user document
         
        if(querySnapshot.empty)
        {
          console.log("User not found");
          response.status(204).send("User does not exist");
          return;
        }
        querySnapshot.forEach((doc)=>{

          var tempDoc=doc.data();
          //console.log(doc.data()); 

          var userInfo={
            username:tempDoc.username,
            ID:tempDoc.ID,
            name:tempDoc.name
          };
          
        myData.push(userInfo); //maybe return only name, as opposed to all data about user in their document. Will need to implement this

        })
        //console.log|(myData);
        response.send(myData); //if current username policy if followed, only one user should be returned, so the forEach is unnecessary.
      })//end of query
       
    })//end of cors

  })//end of searchUsers function


exports.acceptRequest = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
      let rb = request.body;
      let senderID = rb.senderID;//this is the id of the one that sends the request
      let recieverID = rb.recieverID;//this is the id of the reciever
      let requestID = rb.requestID;//this is the id of the friend request doc
      admin.firestore().collection('users').doc(String(senderID)).update({
        Friends:admin.firestore.FieldValue.arrayUnion(String(recieverID))
      });
      admin.firestore().collection('users').doc(String(recieverID)).update({
        Friends:admin.firestore.FieldValue.arrayUnion(String(senderID))
      });
      //deleting the document in the notifications subcollection and then deleting the id from the sent notifications.
      admin.firestore().collection('users').doc(String(recieverID)).collection('notifications').doc(String(requestID)).delete().then(() => {

        admin.firestore().collection("users").doc(String(recieverID)).update({
         recievedNotifications:admin.firestore.FieldValue.arrayRemove(String(senderID)) }  );
         
         response.send("Friend request accepted!");
        })//end of the .then in the delete
      })
})


exports.denyRequest = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
      let rb = request.body;
      let senderID=rb.senderID;//this is the id of the sender.
      let recieverID = rb.recieverID;//this is the id of the reciever
      let requestID = rb.requestID;//this is the id of the friend request doc
      admin.firestore().collection('users').doc(String(recieverID)).collection('notifications').doc(String(requestID)).delete().then(() => {
          
        admin.firestore().collection("users").doc(String(recieverID)).update({
          recievedNotifications:admin.firestore.FieldValue.arrayRemove(String(senderID)) }  );

        response.send('Friend request denied.');
      })
    })
  })



exports.unfriend= functions.https.onRequest((request,response)=>{

    cors(request,response,()=>{

      var requestData=request.body;
      var targetID=request.body.friendID;
      var userID=request.body.uid;

      console.log(targetID);
      console.log(userID);

     admin.firestore().collection("users").doc(String(userID)).update({

       Friends: admin.firestore.FieldValue.arrayRemove(String(targetID))
     }).then(()=>{
      
      admin.firestore().collection("users").doc(String(targetID)).update({

        Friends: admin.firestore.FieldValue.arrayRemove(String(userID))
      }).then(()=>{

        response.send("User has been Unfriended :(");
      })
       
     })

    })//end of cors
  }) //end of unfriend



exports.createNotification = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
      let rb = request.body;
      let uid = request.body.uid;
      console.log(rb);
      
      admin.firestore().collection("users").doc(String(uid)).get().then((doc)=>{

       if(!doc.exists)
       {
         response.status(204).send("User not found");
       }

       else{ // if document exits
         var tempDoc=doc.data();
          
         if(tempDoc.recievedNotifications!=undefined)
         {
            if(tempDoc.recievedNotifications.includes(rb.senderID))
            {
              response.status(403).send("Friend request already sent");
            }//end of this if

            else{
              admin.firestore().collection('users').doc(uid).update({recievedNotifications: admin.firestore.FieldValue.arrayUnion(String(rb.senderID))})
              
              admin.firestore().collection('users').doc(uid).collection('notifications').add(rb).then(() => {

                response.send('added notification.');
              })
              
            }//end of the else
         }

         else{ //if recievedNotifications array does not exist, create the array and add the sender id and then add the notification.
              
          admin.firestore().collection('users').doc(uid).update({recievedNotifications: admin.firestore.FieldValue.arrayUnion(String(rb.senderID))})
              

              admin.firestore().collection('users').doc(uid).collection('notifications').add(rb).then(() => {

               
                response.send('added notification subcollection.');
              })
         }//end of this else
       }

      }) //end of initial get
      
  
    })//end of cors
  }); //end of createNotification function



exports.getNotification = functions.https.onRequest((request, response) => {
    cors(request, response, ()=>{
      var uID = request.query.uid;
      var objToSend = [];
      admin.firestore().collection('users').doc(String(uID)).collection('notifications').get().then((snapshot) => {
        if(snapshot.empty)
        {
          console.log('document is empty!');
          response.status(204).send(" You don't have any notifications!");
          return;
        }
        snapshot.forEach((doc) => {
  
         console.log(doc.data());
          var obj={};
          obj.id=doc.id;
          objToSend.push(Object.assign(obj,doc.data()));
  
        })
        console.log(objToSend);
        response.send(objToSend);
      })
    })
  })



exports.getFriendsProfile=functions.https.onRequest((request,response)=>{
     
    cors(request,response,()=>{
      
      var username=request.query.username;

       var usersRef=admin.firestore().collection("users");
        
       usersRef.where("username","==",username).get().then((querySnapshot)=>{

        
        if(querySnapshot.empty)
        {
          response.send("User document does not exist");
        }

        else
        {
          querySnapshot.forEach((doc)=>{

            var tempdoc=doc.data();
          
            var userData={
            username:tempdoc.username,
            name:tempdoc.name,
            userBio:tempdoc.userBio
          };

          response.send(userData);

          })//end of forEach
        
        }

      }) //end of accessing data

    })

  })//end of getFriendsProfile function.




exports.checkFriends = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
      
      let currUser = request.query.userID;
      let checkUser = request.query.checkID;

      console.log(currUser);
      console.log(checkUser);
      admin.firestore().collection("users").doc(String(currUser)).get().then((doc) => {
        let docData = doc.data();

        if(doc.empty)
        {
          response.status(204).send();
        }
        else 
        {
        if(docData.Friends.includes(checkUser))
        {
          response.send("true");
        }
        else 
        {
          response.send("false");
        }

      }//end of else outer
      })//end of getting documents
    })//end of cors
  });


exports.getMyFriends=functions.https.onRequest((request,response)=>{

    cors(request,response,async()=>{
      var Friends=[];//should contain information to be sent to the user about their friends
    
      var FriendsList=[];// this is an empty array to be used later
     var userID=request.query.uid;// this has the user id of the current user
    
    const doc= await admin.firestore().collection("users").doc(String(userID)).get();  //get the document of the current user
    
     if(doc.empty)
     {
       response.status(204).send("Document not found") ;
       return;
      }
    
      var tempDoc=doc.data();//this would contain the data of the current user.
    
      if(tempDoc.Friends==null||tempDoc.Friends==undefined||tempDoc.Friends==[]||tempDoc.Friends.length<=0)
      {
        console.log("You don't have any friends yet. Better get cracking on that");
        response.status(204).send();
        
      }
    
      FriendsList=tempDoc.Friends;//this would contain the uid of the friends
    
      console.log(FriendsList);  //array of user ids of the friends
    
      var FriendsRef=admin.firestore().collection("users");//reference to the users collection
    
    
      for(var i=0;i<FriendsList.length;i++)//iterating through the list of UserIDs in FriendsList
      {
        console.log("Friend "+i+" in the list to be searched is: "+FriendsList[i]);//printing out the userid
    
         
      const FriendsDoc=  await FriendsRef.where("ID","==",String(FriendsList[i])).get(); //searching for a user doc with the same id as the one being passed in
    
           if(FriendsDoc.empty)
           {
             console.log("Document is empty. No Friends");
             response.status(204).send("You do not have any friends");
             
           }
          
           else{
    
            console.log("Friends Found!: ");
    
            FriendsDoc.forEach((doc)=>{
    
              console.log(doc.data()); //print out the friend user document
              var temporaryDoc=doc.data(); //this should have the data of the user who is a friend.
                
              console.log(temporaryDoc.username);
              console.log(temporaryDoc.name);
            
             var FriendObject={
             username:temporaryDoc.username,
             name:temporaryDoc.name
           }
             console.log("The friends object is: ")
             console.log(FriendObject);
    
             Friends.push(FriendObject); 
             console.log("the length of the friends array is: "+Friends.length);
    
             console.log("The Friends array is: ");
             console.log(Friends);
            
             //return Friends;
            
            })//end of forEach
            
        }//end of else statement
    
      }//end of for loop
    
      response.send(Friends);//sending the array of Friends
      
    })//end of cors
    
    })//end of getMyFriends


