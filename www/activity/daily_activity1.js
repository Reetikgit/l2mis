let idss = [];
var global_data;
var interval;
let counter=0;
let int_counter=0;
async function getActivity() {
  let month = new Date().toString().split(" ")[1];
  let year = new Date().toString().split(" ")[3];
  let id = window.localStorage.getItem("uid");
  let local_arr = [];
  let local_dates = [];
  let index = 0;
  console.log("Came")
  if(int_counter>2){
    clearInterval(interval);
    interval=0;
  }
  let local_data = JSON.parse(window.localStorage.getItem("activity"));
  document.getElementById("activitys").innerHTML = "";
  if (local_data != undefined) {
    // local_arr.push(local_data)
    // console.log(local_arr)
    counter=1;
    let btnText="Adjust";
    let txt=false
    let color="orange"
    document.getElementById("loading").style.display = "none";
    clearInterval(interval);
    for (index = 0; index < local_data.length; index++) {
      console.log(local_data[index]);
      if (local_data[index] != null) {
        let value = local_data[index];
        let l_day = value.tstamp.split(" ")[2];
        let l_month = value.tstamp.split(" ")[1];
        if (l_month != month) {
          window.localStorage.removeItem("activity");
          break;
        }
        local_dates.push(l_day);
        if(value.type=="adjusted"){
          btnText="Adjusted"
          txt=true;
          color="gray"
        }else{
          txt=false;
          btnText="Adjust"
          color="orange";
        }
        if (value.logout_time)
          document.getElementById("activitys").innerHTML +=
            `
          <div class="list-item" data-id="19">
          <div>
            <a href="#" data-abc="true"
              ><span class="w-48 avatar gd-warning" style="font-size:11px"
                >` +
            l_day +
            " " +
            l_month +
            `</span
              ></a>
          </div>
          <div class="flex">
            <div class="item-except text-muted text-sm " style="font-size:11px">
              Login Time : ` +
            value.tstamp.split(" ")[4] +
            `
            </div>
            <div class="item-except text-muted text-sm " style="font-size:11px">
              Logout Time : ` +
            value.logout_time.split(" ")[4] +
            `
            </div>
            <div class="item-except text-muted text-sm " style="font-size:11px">
              Total Work Hour : ` +
            value.total_Work_hour +
            `
            </div>
          </div>
          <div class="no-wrap">
            <div
              class="item-date text-muted text-sm d-md-block"
            >
              <button
                class="btn btn-warning"
                style="
                  font-size: 8px;
                  border-radius: 11px;
                  width: 100%;
                  height: 30px;
                  margin-left: 30%;
                  background-color:`+color+`

                  "
                onclick=showAdjustDialog("` +
            value.tstamp.split(/\s/).join("") +
            `")
            id="`+value.tstamp.split(/\s/).join("")+`"
              >

                `+btnText+`
              </button>
            </div>
          </div>
        </div>
          `;

          document.getElementById(value.tstamp.split(/\s/).join("")).disabled=txt
      }
    }
  } else {
    int_counter++;
    if(int_counter>3){
      clearInterval(interval)
      interval=0;
    }
    interval = setInterval(function () {
      getActivity();
    }, 5000);
    

  }
 
  for (let day = 1; day <= 31; day++) {
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

    if (res.data() && res.data().logout_time) {
      counter=1;
      local_arr.push(res.data());
      window.localStorage.setItem("activity", JSON.stringify(local_arr));
      document.getElementById("loading").style.display = "none";
      // let data = res.data();
      // document.getElementById("activitys").innerHTML +=
      //   `
      //   <div class="list-item" data-id="19">
      //   <div>
      //     <a href="#" data-abc="true"
      //       ><span class="w-48 avatar gd-warning" style="font-size:11px"
      //         >` +
      //   day +
      //   " " +
      //   month +
      //   `</span
      //       ></a>
      //   </div>
      //   <div class="flex">
      //     <div class="item-except text-muted text-sm " style="font-size:11px">
      //       Login Time : ` +
      //   data.tstamp.split(" ")[4] +
      //   `
      //     </div>
      //     <div class="item-except  text-sm " style="font-size:11px">
      //       Logout Time : ` +
      //   data.logout_time.split(" ")[4] +
      //   `
      //     </div>
      //     <div class="item-except text-muted text-sm " style="font-size:11px">
      //       Total Work Hour : ` +
      //   data.total_Work_hour +
      //   `
      //     </div>
      //   </div>
      //   <div class="no-wrap">
      //     <div
      //       class="item-date text-muted text-sm d-md-block"
      //     >
      //       <button
      //         class="btn btn-warning"
      //         style="
      //           font-size: 8px;
      //           border-radius: 10px;
      //           width: 100%;
      //           height: 30px;
      //           margin-left: 30%;
      //         "
      //         onclick=showAdjustDialog("` +
      //   data.tstamp.split(/\s/).join("") +
      //   `")
      //       >
      //         Adjust
      //       </button>
      //     </div>
      //   </div>
      // </div>
      //   `;
    } else {
      // console.log(local_arr)
     
    }
    if(counter==0){
      document.getElementById("loading").style.display = "none";
      document.getElementById("activitys").innerHTML =
        "No activity found ! Use daily signin to create a activity . `<br>Refreshing....` ";
    }
    //}
  }
}
setTimeout(function () {
  document.getElementById("loading").style.display = "block";
  getActivity();
}, 200);

function showAdjustDialog(tstamp) {
  idss = [];
  let data = JSON.parse(window.localStorage.getItem("activity"));
  for (let i in data) {
    if (data[i].tstamp.split(/\s/).join("") == tstamp) {
      let val = data[i];
      global_data = val;
      document.getElementById("dialog_adjust-label").innerHTML =
        "Timesheet Adjustment";
      document.getElementById("dialog_adjust-message").innerHTML =
        `
        <div class="wrap-input100 validate-input" data-validate="Days required">
        <span class="label-input100">Total hours : (Current :` +
        val.total_Work_hour +
        ` )</span>
        <input
            class="input100"
            type="number"
            name="days"
            required"
            id="total"
            placeholder="Overall Hours Spent"
            required
        />
     
        `;
      for (let j in val.time_between_projects) {
        idss.push(val.time_between_projects[j].project + "_" + j);
        document.getElementById("dialog_adjust-message").innerHTML +=
          `
            <div class="wrap-input100 validate-input" data-validate="Days required">
            <span class="label-input100">` +
          val.time_between_projects[j].project +
          " (Current: " +
          val.time_between_projects[j].hour_spent +
          ") " +
          `</span>
            <br>
            <input
                class="input100"
                type="number"
                name="days"
                required
                id="` +
          val.time_between_projects[j].project +
          "_" +
          j +
          `"
                placeholder="Hours spent on this project  "
                required
            />
            </div>
             <br>
      `;
      }

      $("#dialog_adjust").modal("show");
      document.getElementById("dialog_adjust-message").innerHTML += `
        <span id="error_msg2" style="color:red;font-weight:700;display:none">Invalid distribution of hours</span>
        `;
    }
  }
}
async function adjust() {
  console.log(global_data);
  let date =
    global_data.tstamp.split(" ")[2] +
    " " +
    global_data.tstamp.split(" ")[1] +
    " " +
    global_data.tstamp.split(" ")[3];
  let new_arr = [];
  let count = 0;
  let total = parseInt(document.getElementById("total").value);
  if(idss.length==0){
    count=total
  }
  for (let i in idss) {
    count += parseInt(document.getElementById(idss[i]).value);
  }
  console.log(count + "_" + total);
  if (count == total) {
    for (let i in idss) {
      count += document.getElementById(idss[i]).value;
      let obj1 = {
        project: idss[i].split("_")[0],
        hour_spent: parseInt(document.getElementById(idss[i]).value),
      };
      new_arr.push(obj1);
    }
    console.log(new_arr);
    let data = {
      time_between_projects_adjusted: new_arr,
      total_Work_hour_adjusted: total,
      adjusted_date: date,
      id: window.localStorage.getItem("uid"),
      fcm_token : JSON.parse(window.localStorage.getItem("data")).fcm_token
    };
    let res = await setDbData({
      collectionName: "timesheet_adjustment",
      docId: window.localStorage.getItem("uid"),
      dataToUpdate: data,
    }).then(function () {
      document.getElementById("error_msg2").style.display = "block";
      document.getElementById("error_msg2").innerHTML =
        "✔️ Requested for adjustment ";
      document.getElementById("error_msg2").style.color = "green";
      setTimeout(function () {
        $("#dialog_adjust").modal("hide");
      }, 2500);
    });
    // await db
    //   .collection("")
    //   .doc(date)
    //   .collection(window.localStorage.getItem("uid"))
    //   .doc(window.localStorage.getItem("uid"))
    //   .update(data)
    //   .then(function () {

    //   })
    //   .catch(function () {
    //     alert("error");
    //   });
  } else {
    document.getElementById("error_msg2").style.display = "block";
    setTimeout(function () {
      document.getElementById("error_msg2").style.display = "none";
    }, 1000);
  }
}
