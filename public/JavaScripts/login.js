

function login()
    {
        var email=document.getElementById("email").value;
        var password= document.getElementById("password").value;

        if(email.trim()==false){ toastr.error("We didn't create an email address field for the laugh"); console.log("Error:username field was empty"); return;}
        if(password.trim()==false){ toastr.error("How did you forget to enter your password?"); console.log("Error:password field was empty"); return;}

        //have to add auth state persistence here and enclose the sign in methods within it.

        firebase.auth().signInWithEmailAndPassword(email,password).then((userCredential)=> {   
            // Signed in    
            user = userCredential.user;    // ... 
           // currentUser=userCredential.user;
            //console.log("User is"+user); 
            //alert("User email is:"+user.email);
            document.cookie="accessToken="+user.za; //user.za is the access token and is stored in a cookie.
   
            window.location.replace("secure.html") ; 
           })
           .catch((error) => {   
                var errorCode = error.code;    
                var errorMessage = error.message; 
   
                toastr.error("Incorrect Email or Password, Have another shot!");
                }); 

    }// end of login function


    function loginWithGoogle() //not redirecting properly , will need to fix
    {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithRedirect(provider).then(()=>{

            console.log("Redirecting.....");

            //waiting for redirect to happen
            firebase.auth()
            .getRedirectResult()
            .then((result) => {
                if (result.credential) {
                    /** @type {firebase.auth.OAuthCredential} */
                    var credential = result.credential;
        
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = credential.accessToken;
                    //console.log(token);
                    // ...
                }
                // The signed-in user info.
                var user = result.user;
                if (user) {
                    //user is signed in 
                    console.log("user is signed in with google");
                    console.log(user);
                    document.cookie = "accessToken=" + user.za; //user.za is the access token and is stored in a cookie.
                    window.location.replace("./index.html");
                } else {
                    console.log("user not signed in yet");
                }
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });//end of redirect function
        })//end of sign in with redirect function
        

    }

    function logout()
    {
        firebase.auth().signOut().then(()=>{
            
            var token=getCookie("accessToken"); //gets the user token
            console.log(document.cookie);
            
            
        document.cookie = "accessToken="+token+"; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; //this deletes a cookie. Probably solved the login bypass issue.
            console.log("Signing out");
            window.location.replace("sign_in.html"); //redirects back to the signup page
            toastr.error("You have been signed out")

            //console.log(document.cookie);
        }
        )
    }

    function logout2()
    {
        firebase.auth().signOut().then(()=>{

            var token=getCookie("accessToken"); //gets the user token
            console.log(document.cookie);


        document.cookie = "accessToken="+token+"; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; //this deletes a cookie. Probably solved the login bypass issue.
            console.log("Signing out");
        });

    }

    function sendResetPasswordEmail()
    {
        var email=document.getElementById("resetPasswordEmail").value;

        firebase.auth().sendPasswordResetEmail(email,{url:'http://localhost:5000/sign_in.html'}).then(()=>{ //URL REDIRECTS AFTER PASSWORD IS RESET

            toastr.success("An email has been sent to "+email);
        
        }).catch(function(error) {
            // An error happened.
            toastr.error("Please enter your Email Address");
          });

    }

    
