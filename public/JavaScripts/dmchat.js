
// Initiate firebase auth.
function initFirebaseAuth() {
    // Listen to auth state changes.

    firebase.auth().onAuthStateChanged(authStateObserver);

  }
  //https://www.quackit.com/html/codes/html_popup_window_code.cfm
  //pop up window
  var DMLocation=getDMLocation();
function newPopup() {
    popupWindow = window.open('/dmchat.html','popUpWindow','height=700,width=400,left=200,top=200,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
    //getDMLocation(DMLocation);
    //console.log("DMLocation is:"+DMLocation);
}
function getDMLocation(){
    if(typeof(Storage)!=="undefined"){
        var uid1 = localStorage.getItem("uid1");
        var uid2 = localStorage.getItem("uid2");
    }else alert("no local storage");
    console.log("target user name is::"+ uid2);
    console.log("current user name is::"+uid1);
    var path="";
    if (uid1 >= uid2) {
        path = uid1 + uid2;
    }
    else path = uid2 + uid1;
    console.log("get dm location got called");
    return path;
}

var db = firebase.firestore();
// Returns the signed-in user's display name.
function getUserName() {
    console.log("getusername function called");
    return firebase.auth().currentUser.displayName;
}
function getUserEmail(){
    return firebase.auth().currentUser.email;
}
// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}

/*
function getTargetUserName(targetName) {
    console.log("target name is :" + targetName);
    return "Haozhe Ma126";
    //left for later
}
*/
//this function moved to FriendsSearch.js
/*
function getDMLocation() {
    console.log("get dm location got called");
    var uid1 = getUserName();
    var uid2 = "HaozheMa123123";
    var DMLocation = '';
    if (uid1 >= uid2) {
        DMLocation = uid1 + uid2;
    }
    else DMLocation = uid2 + uid1;
   //return "testtest";
}
*/


// Saves a new message on the Cloud Firestore.
function saveMessage(messageText) {
    console.log("save message called");
    // Add a new message entry to the Firebase database.
    return db.collection('messages').doc('PM').collection(getDMLocation()).add({
        name: getUserName(),
        text: messageText,
        email: getUserEmail(),
        //profilePicUrl: getProfilePicUrl(),
        timesent: new Date().getTime(),
        //timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
    });
}


// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
    console.log("load message got called");
      // Reference to the /messages/ database path.
  this.query = db.collection('messages').doc('PM').collection(getDMLocation()).orderBy('timesent','asc');
  // Make sure we remove all previous listeners.
  //this.messagesRef.off();

  query.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        deleteMessage(change.doc.id);
      } else {
        var message = change.doc.data();
        displayMessage(change.doc.id, message.name,message.email,
                      message.text);
      }
    });
  });
}

// Saves the messaging device token to the datastore.
//what does this do??
//removed


// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
    
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (messageInputElement.value && checkSignedInWithMessage()) { 
        saveMessage(messageInputElement.value).then(function () {
            // Clear message text field and re-enable the SEND button.
            resetMaterialTextfield(messageInputElement);
            toggleButton();
        });
    }
   
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
// need onauthstatechange??
function authStateObserver(user) {
    console.log("auth state observer got called");
    if (user) { // User is signed in!
        // Get the signed-in user's  name.
        //var profilePicUrl = getProfilePicUrl();
        var userName = getUserName();
        var userEmail = getUserEmail();
        // Set the user's profile name.
        //userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
        userNameElement.textContent = "Chat participant: "+userName+" and " + localStorage.getItem("uid2");
        console.log("user name is "+ userName);
        //NOTE WE DISPLAY EMAIL FOR NOW 
        // Show user's profile and sign-out button.
        userNameElement.removeAttribute('hidden');
        // userPicElement.removeAttribute('hidden');
        // signOutButtonElement.removeAttribute('hidden');

        // Hide sign-in button.
        // signInButtonElement.setAttribute('hidden', 'true');

        // We save the Firebase Messaging Device token and enable notifications.
       //saveMessagingDeviceToken();
        //IS THIS NEEDED?
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        userNameElement.setAttribute('hidden', 'true');
        console.log("user name is "+ userName);

        //  userPicElement.setAttribute('hidden', 'true');
        //  signOutButtonElement.setAttribute('hidden', 'true');

        // Show sign-in button.
        //signInButtonElement.removeAttribute('hidden');
    }
}

function checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (isUserSignedIn()) {
        return true;
    }

    // Display a message to the user using a Toast.
    var data = {
        message: 'You must sign-in first',
        timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}


// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
    '<div class="name"></div>' +
    //'<div class="email"></div>'+
    '<div class="spacing"></div>' +
    '<div class="message"></div>' +

    '</div>';

// Delete a Message from the UI.
function deleteMessage(id) {
    var div = document.getElementById(id);
    // If an element for that message exists we delete it.
    if (div) {
        div.parentNode.removeChild(div);
    }
}

/*
function createAndInsertMessage(id, timestamp) {
    const container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    const div = container.firstChild;
    div.setAttribute('id', id);
    // If timestamp is null, assume we've gotten a brand new message.
    // https://stackoverflow.com/a/47781432/4816918
    timestamp = timestamp ? timestamp.toMillis() : Date.now();
    console.log("time"+timestamp);
    div.setAttribute('timestamp', timestamp);
    // figure out where to insert new message
    const existingMessages = messageListElement.children;
    if (existingMessages.length === 0) {
        messageListElement.appendChild(div);
    } else {
        let messageListNode = existingMessages[0];
        while (messageListNode) {
            const messageListNodeTime = messageListNode.getAttribute('timestamp');
            if (!messageListNodeTime) {
                throw new Error(
                    `Child ${messageListNode.id} has no 'timestamp' attribute`
                );
            }
            if (messageListNodeTime > timestamp) {
                break;
            }
            messageListNode = messageListNode.nextSibling;
        }
        messageListElement.insertBefore(div, messageListNode);
    }
    return div;
}
*/

// Displays a Message in the UI.
/*
function displayMessage(id, timestamp, name, text) {
    var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);
    // profile picture
    //if (picUrl) {
    //  div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
    // }
    div.querySelector('.name').textContent = name;
    var messageElement = div.querySelector('.message');
    if (text) { // If the message is text.
        messageElement.textContent = text;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }
    // Show the card fading-in and scroll to view the new message.
    setTimeout(function () { div.classList.add('visible') }, 1);
    messageListElement.scrollTop = messageListElement.scrollHeight;
    messageInputElement.focus();
}
*/
function displayMessage(id, name,email, text) {
    var div = document.getElementById(id);
// If an element for that message does not exists yet we create it.
if (!div) {
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', id);
    this.messageListElement.appendChild(div);
  }
  div.querySelector('.name').textContent = name;
  //div.querySelector('.email').textContent = email;

  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } 
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageListElement.scrollTop = this.messageListElement.scrollHeight;
  this.messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
    if (messageInputElement.value) {
        submitButtonElement.removeAttribute('disabled');
    } else {
        submitButtonElement.setAttribute('disabled', 'true');
    }
}



// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
    }
}


checkSetup();


// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
//var imageButtonElement = document.getElementById('submitImage');
//var imageFormElement = document.getElementById('image-form');
//var mediaCaptureElement = document.getElementById('mediaCapture');
//var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
//var signInButtonElement = document.getElementById('sign-in');
//var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar')

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
//signOutButtonElement.addEventListener('click', signOut);
//signInButtonElement.addEventListener('click', signIn);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

initFirebaseAuth();
loadMessages();