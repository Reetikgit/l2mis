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
var interval = setInterval(timestamphome, 1000);
function timestamphome() {
  date = new Date();
  date1 = new Date();
  time = document.getElementById("timediv");
  if (time) time.innerHTML = date.toLocaleTimeString();
  let id = document.getElementById("timer")
    ? document.getElementById("timer")
    : null;
  if (id != null) {
    if (date.toLocaleTimeString().split(" ")[1].toLocaleLowerCase() == "pm") {
      if (date.toLocaleTimeString().split(":")[0] < 4)
        id.innerHTML = "Good Afternoon ";
      else id.innerHTML = "Good Evening ";
    } else {
      id.innerHTML = "Good Morning ";
    }
  }
  date = date.toUTCString().slice(5, 16);
  document.getElementById("date")
    ? (document.getElementById("date").innerHTML = date)
    : null;
}
function navigate() {
  window.location = "../employee/employee.html";
}
async function openDailySign() {
  let res = await getStatus();

  if (res == false) {
    document.getElementById("dialog-label").innerHTML = "Invalid";
    document.getElementById("dialog-message").innerHTML =
      "You can only login once per day";
    $("#dialog").modal("show");
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
async function displayDialog() {
  //location.href = "#logoff";
  await getStatus();
  document.getElementById("dialog_cnf-label").innerHTML = "Logg Off";
  document.getElementById("dialog_cnf-message").innerHTML =
    "Total Work Hour - " +
    window.localStorage.getItem("working_time") +
    " " +
    "minutes";
  $("#dialog_cnf").modal("show");
}
function closeDialog() {
  //location.href = "#logoff";

  $("#dialog_cnf").modal("hide");
  $("#dialog").modal("hide");
}

async function loggoff() {
  document.getElementById("waiting").style.display = "block";
  data = {
    logout_time: new Date().toString(),
  };
  let uid = window.localStorage.getItem("uid");
  await db
    .collection("attendance")
    .doc(date)
    .collection(uid)
    .doc(uid)
    .update(data)
    .then(function () {
      $("#dialog_cnf").modal("hide");
      document.getElementById("waiting").style.display = "none";
      getStatus();
    })
    .catch(function () {
      alert("error");
    });
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
  console.log("FingerprintAuth available: " + JSON.stringify(result));
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
function isAvailableError(message) {
  console.log("isAvailableError(): " + message);
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
    console.log("Successfully encrypted credentials.");
    // console.log("Encrypted credentials: " + result.token);
    let uid = window.localStorage.getItem("uid");
    let ename = window.localStorage.getItem("uname");
    data = {
      name: ename,
      emp_id: uid,
      login_time: date1.toLocaleTimeString(),
      latitude: lat,
      tstamp: new Date().toString(),
      longitude: long,
    };
    await db
      .collection("attendance")
      .doc(date)
      .collection(uid)
      .doc(uid)
      .set(data)
      .then(function () {
        window.location = "../employee/employee.html";
      })
      .catch(function () {
        alert("error");
      });
  } else if (result.withBackup) {
    console.log("Authenticated with backup password");
    let uid = window.localStorage.getItem("uid");
    let ename = window.localStorage.getItem("uname");
    data = {
      name: ename,
      emp_id: uid,
      login_time: date1.toLocaleTimeString(),
      latitude: lat,
      tstamp: new Date().toString(),
      longitude: long,
    };
    await db
      .collection("attendance")
      .doc(date)
      .collection(uid)
      .doc(uid)
      .set(data)
      .then(function () {
        window.location = "../employee/employee.html";
      })
      .catch(function () {
        alert("error");
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
  FingerprintAuth.isAvailable(
    isAvailableSuccessCallbackLogOff,
    isAvailableErrorLogOff
  );
}
function isAvailableSuccessCallbackLogOff(result) {
  // result = {
  // isAvailable:boolean, // Fingerprint Authentication Dialog is available for use.
  // isHardwareDetected:boolean, // Device has hardware fingerprint sensor.
  // hasEnrolledFingerprints:boolean // Device has any fingerprints enrolled.
  // }
  console.log("FingerprintAuth available: " + JSON.stringify(result));
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
  console.log("successCallback(): " + JSON.stringify(result));
  if (result.withFingerprint) {
    console.log("Successfully encrypted credentials.");
    console.log("Encrypted credentials: " + result.token);
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
