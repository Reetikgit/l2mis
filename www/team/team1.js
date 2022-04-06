async function getTeam() {
  let id = window.localStorage.getItem("uid");
  let stored_Data = JSON.parse(window.localStorage.getItem("team"));
  if (stored_Data) {
    for (let i in stored_Data) {
      let val = stored_Data[i];
      document.getElementById("teams").innerHTML +=
        `
        <div class="list-item" data-id="19">
        <div>
          <a href="#" data-abc="true"
            ><span class="w-48 avatar gd-warning" style="font-size:11px"
              >` +
        val.fname.substring(0, 1) +
        "" +
        val.lname.substring(0, 1) +
        `</span
            ></a>
        </div>
        <div class="flex">
          <div class="item-except text-muted text-sm " style="font-size:11px">` +
        val.fname +
        " " +
        val.lname +
        `
          </div>
          <a href="tel:` +
        val.phone +
        `"><div class="item-except text-muted text-sm " style="font-size:11px">
          ` +
        val.phone +
        `
          </div></a>
        </div>
        <div class="no-wrap">
          <div
            class="item-date text-muted text-sm d-md-block"
          >
            <button
              class="btn btn-primary"
              style="
                font-size: 8px;
                border-radius: 11px;
                width: 100%;
                height: 30px;
                margin-left: 60%;
               
                "
              onclick=showDialog("` +
        val.uid +
        `")
            >
              Activity
            </button>
          </div>
        </div>
      </div>`;
    }
    document.getElementById("loading").style.display = "none";
  }
  let get_desig_name = await getDbData({
    collectionName: "employee",
    docId: id,
  });
  let team = [];
  let counter = 0;
  let current_data = get_desig_name.data;
  let Dbdata = await getDbCollData("employee");
  document.getElementById("teams").innerHTML = "";
  Dbdata.data.map(async (d) => {
    let objData = d.data;

    if (objData.uid != id) {
      for (let i in objData.reportsTo) {
        if (objData.reportsTo[i].split("_")[1] == id) {
          team.push(objData);
          document.getElementById("teams").innerHTML +=
            `
          <div class="list-item" data-id="19">
          <div>
            <a href="#" data-abc="true"
              ><span class="w-48 avatar gd-warning" style="font-size:11px"
                >` +
            objData.fname.substring(0, 1) +
            "" +
            objData.lname.substring(0, 1) +
            `</span
              ></a>
          </div>
          <div class="flex">
            <div class="item-except text-muted text-sm " style="font-size:11px">` +
            objData.fname +
            " " +
            objData.lname +
            `
            </div>
            <a href="tel:` +
            objData.phone +
            `"><div class="item-except text-muted text-sm " style="font-size:11px">
            ` +
            objData.phone +
            `
            </div></a>
          </div>
          <div class="no-wrap">
            <div
              class="item-date text-muted text-sm d-md-block"
            >
              <button
                class="btn btn-primary"
                style="
                  font-size: 8px;
                  border-radius: 11px;
                  width: 100%;
                  height: 30px;
                  margin-left: 60%;
                 
                  "
                onclick=showDialog("` +
            objData.uid +
            `")
              >
                Activity
              </button>
            </div>
          </div>
        </div>`;
          counter++;
        }
      }
      window.localStorage.setItem("team", JSON.stringify(team));
      document.getElementById("loading").style.display = "none";
    }
  });
  if (counter == 0) {
    document.getElementById("teams").innerHTML =
      "Currently none of the  employee is reporting you ";
  }
}

setTimeout(function () {
  document.getElementById("loading").style.display = "block";
  getTeam();
}, 200);
var tot_hour_ = 0;
var global_date;
async function showDialog(id) {
  document.getElementById("dialog_simple-label").innerHTML = "Loading..";
  document.getElementById("dialog_simple-message").innerHTML = " ";
  let data = JSON.parse(window.localStorage.getItem("team"));
  let counter = 0;
  for (let i in data) {
    document.getElementById("dialog_simple-message").innerHTML = " ";
    if (id) {
      let res1 = await db
        .collection("attendance")
        .doc(new Date().toUTCString().slice(5, 16))
        .collection(id)
        .doc(id)
        .get();
      if (res1.data()) {
        let login_status = "";
        let val = res1.data();
        console.log(val);
        document.getElementById("dialog_simple-label").innerHTML =
          "Punch Status of : " + " " + val.name;

        for (let i in val.punched_times) {
          let log_out_time;
          let login_time = val.punched_times[i].tstamp.split(" ")[4];
          let tot_work_hour = val.punched_times[i].total_Work_hour;

          if (tot_work_hour == undefined) {
            tot_work_hour = "Active";
          }
          if (val.punched_times[i].logout_time == undefined) {
            log_out_time = "Active";
          } else {
            log_out_time = val.punched_times[i].logout_time.split(" ")[4];
          }
          if (val.punched_times[i].total_Work_hour == undefined) {
            val.punched_times[i].total_Work_hour = "Active";
          }
          console.log(val.punched_times[i])
          let t_b_p=val.punched_times[i].time_between_projects
          let details=""
          for(let k in t_b_p){
            details+=t_b_p[k].project +" - "+t_b_p[k].hour_spent+" Hr."+"<br>"   
          }
          
          document.getElementById("dialog_simple-message").innerHTML +=
            `
            <h6 style="float:right;font-size:13px;">Punch No. :` +
            ++i +
            `</h6>
          <h6>Login-Time :` +
            login_time +
            `</h6>
          <h6>Logout-Time :` +
            log_out_time +
            `</h6>
          <h6>Total Time spent :` +
            tot_work_hour +
            ` Hours</h6>
          
            <button type="button" class="collapsible">Detailed View</button>
            <div class="content">
              <p id="detailed_view" style="font-size:12px">`+details+`</p>
            </div>
             <hr/>

          </div>
          `;
          
          counter++;
        }

      }
    }
    $("#dialog_simple").modal("show");
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
  if (counter == 0) {
    document.getElementById("dialog_simple-label").innerHTML = "Offline";
    document.getElementById("dialog_simple-message").innerHTML = `
    Employee is offline or didnt punched for the day
    `;
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
