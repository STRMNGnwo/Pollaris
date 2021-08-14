
function searchToggle(obj, evt)
{
    var container = $(obj).closest('.search-wrapper');
        if(!container.hasClass('active'))
        {
            container.addClass('active');
            evt.preventDefault();
        }
        else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
            container.removeClass('active');
            container.find('.search-input').val('');
        }
}   

function ani()
{
  document.getElementById('all-trans').style.display = "";
  document.getElementById('all-circle').style.display = "";
  document.getElementById('all-circle1').style.display = "";
}

function openTab(evt, state) 
{
  var i, inviteBox, button;
  inviteBox = document.getElementsByClassName("inviteBox");
  for (i = 0; i < inviteBox.length; i++) 
  {
    inviteBox[i].style.display = "none";
  }
  button = document.getElementsByClassName("button");
  for (i = 0; i < button.length; i++) 
  {
    button[i].className = button[i].className.replace(" active", "");
  }
  document.getElementById(state).style.display = "block";
  evt.currentTarget.className += " active";
  
}

