function signUpFunc(){
    let email = document.getElementById('login').value
    let password = document.getElementById('password').value

    firebase.auth().createUserWithEmailAndPassword(userName,email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    window.location.href = "friends.html"
    console.log(user);
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    if(errorCode == 'auth/email-already-in-use')
    {
        alert('email-already-in-use.');
    }
    // ..
    console.log(errorMessage, errorCode);
  });

}

function loginFunc(){
    let email = document.getElementById('login').value
    let password = document.getElementById('password').value

    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    window.location.href = "friends.html"
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}
