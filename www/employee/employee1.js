// setTimeout(function () {
//   document.getElementById("loading").style.display = "block";
// }, 10);
async function getStatus() {
  let check_login_status = await getDbSubCollData({
    collectionName: "attendance",
    docId: new Date().toUTCString().slice(5, 16),
    subCollName: window.localStorage.getItem("uid"),
    subDocId: window.localStorage.getItem("uid"),
  });

  let status = check_login_status.data;

  if (
    check_login_status.data != undefined &&
    check_login_status.data.logout_time == undefined
  ) {
    let end = new Date().getTime();
    let start = new Date(check_login_status.data.tstamp).getTime();
    var difference = end - start; // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    document.getElementById("login").disabled = true;
    document.getElementById("log-off").disabled = false;
    document.getElementById("login").innerHTML = "Logged In";
    window.localStorage.setItem("working_time", resultInMinutes);
  } else {
    document.getElementById("log-off").disabled = true;
    document.getElementById("login").disabled = false;
  }

  if (
    check_login_status.data != undefined &&
    check_login_status.data.logout_time != undefined
  ) {
    document.getElementById("login").innerHTML = "Log In";
    document.getElementById("log-off").disabled = true;
    document.getElementById("login").disabled = false;
    return false;
  }
  cordova.plugins.firebase.messaging.getToken().then(async function (token) {
    console.log("Got device token: ", token);
    let data={
      fcm_token:token
    }
    let res = await updateDbDoc({collectionName:"employee",docId:window.localStorage.getItem("uid"), dataToUpdate:data})
  });

}
setTimeout(function () {
  getStatus();
}, 300);
