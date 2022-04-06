$(function() {
    $('.toggle-btn').click(function() {
      $('.filter-btn').toggleClass('open');
  
    });
  
    $('.filter-btn a').click(function() {
      $('.filter-btn').removeClass('open');
  
    });
  
  });
  
  $('#all').click(function() {
  
    $('ul.tasks li').slideDown(300);
  
  });
  
  $('#one').click(function() {
    $('.tasks li:not(.one)').slideUp(300, function() {
      $('.one').slideDown(300);
  
    });
  });
  
  $('#two').click(function() {
    $('.tasks li:not(.two)').slideUp(300, function() {
      $('.two').slideDown(300);
  
    });
  });
  $('#three').click(function() {
    $('.tasks li:not(.three)').slideUp(300, function() {
      $('.three').slideDown(300);
  
    });
  });

  let data =JSON.parse(window.localStorage.getItem("data"))
  let reportsTo=[];
  for(let i in data.reportsTo){
    reportsTo.push(data.reportsTo[i].split("_")[0])
  }
  document.getElementById("image").src=data.image
  document.getElementById("name").innerHTML=data.fname +" "+data.lname
  document.getElementById("desig").innerHTML=data.designation
  document.getElementById("email").innerHTML=data.email
  document.getElementById("joining").innerHTML=data.joining_date
  document.getElementById("type").innerHTML=data.emp_type
  document.getElementById("id").innerHTML="ID-"+" "+data.emp_id
  document.getElementById("team_lead").innerHTML = reportsTo
  window.localStorage.setItem("lead",reportsTo)  
  document.getElementById("team_lead").innerHTML = window.localStorage.getItem("lead")
  // document.getElementById("leaves").innerHTML=window.localStorage.getItem("leaves") +" "+"days"
 