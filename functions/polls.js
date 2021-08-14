const functions = require('firebase-functions');
const admin= require('firebase-admin');
const cors = require('cors')({origin: "https://www.pollaris.ie"});

//admin.initializeApp();


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