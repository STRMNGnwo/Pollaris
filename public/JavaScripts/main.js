


 

//this  method is used to update the db fields when a user votes for a poll.
function addVotes(integer,id)//this function should be called when a vote is made and  has to be updated in the database.
{
  console.log("Option being passed in is: "+integer);
  
  
  document.getElementById("option"+integer + id).disabled=true;

 

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


  }
 
function addPoll()//used to upload the poll
{
    var http=new XMLHttpRequest();//creating a new http object 
    
  //get values from html form
  var PollName=document.getElementById('PollName').value;
  var Option1=document.getElementById('Option1').value;
  var Option2=document.getElementById('Option2').value;
  var Option3=document.getElementById('Option3').value;
  var Option4=document.getElementById('Option4').value;
  
  //get current votes for options.Should be 0 when poll is created.
  var VotesFor1=0;
  var VotesFor2=0;
  var VotesFor3=0;
  var VotesFor4=0;

  console.log("Votes for Option 1: "+VotesFor1);
  console.log("Votes for Option 2: "+VotesFor2);
  console.log("Votes for Option 3: "+VotesFor3);
  console.log("Votes for Option 4: "+VotesFor4);

  
  var polldata={ //create a JS Object using collected values.
      //user id to be included 
     name:PollName,
      
      Option1:{
         OptionName: Option1,
         Votes:VotesFor1
      },

      Option2:{
        OptionName: Option2,
        Votes:VotesFor2
     },

     Option3:{
      OptionName: Option3,
      Votes:VotesFor3
   },

   Option4:{
    OptionName: Option4,
    Votes:VotesFor4
    }   

    //function hasVoted()

  }
  console.log(polldata.Option1.OptionName);//just to confirm if data is collected
  console.log(polldata.Option2.Votes);

  http.open('POST','https://us-central1-formsbackendtrial.cloudfunctions.net/savedata');//post to database function url
http.setRequestHeader('Content-Type','application/json'); //used to state that data being sent is in JSON.
http.onreadystatechange = function () {//this is basically a callback
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (http.readyState === DONE) {
    if (http.status === OK)
     {
    //handleClick2();get polls
    } 
    else 
    {
        console.log('Error: ' + http.status); // An error occurred during the request.
         }
    }
};
//document.getElementById('test').innerHTML="name:"+formdata.name+"<br> age:"+formdata.age;//test to check if data is good.

http.send(JSON.stringify(polldata));//sending the data as a JSON string to the database function.


}


function getPolls() 
{
  var http = new XMLHttpRequest();//making a new http object

  http.open('GET','https://us-central1-formsbackendtrial.cloudfunctions.net/getdata') //opening up a new http request to the firebase function

  http.onreadystatechange=function()
  {
      var DONE=4;//readyState 4 means the request is done
      var OK=200;//status 200 means data is returned

      if(http.readyState===DONE)
      {
          console.log("READY");
        if(http.status===OK)//if status is 200 then data is returned
        {
            console.log("GO");
          var outputData=" ";
          
          var recieved=JSON.parse(http.responseText);//convert the recieved data which is a JSON string and then converts it to an array of JSON objects

          for(var i=0;i<recieved.length;i++)
          {
            if(recieved[i].name!=undefined&&(recieved[i].name).trim())//removing all polls with empty data and white spaces only
            {
            outputData+="<br><br>Poll name "+(i+1)+": "+recieved[i].name;
            outputData+="<br>Poll ID:"+recieved[i].id;
            
            //need to figure out a way to dynamically display more options if we implement them.
            
            if((recieved[i].Option1.OptionName.trim())) //removing the options that are empty.Empty strings are falsey so trim removes them.
            outputData+="<br>Option 1: "+recieved[i].Option1.OptionName+"   <button id='option1"+recieved[i].id+"'  onclick=addVotes(1," + "'" + recieved[i].id + "'" + ");>Vote for Option 1</button>" ;
            
            if((recieved[i].Option2.OptionName.trim()))
            outputData+="<br> Option 2:"+recieved[i].Option2.OptionName+"   <button id='option2"+recieved[i].id+"' onclick=addVotes(2," + "'" + recieved[i].id + "'" + ");>Vote for Option 2</button>" ;
            
            if((recieved[i].Option3.OptionName.trim()))//this returns false if string is empty after whitespace is removed
            outputData+="<br> Option 3:"+recieved[i].Option3.OptionName+"   <button  id='option3"+recieved[i].id+"' onclick=addVotes(3," + "'" + recieved[i].id + "'" + ");>Vote for Option 3</button>" ;
            
            if((recieved[i].Option4.OptionName.trim()))
            outputData+="<br> Option 4:"+recieved[i].Option4.OptionName +"   <button id='option4"+recieved[i].id+"' onclick=addVotes(4," + "'" + recieved[i].id + "'" + ");>Vote for Option 4</button>" ;
            
            
            }
            
          }
          document.getElementById("test").innerHTML=outputData; //display the polls retrieved

          console.log(http.responseText);

          


        }//end of inner if statement

      }// end of outer if statement
      else {
          console.log("Error: "+http.status);
         
      }

  }//end of the onreadystatechange

  http.send(null);//send the request to the firebase function


}

function searchPolls(pollIsPublic)
{
   var pollID=document.getElementById("searchPollsBar").value;

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

          var recievedData=JSON.parse(http.responseText); //responseText would be a JSON string so would have to convert into a JSON array using JSON.parse
          
           console.log("Recieved poll data is:"+ recievedData);//display the poll
        }

        else{ //if status is not 200
            
          console.log("Error: "+http.responseText);
        }
      }

      

     } //end of onreadystatechange
     http.send(null);
}


