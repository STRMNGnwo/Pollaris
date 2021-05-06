
function verification() //checking if access token is valid and belongs to the current user.
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://us-central1-formsbackendtrial.cloudfunctions.net/authorizedendpoint');

// Track the state changes of the request.
    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                console.log("authorised user");
                var decodedToken = xhr.responseText; //this should return a decoded token which can be used to access stuff like email and if it is verified.
                window.location.replace("./createAPoll.html");
                //console.log("Decoded ID Token:"+xhr.responseText);
                //return  decodedToken;
            }
            else 
            {
                console.log("Unauthorized to view this content");
    
                console.log('Error: ' + xhr.status); // An error occurred during the request.
                  
               
                window.location.replace("./404.html");
            }
        }
    };
    // Set the Authorization header. The Firebase function checks if the header is of type "Authorization"
    xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('accessToken')) //sending the cookie which has the auth token from Firebase, to the Firebase function.
    xhr.send(null);
}

// used to retrieve the cookies.
function getCookie(cname) { //returns a cookie.
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";

}
var counter=0;

 async function checkVerifiedEmail()
{  
   //TODO: onAuthStateChanged skips for the first time(too slow to fire and as a result the default case is returned always)
     
   var emailVerified=false;
   await firebase.auth().onAuthStateChanged(function(user) {
        //if (user) {
          // User is signed in.
        
          var currentUser=user;
        // var currentUser=firebase.auth().currentUser;
          
          if (currentUser != null) {
            //console.log("Current user is: "+JSON.stringify(currentUser) );

            if(currentUser.emailVerified==false)
            {
                console.log("Email not verified, sending verification email");
                currentUser.sendEmailVerification().then(()=>
                {
                    console.log("Email verification sent to: "+currentUser.email);
                  
                    //return false;
                });
                
            }
            else{
                console.log("Email verified by the function");
                 emailVerified=true;
                  //return true;
                 }
        }
        //}//end of outer if
         else {
             console.log("User not found while checking for email");
             
             
             //return false;
          // No user is signed in.
        }
      }); 

    
       //counter+=1;
      console.log(counter);
      console.log("skipped");

      return emailVerified;
          
}

//checkLoggedIn is called from the profile page and redirects users back to the login page if they are not logged in properly.
async function checkLoggedIn() //function that is used to check if the user is logged in properly when accessing other parts of the site.
{
    const verifiedEmail= await checkVerifiedEmail();

    //console.log("Email verified? :"+verifiedEmail );


    console.log("Checking if logged in");
    var token=getCookie('accessToken');
    //console.log(token);    

    
    
    if(token==null||token==undefined||token.trim()==false) //if token does not exist
    {
        window.location.replace("./sign_in.html"); // redirect to the login page if accessToken cookie is empty
    }
    

    
    firebase.auth().onAuthStateChanged(function(user){
        
        var currentUser=user;
        //console.log(currentUser.za);

    if(currentUser!=null) //check for token validity while the currentUser
    {
        //console.log(currentUser);
    if(currentUser.za==token) //if firebase token assigned to user on login, matches token from cookie jar
    {
        //maybe add a call to another method that populates the user profile page with data
        console.log("logged in");
        console.log(window.location.pathname);

        if(currentUser.emailVerified==false)
        {
            
            alert("You don't seem to have a verified email. A verification email has been sent to the email you provided.");

            window.location.replace("quarantined.html");
        }

        
        else if (currentUser.emailVerified==true)
        {

        if(window.location.pathname=="/profile.html")
        {

      showProfile(); //this function also checks if they have a verified email, if they don't either don't show their info or redirect them to another page and send them a verification email
        }

        //the below if statement is a workaround as verifiedEmail always seems to be false here. But if the email is verified
        //the currentUser.verifiedEmail would be true, so redirection to quarantine zone will not happen.

       

        else if(window.location.pathname=="/myPolls.html")
        {
            showPrivatePolls();
            showPublicPolls();
        }

        else if(window.location.pathname=="/friends.html")
        {  
           // showProfile();
           showFriends();
        }

        else if(window.location.pathname=="/index.html")
        {
            updatePage();
        }

    
    }
    else if(currentUser.za!=token){
    console.log("Not logged in. Redirecting....")
      logout();
    //window.location.replace("./login.html");
    }

}//end of null check

    }
}) ; //end of auth state changed.

    
}


//checkLoggedIn2 is called from the login page and redirects users to the profile page if they are logged in.
function checkLoggedIn2() //function that is used to check if the user is logged in properly when accessing other parts of the site.
{
    console.log("Checking if logged in");
    var token=getCookie('accessToken');
    console.log(token); 
       
    
    if(token==null||token==undefined||token.trim()==false) //if token does not exist
    {
         //don't have to do anything for now.
    }
    
    
    
    firebase.auth().onAuthStateChanged(function(user){
        
        var currentUser=user;
        console.log(currentUser.za);

    if(currentUser!=null) //check for token validity while the currentUser
    {
    
        //console.log(currentUser);
    if(currentUser.za==token) //if firebase token assigned to user on login, matches token from cookie jar
    {
        //maybe add a call to another method that populates the user profile page with data
        console.log("logged in");
        window.location.replace("./profile.html");
        showProfile(); //this function also checks if they have a verified email, if they don't either don't show their info or redirect them to another page and send them a verification email
    }

    else if(currentUser.za!=token){
    
        //maybe do something if we are implementing token expiry after a certain period of time.
      //don't need to redirect or log out as this function exists solely for the purpose of sending a previously logged in user to the profile page.
    
    }

}//end of null check

}) ; //end of auth state changed.

    
}






