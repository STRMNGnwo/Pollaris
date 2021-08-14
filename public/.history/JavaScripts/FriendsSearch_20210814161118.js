var sendToid = "";
var userid = "";

function friendsSearch()
{
    var currentUser=firebase.auth().currentUser;

    userid=currentUser.uid;

    var searchName=document.getElementById("SearchFriendsBar").value; //value of the name typed in the search bar
    console.log("Value typed in:"+searchName);
    var person={
        username:searchName
    }
    console.log("Username is: "+person.username);
    var http= new XMLHttpRequest();
    http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/friends-searchUsers"+"?username="+searchName);
    http.onreadystatechange=function()
    {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        
        if(http.readyState===DONE)
        {
            if(http.status===OK)
            {
                var display = "";
                
                console.log(http.responseText);
                var results=JSON.parse(http.responseText);
                for(var i=0;i<results.length;i++)  // loop would only execute once.
                {
                    //TODO:Include a conditional statement that displays button next to searched user name only if user is not friends with them already.Might need to iterate through the friends list of the returned user and check if currentUser. uID is mentioned there
                    
                    display += "<div class=\"custom_container5\">";
                    display += "<div class=\"row\">";
                    display += "<div class=\"col-sm-3\">";
                    display += "<img src=\"https://cdn.evrimagaci.org/FkeYqtuZ3IJCucKXY91lERcvayQ=/evrimagaci.org%2Fpublic%2Fcontent_media%2F4cbf161a7825c782fb3316e01b5d1f87.jpg\">";
                    display += "</div>";
                    display += "<div class=\"col-sm-6\">";
                    display += "<br><p class=\"username3\" style=\"font-size: 15px;\">Username: " +results[i].name +"</p></div>";
                    display += "<div class=\"col-sm-auto\">";
                    sendToid = results[i].ID;//this is to get the id of the user who's gonna recieve the request
                }
                 
                var checkhttp = new XMLHttpRequest();
                var userID=userid;
                var checkID=sendToid;
                checkhttp.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/friends-checkFriends"+"?userID="+userID+"&checkID="+checkID);

                checkhttp.send(null);
                checkhttp.onreadystatechange = function()
                {
                    var DONE = 4;
                    var OK = 200;
                    if(checkhttp.readyState===DONE)
                    {
                        if(checkhttp.status===OK)
                            var res = checkhttp.responseText;
                            if(res == "true")
                            {
                                console.log("friends already");
                                
                                //display += "<p class=\"submit\" name=\"confirm\" onclick=\"unfriend()\"></p></div></div></div></div></div></div></div></div>";
                                display += "<div button class=\"primaryButton10\" type=\"submit\" onclick=\"unfriend();\">Unfriend</div></div></div></div></div></div></div>";
                                
                            }
                            else
                            {
                                console.log("not friends yet");
                                display += "<div button class=\"primaryButton9\" type=\"submit\" onclick=\"sendFriendRequest();\">Send</div></div></div></div></div></div></div>";
                            }
                        }   
                        document.getElementById("displayResults").innerHTML=display;
                    }
                    
                }
                //document.getElementById("displayResults").innerHTML=display;
            }
            else if(http.status==204)
            {   //server should return with status 204 if the user is not found
                console.log(http.status);
                toastr.error("The user you are searching for does not exist");
            }
        }
    
    http.send(null);
}

function showNotification()
{
    firebase.auth().onAuthStateChanged(function(user) 
    {
        if(user)
        {
            var http = new XMLHttpRequest();
            http.open('GET','https://us-central1-formsbackendtrial.cloudfunctions.net/friends-getNotification'+"?uid="+user.uid);
            http.onreadystatechange = function()
            {
                var OK = 200;
                var DONE = 4;
                if(http.readyState === DONE)
                {
                    if(http.status === OK)
                    {
                        
                        var outText = "";
                        var results = "";
                        console.log(http.responseText);
                        var got = JSON.parse(http.responseText);
                        console.log(got);
                        for(var n = 0; n < got.length; n++)
                        {
                            if(n == 0||n%2 == 0)
                            {
                                outText += ("<div id="+n+" class=\"custom_container1\">");
                                outText += ("<div class=\"row\">");
                                outText += ("<div class=\"col-sm-2\">");
                                outText += ("<img src=\"https://cdn.evrimagaci.org/FkeYqtuZ3IJCucKXY91lERcvayQ=/evrimagaci.org%2Fpublic%2Fcontent_media%2F4cbf161a7825c782fb3316e01b5d1f87.jpg\"></div>");
                                outText += ("<div class=\"col-sm-auto\">");
                                outText += ("<div class=\"username\" style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Username:" +got[n].senderName+"</div>");
                                outText += ("<div class=\"category\" style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Send Date: " +got[n].sendDate+"</div>");
                                outText += ("<div class=\"content\" style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Message: " +got[n].content+"</div></div>");
                                outText += ("<div class=\"col-sm-auto\">");
                                outText += ("<div button class=\"primaryButton1\" type=\"submit\" onclick=\"acceptRequest(" + "'" + got[n].id + "'," + "'" + got[n].senderID + "'," + "'" + user.uid + "','" + n + "');\">Accept</div>");
                                outText += ("<div button class=\"primaryButton1\" style=\"bottom:50px;\" type=\"submit\" onclick=\"denyRequest(" + "'" + got[n].id + "'," + "'" + got[n].senderID + "'," + "'" + user.uid + "','" + n + "');\">Decline</div></div></div></div></div>");
                            }
                            if(n == 1 || n%2 == 1)
                            {
                                results += ("<div id="+n+" class=\"custom_container1\">");
                                results += ("<div class=\"row\">");
                                results += ("<div class=\"col-sm-2\">");
                                results += ("<img src=\"https://cdn.evrimagaci.org/FkeYqtuZ3IJCucKXY91lERcvayQ=/evrimagaci.org%2Fpublic%2Fcontent_media%2F4cbf161a7825c782fb3316e01b5d1f87.jpg\"></div>");
                                results += ("<div class=\"col-sm-auto\">");
                                results += ("<div class=\"username\" style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Username: "+got[n].senderName+"</div>");
                                results += ("<div class=\"category\" style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Send Date: "+got[n].sendDate+"</div>");
                                results += ("<div class=\"content\" style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Message: " +got[n].content+"</div></div>");
                                results += ("<div class=\"col-sm-auto\">");
                                results += ("<div button class=\"primaryButton1\" type=\"submit\" onclick=\"acceptRequest(" + "'" + got[n].id + "'," + "'" + got[n].senderID + "'," + "'" + user.uid + "','" + n + "');\">Accept</div>");
                                results += ("<div button class=\"primaryButton1\" style=\"bottom:50px;\" type=\"submit\" onclick=\"denyRequest(" + "'" + got[n].id + "'," + "'" + got[n].senderID + "'," + "'" + user.uid + "','" + n + "');\">Decline</div></div></div></div></div>");
                            }
                        }
                        document.getElementById('inviteBoxCol1').innerHTML = outText;
                        document.getElementById('inviteBoxCol2').innerHTML = results;
                    }
                    else
                    {
                        document.getElementById('noFriendRequests').style.display = "";
                    }
                }
                
            }
            http.send(null);
        }
    }
    );
}



function sendFriendRequest(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
            userid = user.uid;

            var HTTP = new XMLHttpRequest();
            HTTP.open('PUT','https://us-central1-formsbackendtrial.cloudfunctions.net/friends-createNotification');
            HTTP.setRequestHeader("Content-Type","application/json");
            console.log('sending');

            var currDate = new Date().toISOString();
            var theRequest = {
                uid:sendToid,
                senderID:user.uid,
                senderName:user.displayName,
                sendDate:currDate,
                content:"Hi! I want to be your friend!"
            }

            HTTP.send(JSON.stringify(theRequest));
            HTTP.onreadystatechange = function(){
                var DONE = 4;
                var OK = 200;
                if(HTTP.readyState === DONE)
                {
                    if(HTTP.status === OK)
                    {
                        toastr.success('Friend Request Sent!');
                    }
                    else{
                        toastr.error("Already sent friend request.....creep")
                    }
                }
            }
        } else {
          
        }
    });
}

function acceptRequest(requestID, senderID, recieverID, divID)
{
    var http = new XMLHttpRequest();
    http.open('POST',"https://us-central1-formsbackendtrial.cloudfunctions.net/friends-acceptRequest");
    http.setRequestHeader("Content-Type","application/json");
    var objToSend = 
    {
        requestID:requestID,
        senderID:senderID,
        recieverID:recieverID
    }
    http.send(JSON.stringify(objToSend));
    document.getElementById(divID).remove();
    toastr.success("You're friends now!")
}

function denyRequest(requestID,senderID, recieverID, divID)
  {
    var http = new XMLHttpRequest();
    http.open('POST',"https://us-central1-formsbackendtrial.cloudfunctions.net/friends-denyRequest");
    http.setRequestHeader("Content-Type","application/json");
    var objToSend = {
      senderID:senderID,
      requestID:requestID,
      recieverID:recieverID
    }
    http.send(JSON.stringify(objToSend));
    document.getElementById(divID).remove();
    toastr.success("You've removed a fecker")
}


function showFriends()
{
    var currentUser=firebase.auth().currentUser;

    var userID=currentUser.uid;
    var http=new XMLHttpRequest();

    http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/friends-getMyFriends"+"?uid="+userID);

    http.onreadystatechange=function(){

        var DONE=4;
        var OKAY=200;

        if(http.readyState===DONE)
        {
            if(http.status===OKAY)
            {
                var outText = "";
                var results = "";
                var recievedText=JSON.parse(http.responseText)
                console.log(recievedText);

                for(var n = 0; n < recievedText.length; n++)
                        {
                            if(n == 0||n%2 == 0)
                            {
                                outText += ("<div class=\"custom_container1\">");
                                outText += ("<div class=\"row\">");
                                outText += ("<div class=\"col-sm-2\">");
                                outText += ("<img src=\"https://cdn.evrimagaci.org/FkeYqtuZ3IJCucKXY91lERcvayQ=/evrimagaci.org%2Fpublic%2Fcontent_media%2F4cbf161a7825c782fb3316e01b5d1f87.jpg\"style=\"height:95%\"></div>");
                                outText += ("<div class=\"col-sm-6\">");
                                outText += ("<br><div class=\"username\" id=\"usernameShowFriend\" style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Username: " +recievedText[n].username+"</div></div>");
                                outText += ("<div class=\"col-sm-auto\">");
                                outText += ("<div button class=\"secondaryButton1\" type=\"submit\">Show Profile</div>");
                                outText += ("<div button class=\"secondaryButton1\" onclick=\"onClickEvent("+"'"+recievedText[n].username+"'"+");\" style=\"top:15px;\" type=\"submit\">Chat</div></div></div></div>");
                            }
                            if(n == 1 || n%2 == 1)
                            {
                                results += ("<div class=\"custom_container1\">");
                                results += ("<div class=\"row\">");
                                results += ("<div class=\"col-sm-2\">");
                                results += ("<img src=\"https://cdn.evrimagaci.org/FkeYqtuZ3IJCucKXY91lERcvayQ=/evrimagaci.org%2Fpublic%2Fcontent_media%2F4cbf161a7825c782fb3316e01b5d1f87.jpg\" style=\"height:95%\"></div>");
                                results += ("<div class=\"col-sm-6\">");
                                results += ("<br><div class=\"username\" id=\"usernameShowFriend\" value=\"\"style=\"position: relative; font-size: 15px; text-align: left; left: 20px;\">Username: " +recievedText[n].username+"</div></div>");
                                results += ("<div class=\"col-sm-auto\">");
                                results += ("<div button class=\"secondaryButton1\" type=\"submit\">Show Profile</div>");
                                results += ("<div button class=\"secondaryButton1\" onclick=\"onClickEvent("+"'"+recievedText[n].username+"'"+");\" style=\"top:15px;\" type=\"submit\">Chat</div></div></div></div>");
                            }
                        }
                        document.getElementById('friendBoxCol1').innerHTML = outText;
                        document.getElementById('friendBoxCol2').innerHTML = results;
            }
            else
            {
                document.getElementById('noFriends').style.display = "";
            }
        }
        
    }

    http.send(null);

}

var DMLocation="";
function onClickEvent(targetUserName)
{
    var uid1 = firebase.auth().currentUser.displayName;
    var uid2 = targetUserName;

    localStorage.setItem("uid1",uid1);
    localStorage.setItem("uid2",uid2);

    //getTargetUserName(targetUserName);
    newPopup();
    //window.location.href='/dmchat.html';

}

function getFriendProfile(username)
{
    var searchName=username;
    console.log(searchName);

    if(searchName!=undefined&&!searchName.trim())
    {
        var http= new XMLHttpRequest();

        http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/friends-getMyFriends"+"?username="+searchName);

        http.onreadystatechange=function(){

            var DONE=4;
            var OK=200;

            if(http.readyState===DONE)
            {
                if(http.readyState===OK)
                {
                    var display="";

                    var recieved=JSON.parse(http.responseText);
                    console.log(recieved);

                }
            }
        };
    }
}

function unfriend()
{
    var currentUser=firebase.auth().currentUser;
    var http= new XMLHttpRequest();
    if(currentUser!=null)
    {
    var objToSend={

        friendID:sendToid,
        uid:currentUser.uid

    }

    http.open("POST","https://us-central1-formsbackendtrial.cloudfunctions.net/friends-unfriend");
     
    http.setRequestHeader("Content-Type","application/json");


    http.send(JSON.stringify(objToSend));
    
    toastr.success("Unfriended!")

}//end of the if statement.
}//end of the unfriend function.