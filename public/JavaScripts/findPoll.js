async function pollFinder12345() //this is for getting the polls with or without geolocation using the pollFinder button.
{
  var currentUser= firebase.auth().currentUser;

  
  

  console.log("its working here");
  if(!(navigator.geolocation)) //if the browser supports geolocation
  {
      alert("The browser does not support geolocation, please consider switching to another browser");
      return;
      
  }//end of if statement;

      //console.log("Accessing location");

      //getting the location of the user, if the user does not provide the location, the co-ords are assumed to be 0,0.
  let location = await getPosition().then((position) => 
  {
      return{latitude:position.coords.latitude,longitude:position.coords.longitude}
  }).catch((err)=>
  {
      return{latitude:0,longitude:0}});
if(currentUser != null)
{
  
  var userID=currentUser.uid;
  console.log(userID);
      var http = new XMLHttpRequest();

      http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/getdata"+"?latitude="+location.latitude+"&longitude="+location.longitude+"&userID="+userID)

      http.onreadystatechange=function(){
          
          var DONE=4;
          var OK=200;

          if(http.readyState===DONE)
          {
              if(http.status===OK)
              {
                //console.log(http.responseText);
                var recievedPoll= JSON.parse(http.responseText);
                console.log(recievedPoll);
                var noo = recievedPoll.numberOfOptions;
                var z = new Date();
                
                display = "";
                
                display += ("<div class=\"my_custom_container_pollFinder\" style=\"width:118%;\">");
                display += ("<div class=\"wrapper\">");
                display += ("<header id=\"headerwrap\">" +recievedPoll.pollName+ "</header>");
                display += ("<div class=\"poll-area\">");

                var totalVotes = 0;
                var n=1;
                while(n <= noo)
                {
                  if(n == 1)
                  {
                      var k= 1;
                      while(k<= noo)
                      {
                          totalVotes+=recievedPoll["option"+String(k)].vote;
                          k++;
                      }
                      
                  }
                  if(recievedPoll["option"+String(n)]!=undefined)
                  {
                    display += ("<label style=\"background-color:white; position:relative; right:7%;\" onclick=\"addVotes('"+n+"','"+recievedPoll.pollID+"','"+recievedPoll.isPrivate+"');\">");
                    display += ("<div class=\"row\">");
                    display += ("<div class=\"column\">");
                    display += ("<span class=\"text\">" +recievedPoll["option"+String(n)].content+ "</span>");
                    display += ("<span class=\"circle20\"></span>");
                    display += ("</div>");
                    display += ("<span class=\"percent1\">" +recievedPoll["option"+String(n)].vote+ "</span>");
                    display += ("</div>");
                    display += ("<div class=\"progress\" style=\"--w:"+((recievedPoll["option"+String(n)].vote)/(totalVotes)*100)+"\"></div>");
                    display += ("</label>");
                    n++;
                  }
                }

                display += ("</div>");
                display += ("<div class=\"vote_container\">");
                display += ("<div class\"row\">");
                display += ("<div class=\"col-sm-auto\">");
                display += ("<p style=\"position:relative; font-size: 10px;\">Votes: "+totalVotes+"</p></div>");
                display += ("<div class=\"col-sm-auto\">");
                display += ("<p style=\"position:relative; font-size: 10px;\">Expiry: "+(Math.ceil(((((recievedPoll.expiryTime)/60)/60))-((((z.getTime())/1000)/60)/60)))+" hrs</p></div></div></div>");
                display += ("<p style=\"font-size: 15px;\">Poll ID: "+recievedPoll.pollID+ "</p></div></div>");
              
                document.getElementById("displayPollFinderResults").innerHTML=display;

                const options = document.querySelectorAll("label");
                for (let i = 0; i < options.length; i++) 
                {
                    options[i].addEventListener("click", ()=>
                    {
                        for (let j = 0; j < options.length; j++) 
                        {
                            if(options[j].classList.contains("selected"))
                            {
                                options[j].classList.remove("selected");
                            }
                        }

                        options[i].classList.add("selected");
                        for (let k = 0; k < options.length; k++) 
                        {
                            options[k].classList.add("selectall");
                        }
                    });
                }
              }
              else if(http.status==204)
              {
                  document.getElementById('noNearbyPolls').style.display = "";
                  document.getElementById("displayPollFinderResults").remove();

              }
          }

      }//end of onreadystatechange
      http.send(null);
}

}
        
        let getPosition = function() 
            {
              console.log("geo is working");
                return new Promise(function (resolve, reject) 
            {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            }); 
          }
        

function addVotes(integer,id,isPriv,creatorUserID)//this function should be called when a vote is made and  has to be updated in the database.
{
  var currentUser= firebase.auth().currentUser;
var userid=currentUser.uid;

console.log("Option being passed in is: "+integer);

//document.getElementById("option"+integer + id).disabled=true;
  var option;
  if(isPriv == 'false'){
      option={  //delete this to revert
      value:integer,
      userID:userid,
      pollID:id,
      isPrivate: isPriv
      };
  }
  if(isPriv == 'true')
  {
      option={  //delete this to revert
      value:integer,
      userID:userid,
      pollID:id,
      isPrivate: isPriv,
      creatorUserID:creatorUserID
      };
  }

console.log("Adding the vote");

var http= new XMLHttpRequest();

http.open("PUT","https://us-central1-formsbackendtrial.cloudfunctions.net/updateVotes") //appending  query string to url

http.setRequestHeader("Content-Type","application/json");

http.onreadystatechange=function(){
  
  var DONE = 4; // readyState 4 means the request is done.
  var OK = 200; // status 200 is a successful return.
  if (http.readyState === DONE) {
  if (http.status === OK)
    {
    toastr.success("Voted!")
  } 
  else 
  {
      toastr.error("Already voted for this poll!"); // An error occurred during the request.
        }
  }
  };

  http.send(JSON.stringify(option));//need to figure out a way to send the Option as part of the request body. Then If its recieved properly by firebase function it can be used to generalise the vote incrementation
  
  console.log(http.responseText);


}