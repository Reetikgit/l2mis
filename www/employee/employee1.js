// setTimeout(function () {
//   document.getElementById("loading").style.display = "block";
// }, 10);
async function getTotalLeaves() {
  let Dbdata = await getDbCollData("leave");
  let quantity = 0;
  Dbdata.data.map(async (d) => {
    let objData = d.data;
    quantity += parseInt(objData.quantity);
  });
  window.localStorage.setItem("leave_quantity", quantity);
  calculate_data()
}
async function getStatus() {
  let check_login_status = await getDbSubCollData({
    collectionName: "attendance",
    docId: new Date().toUTCString().slice(5, 16),
    subCollName: window.localStorage.getItem("uid"),
    subDocId: window.localStorage.getItem("uid"),
  });

  let status = check_login_status.data;

  if (
    status != undefined &&
    status.punched_times[status.punched_times.length-1].logout_time == undefined
  ) {

    let end = new Date().getTime();
    let start = new Date(status.punched_times[status.punched_times.length-1].tstamp).getTime();
    var difference = end - start; // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    document.getElementById("login").disabled = true;
    document.getElementById("log-off").disabled = false;
    document.getElementById("login").innerHTML = "PUNCHED IN";
    window.localStorage.setItem("working_time", resultInMinutes);
  } else {
    document.getElementById("log-off").disabled = true;
    document.getElementById("login").innerHTML = "PUNCH IN";
    document.getElementById("login").disabled = false;
  }
  cordova.plugins.firebase.messaging.getToken().then(async function (token) {
    let saved_token=JSON.parse(window.localStorage.getItem("data")).fcm_token
   
    if(saved_token==undefined || saved_token ==""){
      let data = {
        fcm_token: token,
      };
  
      let res = await updateDbDoc({
        collectionName: "employee",
        docId: window.localStorage.getItem("uid"),
        dataToUpdate: data,
      });
      await setDbData({
        collectionName: "device_ids",
        docId: window.localStorage.getItem("uid"),
        dataToUpdate: data,
      });
    }else{
      if(saved_token!=token){
        console.log(token)
        console.log(saved_token)
        navigator.notification.beep(2);
        navigator.notification.alert(
          'Please Login Through Your Respective Device!',  // message
          alertDismissed,         // callback
          'Error',            // title
          'Log out'                  // buttonName
        ); 
      }
    }

    function alertDismissed(){
      logout()
    }

  });

  if (
    check_login_status.data != undefined &&
    check_login_status.data.logout_time != undefined
  ) {
    document.getElementById("login").innerHTML = "Punch In";
    document.getElementById("log-off").disabled = true;
    document.getElementById("login").disabled = false;
    return false;
  }
}
let leave_data = window.localStorage.getItem("leave_quantity");
let emp_leaves = window.localStorage.getItem("leaves");
if (leave_data == undefined) {
  getTotalLeaves();
} else {
  calculate_data()
}
setTimeout(function () {
  getStatus();
  getTotalLeaves();
}, 300);


  let working_time = window.localStorage.getItem("working_time")
  if(working_time !=undefined){
    document.getElementById("tot_hour_").innerHTML=working_time+" "+"Min";
    $("#tot_hour_worked").attr("data-percentage", ((working_time*100)/540).toFixed(0));
  }else{

  }
function calculate_data() {
  leave_data = window.localStorage.getItem("leave_quantity");
  emp_leaves = window.localStorage.getItem("leaves");
  let working_time = window.localStorage.getItem("working_time")
  let res=secondsToHms(working_time)
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 60);
    var m = Math.floor(d % 60 );
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " Hr : ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " Min ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay 
  }

  if(working_time !=undefined){
    document.getElementById("tot_hour_").innerHTML=res
    $("#tot_hour_worked").attr("data-percentage", ((working_time*100)/540).toFixed(0));
  }else{

  }

  let remaining_per = (emp_leaves * 100) / leave_data;
  let utilized_per = 100 - remaining_per;
  document.getElementById("remaining_per_data").innerHTML =
    remaining_per.toFixed(1) + " " + "%";
  $("#remaining_per").attr("data-percentage", remaining_per.toFixed(0));
  document.getElementById("utilized_per_data").innerHTML =
    utilized_per.toFixed(1) + " " + "%";
  $("#utilized_per").attr("data-percentage", utilized_per.toFixed(0));

  let leave_types = JSON.parse((JSON.parse(window.localStorage.getItem("data"))).leaves)
  document.getElementById("leave_types").innerHTML=''
  for(let m in leave_types){
    document.getElementById("leave_types").innerHTML+=`
    <h4 class="small font-weight-bold">`+leave_types[m].name+` : <span class="float-right">`+leave_types[m].quantity+`</span></h4>
    <div class="progress_line mb-4">
        <div class="progress-bar bg-danger" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
    </div>

    `
  }
}
