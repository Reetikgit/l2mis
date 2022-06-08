$("#bottomNavigation").load("./../bottomNavigation/navigation.html");
$("#sidebar").load("./../sideBar/navigation.html");
$("#topBar").load("./../topBar/topBar.html");
$("#dialog").load("./../dialog/dialog.html");
getLocation();
var navItems = document.querySelectorAll(".mobile-bottom-nav__item");
navItems.forEach(function (e, i) {
  e.addEventListener("click", function (e) {
    navItems.forEach(function (e2, i2) {
      e2.classList.remove("mobile-bottom-nav__item--active");
    });
    this.classList.add("mobile-bottom-nav__item--active");
  });
});
let total_Work_hour = 0;
var emp_data;
let projects = [];
var activity_data_arr = [];
let old_punch_out = "false";
let old_date;
let old_logout_hours;
let old_logout_mins;
setTimeout(function () {
  $(".swipe-area").swipe({
    swipeStatus: function (
      event,
      phase,
      direction,
      distance,
      duration,
      fingers
    ) {
      if (phase == "move" && direction == "right") {
        $("#sidebar").addClass("active");
        //    document.getElementById("swipeArea").style.zIndex = 9999999;
        return false;
      }

      if (phase == "move" && direction == "left") {
        $("#sidebar").removeClass("active");
        // document.getElementById("swipeArea").style.zIndex = 0;
        return false;
      }
    },
  });
  $(".swipe-area-close").swipe({
    swipeStatus: function (
      event,
      phase,
      direction,
      distance,
      duration,
      fingers
    ) {
      if (phase == "move" && direction == "left") {
        $("#sidebar").removeClass("active");
        // document.getElementById("swipeArea").style.zIndex = 0;
        return false;
      }
    },
  });
}, 2000);
var date, date1;
var time;
var lat, long;
timestamphome();
function timestamphome() {
  date = new Date();
  date1 = new Date();
  time = document.getElementById("timediv");
  if (time) time.innerHTML = date.toLocaleTimeString();
  let id = document.getElementById("timer")
    ? document.getElementById("timer")
    : null;
  if (id != null) {
    if (
      date.toLocaleTimeString().split(" ")[1] == "pm" ||
      date.toLocaleTimeString().split(" ")[1] == "PM" ||
      date.toLocaleTimeString().split(" ")[1] == "Pm"
    ) {
      if (date.toLocaleTimeString().split(":")[0] < 4)
        id.innerHTML = "Good Afternoon ";
      else if (date.toLocaleTimeString().split(":")[0] == 12) {
        id.innerHTML = "Good Afternoon ";
      } else id.innerHTML = "Good Evening ";
    } else if (
      date.toLocaleTimeString().split(" ")[1] == "am" ||
      date.toLocaleTimeString().split(" ")[1] == "AM" ||
      date.toLocaleTimeString().split(" ")[1] == "Am"
    ) {
      id.innerHTML = "Good Morning ";
    } else {
      let zone = parseInt(date.toLocaleTimeString().split(" ")[0]);
      if (zone >= 12 && zone <= 15) {
        id.innerHTML = "Good Afternoon";
      } else if (zone > 15 && zone < 24) {
        id.innerHTML = "Good Evening";
      } else if (zone == 00 || (zone > 0 && zone < 12)) {
        id.innerHTML = "Good Morning";
      } else {
        id.innerHTML = "Hello ";
      }
    }
  }
  date = date.toUTCString().slice(5, 16);
  document.getElementById("date")
    ? (document.getElementById("date").innerHTML = date)
    : null;
}
function navigate(place) {
  window.location = "../" + place + "/" + place + ".html";
}
async function openDailySign() {
  let res = await getStatus();

  if (res == false) {
    // document.getElementById("dialog-label").innerHTML = "Invalid";
    // document.getElementById("dialog-message").innerHTML =
    //   "You can only login once per day";
    // $("#dialog").modal("show");
    window.location = "../dailySignIn/dailySignIn.html";
  } else {
    window.location = "../dailySignIn/dailySignIn.html";
  }
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
function onSuccess(pos) {
  lat = pos.coords.latitude;
  long = pos.coords.longitude;
  //  alert("lat : " + lat + " lng : " + lng);
}
function onError(error) {
  // alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
  // getLocation()
}
var hours, minutes;
async function displayDialog(login_Time, logout_Time,day1) {
  //location.href = "#logoff";
  
  await getStatus();
  if (login_Time != "" && logout_Time != "") {
    let login_time_hours = login_Time.split(":")[0];
    let login_time_min = login_Time.split(":")[1];
    login_time_hours = parseInt(login_time_hours);
    login_time_min = parseInt(login_time_min);
    if (login_time_min > 50) {
      login_time_hours += 1;
    }
    let logout_time_hours = logout_Time.split(":")[0];
    let logout_time_min = logout_Time.split(":")[1];
    old_logout_hours=logout_time_hours;
    old_logout_mins=logout_time_min;
    logout_time_hours = parseInt(logout_time_hours);
    logout_time_min = parseInt(logout_time_min);
    if (logout_time_min > 30) {
      logout_time_hours += 1;
    }

    hours = logout_time_hours - login_time_hours;

    minutes = 0;
    old_punch_out = "true";
    old_date=day1
  } else {
    old_punch_out = "false";
    hours = Math.floor(window.localStorage.getItem("working_time") / 60);
    minutes = window.localStorage.getItem("working_time") % 60;
  }

  document.getElementById("dialog_cnf-label").innerHTML = "Punch Out";
  document.getElementById("dialog_cnf-message").innerHTML =
    "Total Work Time - " +
    hours +
    " " +
    " hour " +
    minutes +
    " " +
    "minutes" +
    `
    
  <div id="projects">
  <span id="tot_hrs"></span> 
  </div>
  `;
  displayActivity();
  if (minutes >= 30) {
    hours += 1;
  }
  document.getElementById("tot_hrs").innerHTML =
    "Total Rounded Hours - " + hours + "";
  emp_data = JSON.parse(window.localStorage.getItem("data"));
  $("#dialog_cnf").modal("show");
}
async function displayActivity() {
  let Dbdata = await getDbCollDataSort("project");
  let i = 0;
  activity_data_arr = [];
  Dbdata.data.map(async (d) => {
    let objData = d.data;
    activity_data_arr.push(objData);
    document.getElementById("projects").innerHTML +=
      `
      <hr/>
      <div class="wrap-input100 validate-input" data-validate="Days required">
      <p style="float:right;font-weight:200 !important;font-size:10px;margin-bottom:3%">` +
      objData.activity_type +
      `</p>
      <span class="label-input100" style="font-size:13px">` +
      objData.name +
      " :" +
      `</span>
        <br>
      <input
        class="input100"
        type="number"
        name="days"
        style="font-size:13px"
        required
        id="` +
      objData.name +
      "_" +
      i +
      `"
        placeholder="Hours spent on this Activity"
        required
      />
      
    </div>
  
      `;
    i++;
  });
}
function closeDialog() {
  //location.href = "#logoff";

  $("#dialog_cnf").modal("hide");
  $("#dialog").modal("hide");
  $("#dialog_adjust").modal("hide");
  $("#dialog_simple").modal("hide");
  $("#dialog_logout_time").modal("hide");
}

async function loggoff() {
  if (old_punch_out == "false") {
    let new_punched_arr = [];
    document.getElementById("updating").style.display = "block";
    let check_login_status = await getDbSubCollData({
      collectionName: "attendance",
      docId: new Date().toUTCString().slice(5, 16),
      subCollName: window.localStorage.getItem("uid"),
      subDocId: window.localStorage.getItem("uid"),
    });

    let status = check_login_status.data;
    for (let i in status.punched_times) {
      new_punched_arr.push(status.punched_times[i]);
    }
    new_punched_arr[new_punched_arr.length - 1].logout_time =
      new Date().toString();
    new_punched_arr[new_punched_arr.length - 1].total_Work_hour =
      total_Work_hour;
    new_punched_arr[new_punched_arr.length - 1].time_between_projects =
      projects;
    data = {
      punched_times: new_punched_arr,
    };
    data_notify = {
      punched_times: new_punched_arr,
      data: window.localStorage.getItem("data"),
    };
    let uid = window.localStorage.getItem("uid");
    let timesheet_date =
      new Date().toString().split(" ")[1] +
      "_" +
      new Date().toString().split(" ")[3];
    await db
      .collection("attendance")
      .doc(date)
      .collection(uid)
      .doc(uid)
      .update(data)
      .then(async function () {
        let timesheetdata = await db
          .collection("timesheet_" + timesheet_date)
          .doc(uid)
          .get();
        let data2;
        let t_data = timesheetdata.data();
        let timsheet_names = [];
        let attendance_names = [];
        if (t_data) {
          for (let i in t_data.time_between_projects) {
            timsheet_names.push(t_data.time_between_projects[i].project);
          }
          for (let i in projects) {
            attendance_names.push(projects[i].project);
          }
          for (let i in t_data.time_between_projects) {
            for (let j in projects) {
              if (
                projects[j].project == t_data.time_between_projects[i].project
              ) {
                t_data.time_between_projects[i].hour_spent =
                  parseFloat(projects[j].hour_spent) +
                  parseFloat(
                    timesheetdata.data().time_between_projects[i].hour_spent
                  );
              }
            }
          }

          for (let i = 0; i < attendance_names.length; i++) {
            if (timsheet_names.indexOf(attendance_names[i]) === -1) {
              let index = attendance_names.indexOf(attendance_names[i]);
              let objs = {
                hour_spent: projects[index].hour_spent,
                project: attendance_names[i],
              };

              t_data.time_between_projects.push(objs);
            }
          }

          projects = t_data.time_between_projects;
          data2 = {
            data: window.localStorage.getItem("data"),
            total_Work_hour:
              parseFloat(total_Work_hour) +
              parseFloat(timesheetdata.data().total_Work_hour),
            time_between_projects: projects,
          };
          await db
            .collection("timesheet_" + timesheet_date)
            .doc(uid)
            .update(data2)
            .then(async function () {
              await db
                .collection("notify_to_mentor")
                .doc(uid)
                .update(data_notify)
                .then(function () {
                  $("#dialog_cnf").modal("hide");

                  document.getElementById("updating").style.display = "none";
                  window.location.reload();
                  getStatus();
                });
            })
            .catch(function () {
              alert("error22");
            });
        } else {
          data2 = {
            data: window.localStorage.getItem("data"),
            total_Work_hour: total_Work_hour,
            time_between_projects: projects,
          };
          let res = await setDbData({
            collectionName: "timesheet_" + timesheet_date,
            docId: uid,
            dataToUpdate: data2,
          }).then(function () {
            $("#dialog_cnf").modal("hide");
            document.getElementById("updating").style.display = "none";
            getStatus();
          });
        }
      })
      .catch(function () {
        alert("error");
      });
  }else if(old_punch_out=="true"){
    let new_punched_arr = [];
    let date=old_date
    document.getElementById("updating").style.display = "block";
    let check_login_status = await getDbSubCollData({
      collectionName: "attendance",
      docId: date,
      subCollName: window.localStorage.getItem("uid"),
      subDocId: window.localStorage.getItem("uid"),
    });
  
    let status = check_login_status.data;
    for (let i in status.punched_times) {
      new_punched_arr.push(status.punched_times[i]);
    }
    new_punched_arr[new_punched_arr.length - 1].logout_time =
      "* * * * "+old_logout_hours+":"+old_logout_mins+":"+"00";
    new_punched_arr[new_punched_arr.length - 1].total_Work_hour = total_Work_hour;
    new_punched_arr[new_punched_arr.length - 1].time_between_projects = projects;
    data = {
      punched_times: new_punched_arr,
    };
    data_notify={
      punched_times:new_punched_arr,
      data :window.localStorage.getItem("data"),
    }
    let uid = window.localStorage.getItem("uid");
    let timesheet_date =
      new Date().toString().split(" ")[1] +
      "_" +
      new Date().toString().split(" ")[3];
    await db
      .collection("attendance")
      .doc(date)
      .collection(uid)
      .doc(uid)
      .update(data)
      .then(async function () {
        let timesheetdata = await db
          .collection("timesheet_" + timesheet_date)
          .doc(uid)
          .get();
        let data2;
        let t_data = timesheetdata.data();
        let timsheet_names =[];
        let attendance_names=[];
        if (t_data) {
          for (let i in t_data.time_between_projects) {
            timsheet_names.push(t_data.time_between_projects[i].project)
          }
          for (let i in projects) {
           attendance_names.push(projects[i].project)
          }
          for (let i in t_data.time_between_projects) {
            for (let j in projects) {
              if (
                projects[j].project == t_data.time_between_projects[i].project
              ) {
                t_data.time_between_projects[i].hour_spent =
                  parseFloat(projects[j].hour_spent) +
                  parseFloat(
                    timesheetdata.data().time_between_projects[i].hour_spent
                  );
              }
            }
          }
   
  
          for (let i = 0; i < attendance_names.length; i++){
              if (timsheet_names.indexOf(attendance_names[i]) === -1) {
                 
                  let index=attendance_names.indexOf(attendance_names[i])
                  let objs = {
                    hour_spent : projects[index].hour_spent,
                    project : attendance_names[i]
                  }
                  
                  t_data.time_between_projects.push(objs)
           
                
              }
          }
                  
          projects = t_data.time_between_projects;
          data2 = {
            data: window.localStorage.getItem("data"),
            total_Work_hour:
              parseFloat(total_Work_hour) +
              parseFloat(timesheetdata.data().total_Work_hour),
            time_between_projects: projects,
          };
          await db
            .collection("timesheet_" + timesheet_date)
            .doc(uid)
            .update(data2)
            .then(async function () {
              await db
               .collection("notify_to_mentor")
               .doc(uid)
               .update(data_notify).then(function(){
                $("#dialog_cnf").modal("hide");
  
                document.getElementById("updating").style.display = "none";
                window.location.reload();
                getStatus();
               })
          
            })
            .catch(function () {
              alert("error22");
            });
        } else {
          data2 = {
            data: window.localStorage.getItem("data"),
            total_Work_hour: total_Work_hour,
            time_between_projects: projects,
          };
          let res = await setDbData({
            collectionName: "timesheet_" + timesheet_date,
            docId: uid,
            dataToUpdate: data2,
          }).then(function () {
            $("#dialog_cnf").modal("hide");
            document.getElementById("updating").style.display = "none";
            getStatus();
          });
        }
      })
      .catch(function () {
        alert("error");
      });
  }
}

////// Finger Print  Code //////

function authenticate() {
  FingerprintAuth.isAvailable(isAvailableSuccessCallback, isAvailableError);
}
function isAvailableSuccessCallback(result) {
  // result = {
  // isAvailable:boolean, // Fingerprint Authentication Dialog is available for use.
  // isHardwareDetected:boolean, // Device has hardware fingerprint sensor.
  // hasEnrolledFingerprints:boolean // Device has any fingerprints enrolled.
  // }
  // console.log("FingerprintAuth available: " + JSON.stringify(result));
  if (result) {
    // See config object for required parameters
    var encryptConfig = {
      clientId: "undefined", //  When using the voucher plus decryption, it is necessary to access the use of the Android Key Store and is an encrypted salt;
      usename: " undefined", //  It is necessary to encrypt the salt when using the voucher plus decryption;
      password: "undefined", //  Need to decrypt when encryption
      token: "undefined", //  It is necessary to decrypt when encrypting.
      disableBackup: false, //  Whether to allow users to use a decomppse scheme, that is, if the fingerprint verifies whether the user password is provided, the user password is provided.
      maxAttempts: "5", //  The maximum number of retries, the default is 5 times, can be 5 small
      locale: "en_US", //  The language of the dialog, the default is English en_us
      userAuthRequired: "false",
      encryptNoAuth: "false",
      dialogTitle: "Finger Print Authentication", //  Dialog title
      dialogMessage: "Please verify your identity", //  Tips for dialog
      dialogHint: "Place your finger on the fingerprint sensor", //  Dialogue fingerprint icon displayed text
    };
    FingerprintAuth.encrypt(
      encryptConfig,
      encryptSuccessCallback,
      errorCallback
    );
  }
}
async function isAvailableError(message) {
  console.log("isAvailableError(): " + message);
  window.cordova.plugins.PinCheck.isPinSetup(
    async function (success) {
      console.log("pin is setup.");
      let new_punched_arr = [];
      // document.getElementById("updating").style.display = "block";
      let check_login_status = await getDbSubCollData({
        collectionName: "attendance",
        docId: new Date().toUTCString().slice(5, 16),
        subCollName: window.localStorage.getItem("uid"),
        subDocId: window.localStorage.getItem("uid"),
      });

      let status = check_login_status.data;
      if (status != undefined) {
        for (let i in status.punched_times) {
          new_punched_arr.push(status.punched_times[i]);
        }
      }

      let uid = window.localStorage.getItem("uid");
      let ename = window.localStorage.getItem("uname");
      let punch_in_arr = new_punched_arr;
      if (lat == undefined) {
        lat = " ";
      }
      if (long == undefined) {
        long = " ";
      }
      let punched_data = {
        login_time: date1.toLocaleTimeString(),
        latitude: lat,
        tstamp: new Date().toString(),
        longitude: long,
      };
      punch_in_arr.push(punched_data);
      data = {
        name: ename,
        emp_id: uid,
        punched_times: punch_in_arr,
      };
      data_notify = {
        name: ename,
        emp_id: uid,
        data: window.localStorage.getItem("data"),
        punched_times: punch_in_arr,
      };
      await db
        .collection("attendance")
        .doc(date)
        .collection(uid)
        .doc(uid)
        .set(data)
        .then(async function () {
          await db
            .collection("notify_to_mentor")
            .doc(uid)
            .set(data_notify)
            .then(function () {
              window.location = "../employee/employee.html";
            });
        })
        .catch(function () {
          alert("error");
        });
    },
    function (fail) {
      alert("Please setup a pin/password.");
    }
  );
}

//  Fingerprint verification; if you need to add a diploma, you need to pass the ClientID, UseName, Password.
//  Verify that successful callbacks can get encrypted token
//  EncryptConfig parameters are a parameter object

//  Verify successful callback
async function encryptSuccessCallback(result) {
  // result = {
  //  WITHFINGERPRINT: BOOLEAN, // Verify it using fingerprints.
  //  WITHBACKUP: BOOLEAN, // Verified using a recession scheme.
  //  Token: boolean // Verify successful token.
  // }
  //console.log("successCallback(): " + JSON.stringify(result));
  if (result.withFingerprint) {
    // console.log("Successfully encrypted credentials.");
    // console.log("Encrypted credentials: " + result.token);
    let new_punched_arr = [];
    // document.getElementById("updating").style.display = "block";
    let check_login_status = await getDbSubCollData({
      collectionName: "attendance",
      docId: new Date().toUTCString().slice(5, 16),
      subCollName: window.localStorage.getItem("uid"),
      subDocId: window.localStorage.getItem("uid"),
    });

    let status = check_login_status.data;
    if (status != undefined) {
      for (let i in status.punched_times) {
        new_punched_arr.push(status.punched_times[i]);
      }
    }

    let uid = window.localStorage.getItem("uid");
    let ename = window.localStorage.getItem("uname");
    let punch_in_arr = new_punched_arr;
    if (lat == undefined) {
      lat = " ";
    }
    if (long == undefined) {
      long = " ";
    }
    let punched_data = {
      login_time: date1.toLocaleTimeString(),
      latitude: lat,
      tstamp: new Date().toString(),
      longitude: long,
    };
    punch_in_arr.push(punched_data);
    data = {
      name: ename,
      emp_id: uid,
      punched_times: punch_in_arr,
    };
    data_notify = {
      name: ename,
      emp_id: uid,
      data: window.localStorage.getItem("data"),
      punched_times: punch_in_arr,
    };
    await db
      .collection("attendance")
      .doc(date)
      .collection(uid)
      .doc(uid)
      .set(data)
      .then(async function () {
        await db
          .collection("notify_to_mentor")
          .doc(uid)
          .set(data_notify)
          .then(function () {
            window.location = "../employee/employee.html";
          });
      })
      .catch(function () {
        alert("error");
      });
  } else if (result.withBackup) {
    console.log("Authenticated with backup password");
    let uid = window.localStorage.getItem("uid");
    let ename = window.localStorage.getItem("uname");
    let punch_in_arr = [];
    if (lat == undefined) {
      lat = " ";
    }
    if (long == undefined) {
      long = " ";
    }
    let punched_data = {
      login_time: date1.toLocaleTimeString(),
      latitude: lat,
      tstamp: new Date().toString(),
      longitude: long,
    };
    punch_in_arr.push(punched_data);
    let data = {
      name: ename,
      emp_id: uid,
      punched_times: punch_in_arr,
    };
    let data_notify = {
      name: ename,
      emp_id: uid,
      data: window.localStorage.getItem("data"),
      punched_times: punch_in_arr,
    };
    await db
      .collection("attendance")
      .doc(date)
      .collection(uid)
      .doc(uid)
      .set(data)
      .then(async function () {
        await db
          .collection("notify_to_mentor")
          .doc(uid)
          .set(data_notify)
          .then(function () {
            window.location = "../employee/employee.html";
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

//  When the fingerprint verification, decryption, the token parameter is necessary
//  If you don't need a decryption credential, use Encrypt (no passing Option value)
//  Verify that the successful callback can get the decided credential information
//FingerprintAuth.decrypt(decryptConfig, encryptSuccessCallback, encryptErrorCallback);

function errorCallback(error) {
  if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
    console.log("FingerprintAuth Dialog Cancelled!");
  } else {
    console.log("FingerprintAuth Error: " + error);
  }
}

// finger Print Log Offf//

function authenticateLogOff() {
  projects = [];
  let counter = 0;
  if (window.localStorage.getItem("working_time") >= 0) {
    // var hours = Math.floor(window.localStorage.getItem("working_time") / 60);
    // var minutes = window.localStorage.getItem("working_time") % 60;
    total_Work_hour = hours;
    if (minutes >= 30) {
      total_Work_hour += 1;
    }
    for (let i in activity_data_arr) {
      if (
        parseFloat(
          document.getElementById(activity_data_arr[i].name + "_" + i).value
        ) > 0
      ) {
        counter += parseFloat(
          document.getElementById(activity_data_arr[i].name + "_" + i).value
        );
        let obj = {
          project: activity_data_arr[i].name,
          hour_spent: parseFloat(
            document.getElementById(activity_data_arr[i].name + "_" + i).value
          ),
        };
        projects.push(obj);
      }
    }
    if (counter == total_Work_hour) {
      FingerprintAuth.isAvailable(
        isAvailableSuccessCallbackLogOff,
        isAvailableErrorLogOff
      );
    } else {
      document.getElementById("error_msg").style.display = "block";
      setTimeout(function () {
        document.getElementById("error_msg").style.display = "none";
      }, 2000);
    }
  } else {
    total_Work_hour = 0;
    alert("Please Work atleast for 30 Min");
  }
}
function isAvailableSuccessCallbackLogOff(result) {
  // result = {
  // isAvailable:boolean, // Fingerprint Authentication Dialog is available for use.
  // isHardwareDetected:boolean, // Device has hardware fingerprint sensor.
  // hasEnrolledFingerprints:boolean // Device has any fingerprints enrolled.
  // }
  // console.log("FingerprintAuth available: " + JSON.stringify(result));
  if (result) {
    // See config object for required parameters
    var encryptConfig = {
      clientId: "undefined", //  When using the voucher plus decryption, it is necessary to access the use of the Android Key Store and is an encrypted salt;
      usename: " undefined", //  It is necessary to encrypt the salt when using the voucher plus decryption;
      password: "undefined", //  Need to decrypt when encryption
      token: "undefined", //  It is necessary to decrypt when encrypting.
      disableBackup: false, //  Whether to allow users to use a decomppse scheme, that is, if the fingerprint verifies whether the user password is provided, the user password is provided.
      maxAttempts: "5", //  The maximum number of retries, the default is 5 times, can be 5 small
      locale: "en_US", //  The language of the dialog, the default is English en_us
      userAuthRequired: "false",
      encryptNoAuth: "false",
      dialogTitle: "Finger Print Authentication", //  Dialog title
      dialogMessage: "Please verify your identity", //  Tips for dialog
      dialogHint: "Place your finger on the fingerprint sensor", //  Dialogue fingerprint icon displayed text
    };
    FingerprintAuth.encrypt(
      encryptConfig,
      encryptSuccessCallbackLogOff,
      errorCallbackLogOff
    );
  }
}
function isAvailableErrorLogOff(message) {
  console.log("isAvailableError(): " + message);
  loggoff();
}

//  Fingerprint verification; if you need to add a diploma, you need to pass the ClientID, UseName, Password.
//  Verify that successful callbacks can get encrypted token
//  EncryptConfig parameters are a parameter object

//  Verify successful callback
function encryptSuccessCallbackLogOff(result) {
  // result = {
  //  WITHFINGERPRINT: BOOLEAN, // Verify it using fingerprints.
  //  WITHBACKUP: BOOLEAN, // Verified using a recession scheme.
  //  Token: boolean // Verify successful token.
  // }
  // console.log("successCallback(): " + JSON.stringify(result));
  if (result.withFingerprint) {
    loggoff();
  } else if (result.withBackup) {
    console.log("Authenticated with backup password");
    loggoff();
  }
}

//  When the fingerprint verification, decryption, the token parameter is necessary
//  If you don't need a decryption credential, use Encrypt (no passing Option value)
//  Verify that the successful callback can get the decided credential information
//FingerprintAuth.decrypt(decryptConfig, encryptSuccessCallback, encryptErrorCallback);

function errorCallbackLogOff(error) {
  if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
    console.log("FingerprintAuth Dialog Cancelled!");
  } else {
    console.log("FingerprintAuth Error: " + error);
  }
}
