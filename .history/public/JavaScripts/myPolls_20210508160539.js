function showPrivatePolls()
{
       var currentUser=firebase.auth().currentUser;
 var userID=currentUser.uid;

 if(currentUser!=null)
 {
  var http= new XMLHttpRequest();

  http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/getMyPrivatePolls"+"?uid="+userID);
  
  http.onreadystatechange=function(){

  var DONE=4;
  var OKAY=200;

  if(http.readyState==DONE)
  {
      if(http.status==OKAY)
        {
          //var display="";
          console.log(http.responseText);
          var pollData=JSON.parse(http.responseText);
          outPage = "<br>";
        
        
          for(var i=0;i<pollData.length;i++)
          {
                console.log(pollData[i]);
                var pollname = pollData[i].pollName;
                var pollID = pollData[i].pollID;
                
                var noo = pollData[i].numberOfOptions;
                
                outPage += ("<br><div class=\"my_custom_container\" style=\"width:450px;\">");
                outPage += ("<div class=\"wrapper\">");
                outPage += ("<header id=\"headerwrap\">" +pollname+ "</header>");
                outPage += ("<div class=\"poll-area\">");
                var totalVotes = 0;
                var n =1 ;
                
                while(n <= noo)
                {
                    if(n == 1)
                    {
                        var k= 1;
                        while(k<= noo)
                        {
                            totalVotes+=pollData[i]["option"+String(k)].vote;
                            k++;
                        }
                        
                    }
                    //var option = ["option"+String(n)+".content"]
                    
                    
                    //console.log(PollData[i].[option+String(n)].content)
                    
                    if(pollData[i]["option"+String(n)]!=undefined && pollData[i].option1.content.trim() ){
                        
                        outPage += ("<label style=\"background-color:white; position:relative; right:7%;\">");
                        outPage += ("<div class=\"row\">");
                        outPage += ("<div class=\"column\">");
                        outPage += ("<span class=\"text\">" +pollData[i]["option"+String(n)].content+ "</span>");
                        outPage += ("</div>");
                        outPage += ("<span class=\"percent\">" +pollData[i]["option"+String(n)].vote+ "</span>");
                        outPage += ("</div>");
                        outPage += ("<div class=\"progress\" style=\"--w:"+((pollData[i]["option"+String(n)].vote)/(totalVotes)*100)+"\"></div>");
                        outPage += ("</label>");
                        n++;
                    }
                }
                outPage += ("</div>");
                outPage += ("<div id=\"paraID\" style=\"font-size: 15px;\">Poll ID: </div>");
                outPage += ("<div style=\"font-weight: bold; font-size: 20px;\">"+pollID+"</div>")
                outPage += ("</div>");
                outPage += ("</div>");
                
            }
            document.getElementById("privatePollbox").innerHTML = outPage;
         
                
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
            document.getElementById('noPollPrivate').style.display = "";
        }
    }
  }//end of onreadystatechange.

  http.send(null);
 }

}

function showPublicPolls() //used to show public polls
{

    var currentUser=firebase.auth().currentUser;
    var userID=currentUser.uid;

    if(currentUser!=null)
    {
        var http= new XMLHttpRequest();

        http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/getMyPublicPolls"+"?uid="+userID);

        http.onreadystatechange=function()
        {
            var DONE=4;
            var OK=200;

            if(http.readyState===DONE)
            {
                if(http.status===OK)
                {
                    console.log(http.responseText);
                    var pollData=JSON.parse(http.responseText);
                    outPage = "<br>";
        
                    for(var i=0;i<pollData.length;i++)
                    {
                        console.log(pollData[i]);
                        var pollname = pollData[i].pollName;
                        var pollID = pollData[i].pollID;
                        
                        var noo = pollData[i].numberOfOptions;

                        outPage += ("<br><div class=\"my_custom_container\" style=\"width:400px;\">");
                        outPage += ("<div class=\"wrapper\">");
                        outPage += ("<header id=\"headerwrap\">" +pollname+ "</header>");
                        outPage += ("<div class=\"poll-area\">");
                        var totalVotes = 0;
                        var n =1 ;
                        
                        while(n <= noo)
                        {
                            if(n == 1)
                            {
                                var k= 1;
                                while(k<= noo)
                                {
                                    totalVotes+=pollData[i]["option"+String(k)].vote;
                                    k++;
                                }
                                
                            }
                            //var option = ["option"+String(n)+".content"]
                            
                            
                            //console.log(PollData[i].[option+String(n)].content)
                            
                            if(pollData[i]["option"+String(n)]!=undefined && pollData[i].option1.content.trim() ){
                                
                                outPage += ("<label style=\"background-color:white; position:relative; right:7%;\">");
                                outPage += ("<div class=\"row\">");
                                outPage += ("<div class=\"column\">");
                                outPage += ("<span class=\"text\">" +pollData[i]["option"+String(n)].content+ "</span>");
                                
                                outPage += ("</div>");
                                outPage += ("<span class=\"percent\">" +pollData[i]["option"+String(n)].vote+ "</span>");
                                outPage += ("</div>");
                                outPage += ("<div class=\"progress\" style=\"--w:"+((pollData[i]["option"+String(n)].vote)/(totalVotes)*100)+"\"></div>");
                                outPage += ("</label>");
                                n++;
                                
                            }
                        }
                        outPage += ("</div>");
                        outPage += ("<div id=\"paraID\" style=\"font-size: 15px;\">Poll ID: </div>");
                        outPage += ("<div style=\"font-weight: bold; font-size: 20px;\">"+pollID+"</div>")
                        outPage += ("</div>");
                        outPage += ("</div>");
                        
                    }
                    document.getElementById("publicPollBox").innerHTML = outPage;
                    
                            
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
                    document.getElementById('noPollPublic').style.display = "";
                }
            }
        }//end of onreadystatechange.
        http.send(null);
    }
}


function searchPolls(pollIsPublic)
{
   var pollID=document.getElementById("pollIDArea").value;

   var currentUser=firebase.auth().currentUser;
    var http= new XMLHttpRequest();
     var publicPoll= pollIsPublic;

     var privatePollQueryString="?pollid="+pollID+"&"+"requesterid="+currentUser.uid;
     
     console.log(privatePollQueryString);

     console.log("searching for polls");
     console.log("Is it a public poll?: "+publicPoll);

     if(publicPoll===true) // triple equals is used to ensure that the variables have the same values and same datatype.
     {
        
       http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/searchPublicPolls"+"?pollid="+pollID) //params for query string should be poll id and current user id.

     }

     else if(publicPoll===false)
     {
       console.log("Searching for poll");
      http.open("GET","https://us-central1-formsbackendtrial.cloudfunctions.net/searchPrivatePolls"+privatePollQueryString) //params for query string should be poll id and current user id.
     }

     http.onreadystatechange=function(){
        
      if(http.readyState===4)
      {
        if(http.status===200)
        {
            console.log("HTTP Response recieved");
            var display="";
            var outPage =""
            var recievedData=JSON.parse(http.responseText); //responseText would be a JSON string so would have to convert into a JSON array using JSON.parse
            var d = new Date();
            var z = new Date();
            console.log(recievedData);//display the poll

            for(var i=0;i<recievedData.length;i++)
            {
                console.log(recievedData[i]);
                var pollname = recievedData[i].pollName;
                var pollID = recievedData[i].pollID;
                var noo = recievedData[i].numberOfOptions;
                
                if(recievedData[i].isPrivate == false)
                {
                    
                    outPage += ("<div class=\"my_custom_container\" style=\"width:400px; position:relative; left:150px; background-color:rgb(235, 247, 130);\">");
                    outPage += ("<div class=\"wrapper\" style=\"background-color:rgb(235, 247, 130);\">");
                    outPage += ("<header id=\"headerwrap\">" +pollname+ "</header>");
                    outPage += ("<div class=\"poll-area\">");
                    var totalVotes = 0;
                    var n =1 ;
                    
                    
                    while(n <= noo)
                    {
                        if(n == 1)
                        {
                            var k= 1;
                            while(k<= noo)
                            {
                                totalVotes+=recievedData[i]["option"+String(k)].vote;
                                k++;
                            }
                            
                        }
                        
                        if(recievedData[i]["option"+String(n)]!=undefined){
                            
                            
                            outPage += ("<label style=\"background-color:white; position:relative; right:7%;\" onclick=\"addVotes('"+n+"','"+ pollID+"','"+recievedData[i].isPrivate+"');\">");
                            outPage += ("<div class=\"row\">");
                            outPage += ("<div class=\"column\">");
                            outPage += ("<span class=\"text\">" +recievedData[i]["option"+String(n)].content+ "</span>");
                            
                            outPage += ("<span class=\"circle\"></span>");
                            outPage += ("</div>");
                            outPage += ("<span class=\"percent\" style=\"\">" +recievedData[i]["option"+String(n)].vote+ "</span>");
                            outPage += ("</div>");
                            outPage += ("<div class=\"progress\" style=\"--w:"+((recievedData[i]["option"+String(n)].vote)/(totalVotes)*100)+"\"></div>");
                            outPage += ("</label>");
                            n++;
                            
                        }
                    }
                    outPage += ("</div>");
                    outPage += ("<div class=\"vote_container\">");
                    outPage += ("<div class\"row\">");
                    outPage += ("<div class=\"col-sm-auto\">");
                    outPage += ("<p style=\"position:relative; font-size: 10px;\">Votes: "+totalVotes+"</p></div>");
                    outPage += ("<div class=\"col-sm-auto\">");
                    outPage += ("<p style=\"position:relative; font-size: 10px;\">Expiry: "+(Math.ceil(((((recievedData[i].expiryTime)/60)/60))-((((z.getTime())/1000)/60)/60)))+" hrs</p></div></div></div>");
                    outPage += ("<p style=\"font-size: 15px;\">Poll ID: "+pollID+ "</p></div></div>");
                }
                if(recievedData[i].isPrivate == true)
                {
                    display += ("<div class=\"my_custom_container\" style=\"width:400px; position:relative; left:150px; background-color:rgb(235, 247, 130);\">");
                    display += ("<div class=\"wrapper\" style=\"background-color:rgb(235, 247, 130);\">");
                    display += ("<header id=\"headerwrap\">" +pollname+ "</header>");
                    display += ("<div class=\"poll-area\">");
                    var totalVotes = 0;
                    var n =1 ;
                    
                    while(n <= noo)
                    {
                        if(n == 1)
                        {
                            var k= 1;
                            while(k<= noo)
                            {
                                totalVotes+=recievedData[i]["option"+String(k)].vote;
                                k++;
                            }
                            
                        }
                        
                        if(recievedData[i]["option"+String(n)]!=undefined){
                            
                            display += ("<label style=\"background-color:white; position:relative; right:7%;\" onclick=\"addVotes('"+n+"','"+ pollID+"','"+recievedData[i].isPrivate+"','"+recievedData[i].userID+"');\">");
                            display += ("<div class=\"row\">");
                            display += ("<div class=\"column\">");
                            display += ("<span class=\"text\">" +recievedData[i]["option"+String(n)].content+ "</span>");
                            display += ("<span class=\"circle\"></span>");
                            display += ("</div>");
                            display += ("<span class=\"percent\">" +recievedData[i]["option"+String(n)].vote+ "</span>");
                            display += ("</div>");
                            display += ("<div class=\"progress\" style=\"--w:"+((recievedData[i]["option"+String(n)].vote)/(totalVotes)*100)+"\"></div>");
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
                    display += ("<p style=\"position:relative; font-size: 10px;\">Expiry: "+(Math.ceil(((((recievedData[i].expiryTime)/60)/60))-((((d.getTime())/1000)/60)/60)))+"</p></div></div></div>");
                    display += ("<p style=\"font-size: 15px;\">Poll ID: "+pollID+ "</p></div></div>");
                }   
            }
            
            document.getElementById("publicFriendsPollBox").innerHTML = outPage;
            document.getElementById("privateFriendsPollBox").innerHTML = display;

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
        else{ //if status is not 200
          console.log("Error: "+http.responseText);
        }
      }
     } //end of onreadystatechange
     http.send(null);
}

//Public
 //vhlqyAirS7zy3UlvyghM

 //Private
 //r34We5brkZvvJvsXNdq8


 /*function addVotes(integer,id)//this function should be called when a vote is made and  has to be updated in the database.
{
    console.log("Option being passed in is: "+integer);
    
    var option={  //delete this to revert
        value:integer
    };
    console.log("Adding the vote");
    
    var http= new XMLHttpRequest();

    http.open("PUT","https://us-central1-formsbackendtrial.cloudfunctions.net/updateVotes"+"?id="+id) //appending  query string to url

    http.setRequestHeader("Content-Type","application/json");

    http.onreadystatechange=function(){
        
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (http.readyState === DONE) {
        if (http.status === OK)
        {
        // nothing
        } 
        else 
        {
            console.log('Error: ' + http.status); // An error occurred during the request.
            }
        }
    };

    http.send(JSON.stringify(option));//need to figure out a way to send the Option as part of the request body. Then If its recieved properly by firebase function it can be used to generalise the vote incrementation
    
    console.log(http.responseText);
}*/

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