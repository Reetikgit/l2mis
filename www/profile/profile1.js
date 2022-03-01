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
  console.log(data)
  document.getElementById("image").src=data.image
  document.getElementById("name").innerHTML=data.fname +" "+data.lname
  document.getElementById("desig").innerHTML=data.designation
  document.getElementById("email").innerHTML=data.email
  document.getElementById("joining").innerHTML=data.joining_date
  document.getElementById("type").innerHTML=data.emp_type
  document.getElementById("projects").innerHTML=data.projects
  document.getElementById("id").innerHTML="ID-"+" "+data.emp_id
  getManager()
  document.getElementById("manager").innerHTML = window.localStorage.getItem("manager")
  document.getElementById("team_lead").innerHTML = window.localStorage.getItem("lead")
  document.getElementById("leaves").innerHTML=window.localStorage.getItem("leaves") +" "+"days"
  async function getManager(){
    let Dbdata = await getDbCollData("project");
    Dbdata.data.map(async (d) => {
      let objData = d.data;
      if (data.projects && data.projects.includes(objData.name)) {
        document.getElementById("manager").innerHTML = objData.manager
        document.getElementById("team_lead").innerHTML = objData.team_lead
        window.localStorage.setItem("manager",objData.manager)
        window.localStorage.setItem("team_lead",objData.team_lead)  
      }
    });
    let counter=0;
    let leave_arr=JSON.parse(data.leaves);
    for(let i in leave_arr ){
      counter+=parseInt(leave_arr[i].quantity)
    }
    document.getElementById("leaves").innerHTML=counter +" "+"days"
    window.localStorage.setItem("leaves",counter)
  }