
 //let auth=firebase.auth();
 
function showPassword()
{
var show=document.getElementById("password");

if(show.type==="password")
{
    show.type="text";
}

else{
    show.type="password";
}

}
function signUp()
{
  var user;
    //var validUserDetails=true;
  var firstHttp= new XMLHttpRequest();
   var http= new XMLHttpRequest();
   var whttp=new XMLHttpRequest();
   //details needed by firebase to create a user
    var email=document.getElementById("Email").value;
    var password=document.getElementById("password").value;
  
    //additional details to be displayed on profile page
    var userName= document.getElementById("UserName").value;
    var name = document.getElementById("Name").value;
    var userBio=document.getElementById("userBio").value;
    
    if(userName.trim()==false){ toastr.error("Please enter a valid username"); console.log("Error:username field was empty"); return;}
    if(name.trim()==false){ toastr.error("Please enter your name"); console.log("Error:name field was empty"); return;}
    if(email.trim()==false){ toastr.error("Please enter your email"); console.log("Error:email field was empty"); return;}
    if(password.trim()==false){ toastr.error("Please enter a password"); console.log("Error:password field was empty"); return;}
    if(userBio.trim()==false){ toastr.error("Please enter a Bio"); console.log("Error:bio field was empty"); return;}

    console.log("Name:"+userName+" name:"+name+" bio:"+userBio);
     
    var userNameObject={
      username:userName
    } //this is to be sent to the checkUsername Function
    firstHttp.open("POST","https://us-central1-formsbackendtrial.cloudfunctions.net/checkUsername");
    firstHttp.setRequestHeader("Content-Type","application/json");

    firstHttp.send(JSON.stringify(userNameObject)); //sending the username object to the firebase function to check if it is unique


    firstHttp.onreadystatechange=function(){
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.

      if(firstHttp.readyState===DONE)
      {
        if(firstHttp.status===OK) // this should only be true if the username is unique. status 403 is sent if username is not unique.
        {
          console.log("Username is unique");

          firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {      
            // Signed in          
              var user = userCredential.user;          
                console.log(user.uid);    
                let Friends=[];
                var userObject={
                  name:name,
                  username:userName,
                  userBio:userBio,
                  ID:user.uid,
                  Friends:Friends

            
                } //end of user object
                
                user.updateProfile({
                  displayName: userName,
                  
                }).then(function() {
                  console.log("User displayName is : "+user.displayName );
                  // Update successful.
                }).catch(function(error) {
                  // An error happened.
                });
                http.open("POST","https://us-central1-formsbackendtrial.cloudfunctions.net/addUser");
                http.setRequestHeader("Content-Type","application/json");
                http.send(JSON.stringify(userObject));
                
                console.log(http.responseText);
               // window.location.replace("./profile.html");
               toastr.success("Account Created, Login!")
                // ...  
                
                 }).catch((error) => {      
                    var errorCode = error.code;        
                  var errorMessage = error.message;          
                  toastr.error("Invalid Email/Weak Password - Min 6 Characters");        
                 });

                 console.log(http.responseText);

                 //send a welcome notification
                 
        }//end of inner if
        else
        toastr.error("Username is taken, Be original!")
      }//end of outer if

      


    }//end of ready state change

    
    } //end of signUp function
    
    

