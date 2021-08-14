 function showProfile()
{
    
   console.log("Show Profile");
        
      
               //TODO:have a call to a firebase function that returns user data which can be used to populate the profile page
        
             firebase.auth().onAuthStateChanged((user)=>
             {
               if(user.emailVerified!=false)
               {
                 if(user)
                 {
                     var currentUser=firebase.auth().currentUser;

                     var id=currentUser.uid;
                     console.log("USER ID IS: "+id);
                    var http= new XMLHttpRequest();
                    http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/user-getProfileData"+"?id="+id);
      
                    http.onreadystatechange=function(){
                    
                      var DONE=4;
                      var OKAY=200;
      
                      if(http.readyState===DONE)
                      {
                          if(http.status===OKAY)
                          {
                              var profileData=JSON.parse(http.responseText);
                              console.log("Display Name is: "+currentUser.displayName);
                              document.getElementById("changeNameBar").innerHTML = profileData.name;
                              console.log("User name: "+profileData.username);
                              console.log("Name: "+profileData.name);
                              console.log("Friends: "+profileData.Friends);
                              console.log("User Bio: "+profileData.userBio);
                              document.getElementById("changeBioBar").innerHTML = profileData.userBio;

                              document.getElementById("user_Name").innerHTML = "@" + profileData.username;
                              document.getElementById("display_Name").innerHTML = profileData.name;
                          }
                      }

                    }//end of onreadystatechange
                    http.send(null);
                }

              }

               

             })//end of onAuthStateChanged
              

             
        
        
    }//end of showProfile function.
      
     
    
function updateProfile()
{
    //var allowedCharacters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@1234567890"

    var currentUser=firebase.auth().currentUser;
    var userID=currentUser.uid;
    console.log("User data being updated for: "+userID);

  var newName=document.getElementById("changeNameBar").value;
  var newBio=document.getElementById("changeBioBar").value;

   var http=new XMLHttpRequest();
  //if newName is not empty and newBio is not empty then send a post request to the backend and update the fields.
   
  if((newName.trim() && newName!=undefined && newName!=null) &&(newBio.trim() && newBio!=undefined && newBio!=null))
  {
     // console.log("Updating Name and Bio using a Http request");
      
    http.open("POST","https://us-central1-formsbackendtrial.cloudfunctions.net/user-updateProfile");
    http.setRequestHeader("Content-Type","application/json");
    var updateName={
        name:newName,
        uid:userID,
        userBio:newBio
    };

    http.send(JSON.stringify(updateName));
  }

  else if(newName.trim() && newName!=undefined && newName!=null)
  {
      //console.log("Updating Name using a HTTP request");
    http.open("POST","https://us-central1-formsbackendtrial.cloudfunctions.net/user-updateProfile");
    http.setRequestHeader("Content-Type","application/json");
    var updateName={
        name:newName,
        uid:userID,
        userBio:""
    };

    http.send(JSON.stringify(updateName));

  }

  else if(newBio.trim() && newBio!=undefined && newBio!=null)
  {
     // console.log("Updating Bio using a HTTP request");
    http.open("POST","https://us-central1-formsbackendtrial.cloudfunctions.net/user-updateProfile");
    http.setRequestHeader("Content-Type","application/json");
    var updateBio={
        userBio:newBio,
        uid:userID,
        name:""
    };

    http.send(JSON.stringify(updateBio));
    
  }

}






 