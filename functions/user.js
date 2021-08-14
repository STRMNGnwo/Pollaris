
const functions = require('firebase-functions');
const admin= require('firebase-admin');
const cors = require('cors')({origin: "https://www.pollaris.ie"});

//admin.initializeApp();

exports.addUser=functions.https.onRequest((request,response) => {
 
    cors(request,response, () => {
  
      var user=request.body; //request body has an user object.
      console.log("Request body:",request.body);
      console.log("User ID in the firebase function is: "+user.ID);
  
        
      admin.firestore().collection("users").doc(user.ID).set(request.body).then( () => { //set is used instead of add so a id can be specified manually
        response.send("User added to database");
        
      });
    }); //end of cors
  }); //end of addUser function


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