
const functions = require('firebase-functions');
const admin= require('firebase-admin');
//const cors = require('cors')({origin: "https://www.pollaris.ie"});
//const auth=firebase.auth();

admin.initializeApp();

const user=require("./user.js");
const polls=require("./polls.js");
const friends=require("./friends.js");
const login=require("./login.js");

exports.user=user;
exports.polls=polls;
exports.friends=friends;
exports.login=login;


/*exports.addUser=functions.https.onRequest((request,response) => {
 
  cors(request,response, () => {

    var user=request.body; //request body has an user object.
    console.log("Request body:",request.body);
    console.log("User ID in the firebase function is: "+user.ID);

      
     
    admin.firestore().collection("users").doc(user.ID).set(request.body).then( () => { //set is used instead of add so a id can be specified manually
      response.send("User added to database");
      
    });
  }); //end of cors
}); //end of addUser function



exports.addPoll=functions.https.onRequest((request,response)=>{
  

  cors(request,response,()=>{
     

    const currentTime=admin.firestore.Timestamp.now();

    console.log(currentTime.seconds);
    var endTime=(currentTime.seconds+86400);

    

    console.log(endTime);
      
    var userID=request.body.userID;
     var isPrivate=request.body.isPrivate;
     
     console.log(userID);
     console.log(isPrivate);

     if(isPrivate==true)
     {
       console.log("Private poll");
       admin.firestore().collection("users").doc(String(userID)).collection("privatepolls").add(request.body).then((docRef)=>{
        

        docRef.update({pollID:docRef.id,votesRecievedFrom:[],createTime:currentTime,expiryTime:endTime});

        var objectToSend={
          message:"Poll successfully added:",
          pollID:docRef.id
        }
        response.send(objectToSend);
       }).catch((error)=>{

        console.log("Error: "+error);
       })
     }

     else if(isPrivate==false)
     {
       console.log("Public poll");
       admin.firestore().collection("polls").add(request.body).then((docRef)=>{

        docRef.update({pollID:docRef.id,votesRecievedFrom:[],createTime:currentTime,expiryTime:endTime});
       
        var objectToSend={
          message:"Poll successfully added:",
          pollID:docRef.id
        }
        response.send(objectToSend);
        
       }).catch((error)=>{
         console.log("Error: "+error);
       })
     }
   

  })//end of cors
})



exports.getdata=functions.https.onRequest((request,response)=>{ //this gets polls based on geoLocation

  console.log("Getting data:");

 cors(request,response,()=>{
    
  console.log("Getting the nearest polls!");
    let myData=[];
    
     var pollsRef= admin.firestore().collection("polls");

     //this is the user's co-ordinates.
     var userLatitude= parseFloat(request.query.latitude);
     var userLongitude= parseFloat(request.query.longitude);
     var userID=request.query.userID;
     
     console.log(userID);
     console.log(userLatitude);
     console.log(userLongitude);

  
    /* var maxLatitude=Number.parseFloat(userLatitude).toPrecision(3);
     var maxLongitude= Number.parseFloat(userLongitude).toPrecision(3);*/

     
     /*

     if(userLatitude==0 && userLongitude==0)
     {
       let randomPolls=[];
       pollsRef.where("location.latitude","==",userLatitude).where("location.longitude","==",userLongitude).get().then((querySnapshot)=>{
        
        if(querySnapshot.empty)
        {
          response.status(204).send("This is awkward, but it seems that a poll has not been made or it cannot be retrieved.");
        }

        querySnapshot.forEach((doc)=>{

           var temporaryDoc=doc.data();
             temporaryDoc.userID="SECRET";

             var currentTime= admin.firestore.Timestamp.now();

             if(temporaryDoc.expiryTime<currentTime.seconds)
             {
               temporaryDoc.expired=true;
             
               admin.firestore().collection("polls").doc(String(temporaryDoc.pollID)).update({expired:true})
             }

             if(temporaryDoc.expired!=true){

              if(!(temporaryDoc.votesRecievedFrom.includes(String(userID)) )  )    
              {
                randomPolls.push(temporaryDoc);
              }                           

               //randomPolls.push(temporaryDoc);
             
              }

        })

        var length= randomPolls.length;

        if(randomPolls.length==0)
          {
            response.status(204).send("This is awkward, but there doesn't seem to be any polls in your area!, please spread the word about the webapp and get your friends to use it");
          }
         
          else{
        var indexToSend=  Math.round((length * Math.random()) - 0.5);

        console.log("The index sent is: ");
        console.log(indexToSend);

        console.log(randomPolls[indexToSend]);

        response.send(randomPolls[indexToSend]);
          }

       })//end of query
     }//end of the if statement

     else{
      var maxLatitude= Number.parseFloat(userLatitude)+0.0200000;
      var maxLongitude= Number.parseFloat(userLongitude)+0.0300000;
 
      var minLatitude= Number.parseFloat(userLatitude)-0.0200000;
      var minLongitude=Number.parseFloat(userLongitude)-0.0300000;
 
      console.log(maxLatitude);
      console.log(maxLongitude);
 
      console.log(minLatitude);
      console.log(minLongitude);

      pollsRef.where("location.latitude",">=",minLatitude).where("location.latitude","<=",maxLatitude).get().then((querySnapshot)=>{

    
        if(querySnapshot.empty)
        {
          response.status(204).send("This is awkward, but there doesn't seem to be any polls in your area!, please spread the word about the webapp and get your friends to use it");
        }

        else{
          
           var locationPolls=[];
          querySnapshot.forEach((doc)=>{

            var initialDoc=doc.data();

            if(initialDoc.location.longitude>=minLongitude && initialDoc.location.longitude<=maxLongitude)
            {
              var tempDoc=initialDoc;

              tempDoc.location={
                latitude:0,
                longitude:0
              };
              
              
              var currentTime=admin.firestore.Timestamp.now();

              if(currentTime.seconds>tempDoc.expiryTime)
              {
                tempDoc.expired=true;

                admin.firestore().collection("polls").doc(String(tempDoc.pollID)).update({expired:true});
              }

              if(!tempDoc.expired)
              {
                if(!(tempDoc.votesRecievedFrom.includes(String(userID))))
                {
                locationPolls.push(tempDoc);
                }
              }
  
              
            }
               
           

          })//end of forEach

        
              
          var length=locationPolls.length;

          if(locationPolls.length==0)
          {
            response.status(204).send("This is awkward, but there doesn't seem to be any polls in your area!, please spread the word about the webapp and get your friends to use it");
          }

          else{
          var indexToSend= Math.round((length * Math.random()) - 0.5);
           
          console.log(locationPolls[indexToSend]);
          console.log("The index sent is: ");
        console.log(indexToSend);

        
          response.send(locationPolls[indexToSend]);
          }

        }//end of the else statement that executes if querySnapshot has data.
      
      })//end of the query
     
    } //end of the location provided else statement.
     
       
     //for every 100k of latitude increase and decrease, increase longitude by 200k and decrease

 

    })//end of cors
  
  
 })//end of the function





exports.updateVotes=functions.https.onRequest((request,response)=>{
  console.log("Updating");

  //figure out a way to get the user id slash ip and add it to an array of ips. Check said array if ip is present in it they cant vote again.

  console.log(request.body); //should have option value, userID and boolean isPublic

  cors(request,response,async()=>{

     
    //all the code below can only execute if the user has not voted for the poll before. 
    var chosenOption=request.body; //Option is now an object that contains the request body(which should be an object that has a number that corresponds to the option of the poll)

    var option="option"+String(chosenOption.value);
    console.log(option);
    
    if(chosenOption.isPrivate=="false")
    {
      console.log("Public poll");
      const pollsRef= await admin.firestore().collection("polls").doc(String(chosenOption.pollID)).get();

         var tempDoc=pollsRef.data();   
         
         console.log(tempDoc);
         if(tempDoc.votesRecievedFrom.includes(request.body.userID))
         {
           response.status(403).send("You have already voted for this poll. Please try getting another poll.")
           return;
         }

      console.log("Voting for: "+option);
    admin.firestore().collection("polls").doc(chosenOption.pollID).update({
        
      ["option"+String(chosenOption.value)+".vote"]: admin.firestore.FieldValue.increment(1),
       
      votesRecievedFrom: admin.firestore.FieldValue.arrayUnion(String(request.body.userID))
  
    });
     response.send("Voting completed");
   
    }
    else if(chosenOption.isPrivate=="true")
    {
      const privatePollsRef= await admin.firestore().collection("users").doc(String(request.body.creatorUserID)).collection("privatepolls").doc(String(chosenOption.pollID)).get();


      console.log(privatePollsRef.data());

        if(privatePollsRef.exists){


        var tempDoc=privatePollsRef.data();
 
        if(tempDoc.votesRecievedFrom.includes(request.body.userID))
          {
            response.status(403).send("You have already voted for this poll. Please try getting another poll.")
            return;
          }
 
       console.log("Voting for: "+option);

       admin.firestore().collection("users").doc(String(request.body.creatorUserID)).collection("privatepolls").doc(String(chosenOption.pollID)).update({
         ["option"+String(chosenOption.value)+".vote"] : admin.firestore.FieldValue.increment(1),
 
         votesRecievedFrom: admin.firestore.FieldValue.arrayUnion(String(request.body.userID))
       })
            
        response.send("Voting complete");
         
         }
      
       
      
    }
    

  })//end of cors
  

});//end of function

exports.authorizedendpoint = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
  
          console.log('Check if request is authorized with Firebase ID token');
          if ((!request.headers.authorization || !request.headers.authorization.startsWith('Bearer '))) {
              console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
                  'Make sure you authorize your request by providing the following HTTP header:',
                  'Authorization: Bearer <Firebase ID Token>');
              response.status(403).send('Unauthorized');
              return;
          }
          let idToken;
          if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
              console.log('Found "Authorization" header');
              // Read the ID Token from the Authorization header.
              idToken = request.headers.authorization.split('Bearer ')[1];
          } else {
              // No cookie
              response.status(403).send('Unauthorized');
              return;
          }
  
          try {
              const decodedIdToken = admin.auth().verifyIdToken(idToken).then((token) => {
                  console.log('ID Token correctly decoded', token);
                  response.send("Welcome to the secure section " + token);
              });
          } catch (error) {
              console.error('Error while verifying Firebase ID token:', error);
              response.status(403).send('Unauthorized');
              return;
          }
      });//end of cors functions
    
    }) //end of the firebase function
                      

exports.checkUsername=functions.https.onRequest((request,response)=>{
     
      cors(request,response,()=>{
        
        var user=request.body; //getting the userNameObject passed in the request body
        var countSimilarUsernames=0; //counter to check if the entered username is already taken or not.
        var usersRef=admin.firestore().collection("users")

        usersRef.where("username","==",user.username).get().then((querySnapshot) => {//checking if any documents contain the username already
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              countSimilarUsernames+=1;

          })//end of for each

          if(countSimilarUsernames>0) 
        {
        console.log("Username has been taken, please choose another username");
        response.status(403).send("Username has been taken, please choose another username"); //
        }  

        else{
          console.log("Valid username!");
          response.send("Valid username");
        }

      }) // end of query


      });//end of cors 



    });//end of checkUsername function

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



exports.searchPublicPolls=functions.https.onRequest( (request,response)=>{

     cors(request,response,()=>{
        
      var pollID=request.query.pollid;//retrieving the pollID which was passed in as a querystring parameter.

      var pollsRef=admin.firestore().collection("polls"); //reference to the polls collection

     pollsRef.where("pollID","==",pollID).get().then((querySnapshot)=>{

       if(querySnapshot.empty)
       {
         console.log("Poll not found");
         response.status(204).send();
       }

       else{
         let polls=[];
           
        querySnapshot.forEach((doc)=>{

          console.log("Poll Found");

           var tempDoc=doc.data();
          var currentTime=admin.firestore.Timestamp.now();
            if(tempDoc.expiryTime <currentTime)
            {
              console.log("Poll expired");

              admin.firestore().collection("polls").doc(String(pollID)).update({ expired:true});
               tempDoc.expired=true;
            }

            tempDoc.userID="SECRET";
          
          polls.push(tempDoc);
        

        })//end of forEach
         
        response.send(polls);
       }//end of the else statement


     })//end of the query

      

     }) //end of CORS 

    }) //end of searchPublicPolls function.


exports.searchPrivatePolls=functions.https.onRequest((request,response)=>{

    cors(request,response, async ()=>{
      
      var userID= request.query.requesterid; //retrieving the ID of the user requesting the private poll.
      var pollID= request.query.pollid;//retrieving the ID of the poll that is being searched for.

      console.log(userID);
      console.log(pollID);
      
      var friendsList=[];
      var privatePolls=[];
     const doc= await admin.firestore().collection("users").doc(userID).get();

       
         //console.log(doc.Friends);
          //friendsList=JSON.parse(doc.data().Friends); 
          
          console.log(doc.data());
          
          // adding the list of friends of the user to a variable 
          
          var tempDoc=doc.data();
          

          friendsList=tempDoc.Friends;
       
         //console.log(friendsList); //retrieving the list of friends that the requester has

         for(var i=0;i<friendsList.length;i++){

          var privatePollsRef=admin.firestore().collection("users").doc(String(friendsList[i])).collection("privatepolls");

          console.log("Now checking for friend: "+i);
          console.log("Friend "+i+ "is "+String(friendsList[i]));

          const poll= await privatePollsRef.where("pollID","==",pollID).get();
 
              if(poll.empty)
              {
                console.log("Friend "+i+" does not have the queried poll"); 
              }
              
              else{
               console.log("Friend "+i+"has the poll"); 
 
               poll.forEach((doc)=>{

                var temporaryDoc=doc.data();
                
                
          var currentTime=admin.firestore.Timestamp.now();
            
           if(temporaryDoc.expiryTime <currentTime)
            {
              console.log("Poll expired");

              admin.firestore().collection("users").doc(String(friendsList[i])).collection("privatepolls").doc(String(pollID)).update({ expired:true});
               temporaryDoc.expired=true;
            }

             
                  
                 privatePolls.push(temporaryDoc);
                 console.log(privatePolls);
              response.send(privatePolls);
                 
               }) //end of the forEach
                
              }//end of else statement


         }//end of the for loop
         

         
         
     
    })//end of cors

    })//end of searchPrivatePolls function


exports.getMyPrivatePolls=functions.https.onRequest((request,response)=>{
  
    cors(request,response,()=>{
      console.log("Getting user polls");
      
      var pollsCounter=0;
      var myPolls=[];
      var userID=request.query.uid;

      return admin.firestore().collection("users").doc(String(userID)).collection("privatepolls").orderBy("createTime","desc").limit(3).get().then((snapshot)=>{

        if(snapshot.empty)
        {
          console.log("You have no private polls made.")

          response.status(204).send("You have no private polls made. Better get cracking on that");
          return;
        }

        snapshot.forEach((doc)=>{
         
          console.log("Private Poll exists");
          myPolls.push(doc.data());

          pollsCounter+=1;
        
        })//end of forEach

        console.log(pollsCounter);
      response.send(myPolls);
      })//end of the get from database.
       
      
    })//end of cors
    
    }) //end of getMyPrivatePolls

    exports.getMyPublicPolls=functions.https.onRequest((request,response)=>{

       cors(request,response,()=>{

        var userID=request.query.uid;
        console.log(userID);

        var pollsRef=admin.firestore().collection("polls");

        pollsRef.where("userID","==",String(userID) ).orderBy("createTime","desc").limit(3).get().then((querySnapshot)=>{

        if(querySnapshot.empty)
        {
          console.log("No Public Polls made");
          response.status(204).send();
        }

        else{

          var myPublicPolls=[];

          querySnapshot.forEach((doc)=>{

            myPublicPolls.push(doc.data());
          })
            
          response.send(myPublicPolls);
           
        }

        })
       }) // end of cors
    })//end of the getMyPublicPolls function

    
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
   // })
    
    
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


  //function below can get reused for current user and their friends.
exports.getProfileData=functions.https.onRequest((request,response)=>{
     
      cors(request,response,()=>{
        
        var userID=request.query.id;

        admin.firestore().collection("users").doc(userID).get().then((doc)=>{

          if(doc.empty)
          {
            response.status(204).send();
          }
          else
          {
            console.log(doc.data());

            var tempDoc=doc.data();
        
            var userData={
              username:tempDoc.username,
              name:tempDoc.name,
              userBio:tempDoc.userBio
            }

            console.log(userData);


            response.send(userData);

          }

        }) //end of accessing data

      })

    })//end of getProfileData function.

exports.updateProfile=functions.https.onRequest( (request,response)=>{
     
      cors(request,response,()=>{

       var userID=request.body.uid;
       var updateName=request.body.name;
       var updateBio=request.body.userBio;

       

       if(updateName.trim())
       {
        console.log(updateName);
        admin.firestore().collection("users").doc(String(userID)).update({
          name:updateName
        }).then(()=>{
          console.log("Name updated");
         
        })
       }

       if(updateBio.trim())
       {
        console.log(updateBio);
         admin.firestore().collection("users").doc(String(userID)).update({
           userBio:updateBio
         }).then(()=>{
           console.log("Updated User bio")
           
         })
       }

        response.send("Updated Profile!");

      })//end of cors


    })//end of updateProfile.

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

      */

    