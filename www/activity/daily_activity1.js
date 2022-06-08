let idss = [];
var global_data;
var interval;
let counter = 0;
let int_counter = 0;
let global_login_time;
let global_Day;

async function getActivity() {
  let month = new Date().toString().split(" ")[1];
  let year = new Date().toString().split(" ")[3];
  let id = window.localStorage.getItem("uid");
  let local_arr = [];
  let local_dates = [];
  let index = 0;
  let color = "primary";
  let display_type = "none";
  document.getElementById("month_name").innerHTML = month;
  showData();
  function showData() {
    let todays_date = new Date()
      .toString()
      .split(/\s/)
      .join("")
      .split(":")[0]
      .slice(0, -2);
    let stored_Data = JSON.parse(window.localStorage.getItem("activity"));
    if (stored_Data) {
      document.getElementById("activitys_backup").innerHTML = "";
      for (let i in stored_Data) {
        let val = stored_Data[i];
        let total_Work_hour = 0;
        let day = val.punched_times[0].tstamp.split(" ")[2];
        
        let tstamp = val.punched_times[val.punched_times.length - 1].tstamp;
        for (let k in val.punched_times) {
          if (stored_Data.status && stored_Data.status == "adjusted") {
            display_type = "block";
          }
          if (
            tstamp.split(":")[0].slice(0, -2).split(/\s/).join("") !=
            todays_date
          ) {
            color = "danger";
           
          }
          if (
            tstamp.split(":")[0].slice(0, -2).split(/\s/).join("") ==
            todays_date
          ) {
            color = "primary";
          }
          if (val.punched_times[k].total_Work_hour) {
            total_Work_hour += val.punched_times[k].total_Work_hour;
            
            color = "primary";
          } else {
            total_Work_hour = "N.A";
          }
        }
        if(total_Work_hour!="N.A"){
          total_Work_hour+=" hr"
        }

        document.getElementById("activitys_backup").innerHTML +=
          `
          <div class="list-item " data-id="19">
          <div>
            <a href="#" data-abc="true"
              ><span class="w-48 avatar gd-warning" style="font-size:11px"
                >` +
          day +
          " " +
          month +
          `</span
              ></a>
          </div>
          <div class="flex ">
            <div class="item-except text-muted text-sm " style="font-size:11px">
              Total Work Hour : ` +
          total_Work_hour +
          ` 
            </div>
            <div class="item-except text-muted text-sm " style="font-size:11px">
              Total Punch : ` +
          val.punched_times.length +
          `
            </div>
          </div>
          
          <div class="no-wrap">
            <div
              class="item-date text-muted text-sm d-md-block"
            >
              <button class="btn btn-` +
          color +
          `" style="font-size:10px;margin-left:55%;color:white;" onclick=showAdjustDialog("` +
          tstamp.split(/\s/).join("") +
          `","`+tstamp.split(/\s/).join("*")+`")>View</button>
            </div>
          </div>
        </div>
        
          `;
        document.getElementById("loading").style.display = "none";
      }
    }
    document.getElementById("activitys").innerHTML =
      document.getElementById("activitys_backup").innerHTML;
  }
  let database_counter = 31;
  for (let day = 1; day <= 31; day++) {
    database_counter--;
    if (day < 10) {
      day = "0" + day;
    }
    let date1 = day + " " + month + " " + year;
    // if (!local_dates.includes(day)) {
    let res = await db
      .collection("attendance")
      .doc(date1)
      .collection(id)
      .doc(id)
      .get();
    document.getElementById("counters").innerHTML =
      "Refreshing in " + database_counter + "";
    if (res.data()) {
      let tstamp =
        res.data().punched_times[res.data().punched_times.length - 1].tstamp;
      counter = 1;
      let display_type = "none";
      local_arr.push(res.data());
      window.localStorage.setItem("activity", JSON.stringify(local_arr));
      document.getElementById("loading").style.display = "none";
      let total_Work_hour = 0;

      for (let k in res.data().punched_times) {
        total_Work_hour += res.data().punched_times[k].total_Work_hour;
      }
      if (res.data().status && res.data().status == "adjusted") {
        display_type = "block";
      }
    }

    //}
  }
  showData();
  document.getElementById("counters").innerHTML = "";
  if (counter == 0) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("activitys_backup").innerHTML =
      "No activity found ! Use daily signin to create a activity . ";
  }
}
setTimeout(function () {
  document.getElementById("loading").style.display = "block";
  getActivity();
}, 200);
var tot_hour_ = 0;
var global_date;
async function showAdjustDialog(tstamp,tstamp_2) {
  global_Day=tstamp_2;
  document.getElementById("add_button").innerHTML = `
  <button
          type="button"
          class="btn btn-danger"
          data-mdb-dismiss="modal"
          onclick="closeDialog()"
        >
          Close
        </button>
  `;
  idss = [];
  let data = JSON.parse(window.localStorage.getItem("activity"));
  for (let i in data) {
    let l_tstamp =
      data[i].punched_times[data[i].punched_times.length - 1].tstamp;
    if (l_tstamp.split(/\s/).join("") == tstamp) {
      let val = data[i];
      global_data = val;
      global_date = l_tstamp;
      document.getElementById("dialog_adjust-message").innerHTML = "";
      document.getElementById("dialog_adjust-label").innerHTML = "Activity";
      for (let k in global_data.punched_times) {
        let val = global_data;
        let log_out_time;
        let login_tstamp= val.punched_times[k].tstamp;
        let login_time = val.punched_times[k].tstamp.split(" ")[4];
        let tot_work_hour = val.punched_times[k].total_Work_hour;

        if (tot_work_hour == undefined) {
          tot_work_hour = "Active";
        }
        if (val.punched_times[k].logout_time == undefined) {
          log_out_time = "Active";
        } else {
          log_out_time = val.punched_times[k].logout_time.split(" ")[4];
        }
        if (val.punched_times[k].total_Work_hour == undefined) {
          val.punched_times[k].total_Work_hour = "Active";
        }

        let t_b_p = val.punched_times[k].time_between_projects;
        let details = "";
        for (let l in t_b_p) {
          details +=
            t_b_p[l].project + " - " + t_b_p[l].hour_spent + " Hr." + "<br>";
        }

        document.getElementById("dialog_adjust-message").innerHTML +=
          `
        
        <h6 style="float:right;font-size:13px;">Punch No. :` +
          ++k +
          `</h6>
      <h6>Login-Time :` +
          login_time +
          `</h6>
      <h6 >Logout-Time :` +
          log_out_time +
          `</h6>
      <h6>Total Time spent :` +
          tot_work_hour +
          ` Hours</h6>
      
        <button type="button" class="collapsible">Detailed View</button>
        <div class="content">
          <p id="detailed_view" style="font-size:12px">` +
          details +
          `</p>
        </div>
         <hr/>

      </div>`;
     
        if (log_out_time == "Active") {
          document.getElementById("add_button").innerHTML +=
            `
                <button
                type="button"
                class="btn btn-secondary"
                data-mdb-dismiss="modal"
                onclick=old_punch_out_func("` +
            tstamp +
            `","`+login_time+`")
              >
                Punch Out
              </button>
        `;
        }
        let todays = new Date()
        .toString()
        .split(/\s/)
        .join("")
        .split(":")[0]
        .slice(0, -2);
      
   
        $("#dialog_adjust").modal("show");

        var coll = document.getElementsByClassName("collapsible");
        var j;

        for (j = 0; j < coll.length; j++) {
          coll[j].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            }
          });
        }
      }
    }
  }
}
async function getStatus() {
  let check_login_status = await getDbSubCollData({
    collectionName: "attendance",
    docId: new Date().toUTCString().slice(5, 16),
    subCollName: window.localStorage.getItem("uid"),
    subDocId: window.localStorage.getItem("uid"),
  });
}
function old_punch_out_func(tstamp,login_time) {
  global_login_time=login_time
  let todays = new Date()
    .toString()
    .split(/\s/)
    .join("")
    .split(":")[0]
    .slice(0, -2);
  console.log(tstamp + "--" + todays);
  if (tstamp.split(":")[0].slice(0, -2) == todays) {
    //Today's Punch Out
    $("#dialog_adjust").modal("hide");
    displayDialog();
  } else {
    //Previous day punch out
    $("#dialog_adjust").modal("hide");
    document.getElementById("dialog_logout_time_header").innerHTML="Choose Logout Time"
    document.getElementById("dialog_logout_message").innerHTML=`
    <div
    class="wrap-input100 validate-input"
    data-validate=""
  >
    <span class="label-input100">Select Logout Time</span>
    <input
      class="input100"
      type="time"
     
      id="logout_times"
      placeholder="Logout time"
      required
    />

    <span class="focus-input100 fas fa-business-time" style="margin: 3%;color: green;"></span>
  </div>
    `
    $("#dialog_logout_time").modal("show");
 
    
  }
}
function goToPunchOut(){
  
  let day1= global_Day.split("*")[2]+" "+global_Day.split("*")[1]+" "+global_Day.split("*")[3]
  
  let logout_time=document.getElementById("logout_times").value
  if(parseInt(logout_time.split(":")[0])-parseInt(global_login_time.split(":")[0])>0){
    $("#dialog_logout_time").modal("hide");
    displayDialog(global_login_time,logout_time,day1);
  }else{
    alert("Invalid Logout Time")
    
  }
 
}
// async function adjust() {
//   let date =global_date
//   let projects = [];
//   let counter = 0;
//   console.log(activity_data_arr)
//   for (let i in activity_data_arr) {
//     if (
//       parseInt(
//         document.getElementById(activity_data_arr[i].name + "_" + i).value
//       ) > 0
//     ) {
//       counter += parseInt(
//         document.getElementById(activity_data_arr[i].name + "_" + i).value
//       );
//       let obj = {
//         project: activity_data_arr[i].name,
//         hour_spent: parseInt(
//           document.getElementById(activity_data_arr[i].name + "_" + i).value
//         ),
//       };
//       projects.push(obj);
//     }
//   }
//   console.log(counter+"-"+tot_hour_)

//     console.log(projects);
//     let data = {
//       time_between_projects_adjusted: projects,
//       total_Work_hour_adjusted: counter,
//       adjusted_date: date,
//       id: window.localStorage.getItem("uid"),
//       fcm_token : JSON.parse(window.localStorage.getItem("data")).fcm_token
//     };
//     let res = await setDbData({
//       collectionName: "timesheet_adjustment",
//       docId: window.localStorage.getItem("uid"),
//       dataToUpdate: data,
//     }).then(function () {
//       document.getElementById("error_msg2").style.display = "block";
//       document.getElementById("error_msg2").innerHTML =
//         "✔️ Requested for adjustment ";
//       document.getElementById("error_msg2").style.color = "green";
//       setTimeout(function () {
//         $("#dialog_adjust").modal("hide");
//       }, 2500);
//     });

// }
