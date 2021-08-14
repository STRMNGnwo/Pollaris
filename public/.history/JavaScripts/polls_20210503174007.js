optArr = [{id : 0, content : ""}, {id : 1, content : ""}];
pollName = "";

function updatePage()
{//used to update the page
  var outPage = "<br>";
  for(var n = 0; n < optArr.length; n++)
  {
    //outPage += ("<input type=\"text\" value=\""+(optArr[n].content)+"\" id=\'Option"+ (n) +"\'name=\"Option"+ (n+1) +"\"></input>Option" + (n+1)+"<br>");
    outPage += ("<div class=\"input-group mb-3\"><br>");
    outPage += ("<div class=\"input-group-prepend\" id=\"button-addon3\"><br>");
    outPage += ("</div><br>");
    outPage += ("<input type=\"text\" id=\"Option" + n + "\" class=\"form-control\" placeholder=\"Option " + (n+1) + "\" aria-label=\"Example text with two button addons\" aria-describedby=\"button-addon3\" value=\""+optArr[n].content+"\"><br>");
    outPage += ("<div style=\"width: 15px;\"></div><br>");
    outPage += ("</div>");
  }
  document.getElementById("options").innerHTML = outPage;
}

function clearOpt()
{//used to delete all options
    for(var n = 0; n < optArr.length; n++)
    {
        optArr[n].content = "";
    }
    updatePage();
}

function addOpt()
{//used to add extra options
  saveContent();
  if(optArr.length < 10)
  {
    optArr.push({id : optArr.length, content : ""});
  }
  else
  {
    toastr.error("Reached maximum option limit!");
  }
  updatePage();
}

function deleteOpt()
{//used to delete options
  saveContent();
  if(optArr.length > 2)
  {
    optArr.pop();
  }
  else
  {
    toastr.error('A poll must contain at least 2 options!');
  }
  updatePage();
}

function saveContent()
{
  for(var n = 0; n < optArr.length; n++)
  {
    optArr[n].content = document.getElementById("Option" + n).value;
  }
}

async function addPoll(isPrivate)//used to upload the poll
{
  saveContent();
  var http=new XMLHttpRequest();//creating a new http object 
  
  var nameOFpoll = document.getElementById('PollName').value;//used to store name of the poll
  
  

  var user = firebase.auth().currentUser;

  
  var userLocation;

  var pollInfo;
  if(nameOFpoll.trim() )
  {
     //need to get the location of the poll if the user provides it and if the poll is public.
  
     if(isPrivate==true)
     {
       pollInfo = {pollName:nameOFpoll, userID:user.uid, isPrivate:isPrivate, numberOfOptions:optArr.length,expired:false};
     }
     if(isPrivate==false) //for a public poll
     {
      let location = await getPosition().then((position) => {
        return{latitude:position.coords.latitude,longitude:position.coords.longitude}
      }).catch((err)=>{
        return{latitude:0,longitude:0}});
       

        pollInfo={pollName:nameOFpoll, userID:user.uid, isPrivate:isPrivate, numberOfOptions:optArr.length,location:location,expired:false};
     }//end of the if statement
      
     
     
  //var pollInfo = {pollName:nameOFpoll, userID:user.uid, isPrivate:isPrivate, numberOfOptions:optArr.length};
     

  for(var n = 0; n < optArr.length; n++)
  {
    var name = 'option' + String(n+1);

    if(!optArr[n].content.trim())
    {
        toastr.error("Please make sure your options have content in them");
        return;
    }
    pollInfo = Object.assign({[name] : {'content':optArr[n].content, 'vote':0}}, pollInfo);
  }
  toastr.success("Poll has been created");
  if(user != null)
  {
    
    
        http.open('POST','https://us-central1-formsbackendtrial.cloudfunctions.net/addPoll');//post to database function url
        http.setRequestHeader('Content-Type','application/json'); //used to state that data being sent is in JSON.
        http.send(JSON.stringify(pollInfo));//sending the data as a JSON string to the database function.

        http.onreadystatechange = function () {//this is basically a callback
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (http.readyState === DONE) {
                if (http.status === OK)
                {
                    console.log(http.responseText);
                } 
                else 
                {
                    console.log('Error: ' + http.status); // An error occurred during the request.
                }
            }
        };
  }

}//end of poll name check

else{
    toastr.error("Please enter a name for your poll!");
}

}