firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    // User is signed in.
    let Dbdata = await getDbData({
      collectionName: "employee",
      docId: user.uid,
    });
    var data = Dbdata.data;
    document.getElementById("emp_name").innerHTML = data.fname;
  } else {
    // User is signed out.
    // setTimeout(function () {
    //   document.getElementById("verifying").style.display = "none";
    // }, 300);
    window.location = "./../auth/login.html";
  }
  const reset = async (e) => {
    e.preventDefault();
    let old_pass = "employee_" + data.emp_id + "";
    let pass = form["pass"].value;
    let cnf_pass = form["cnf_pass"].value;
    document.getElementById("auto_dialog-label").innerHTML = "Error";
    document.getElementById("auto_dialog-message").innerHTML =
      "Password Mismatched";
    document.getElementById("auto_dialog-message").style.fontWeight = "900";
    document.getElementById("auto_dialog-message").style.textAlign = "center";
    if (pass && cnf_pass && pass === cnf_pass) {
      if (pass.length < 6) {
        document.getElementById("auto_dialog-label").innerHTML = "Error";
        document.getElementById("auto_dialog-message").innerHTML =
          "Password should be minimum of 6 characters";
        document.getElementById("auto_dialog-message").style.fontWeight = "900";
        document.getElementById("auto_dialog-message").style.textAlign =
          "center";
        showDialog();
      } else {
        document.getElementById("updating").style.display = "block";
        user
          .updatePassword(cnf_pass)
          .then(async function () {
            // Update successful.
            await db
              .collection("employee")
              .doc(user.uid)
              .update({ password_reset: true })
              .then(function () {
                document.getElementById("updating").style.display = "none";
                window.localStorage.setItem("uid", user.uid);
                window.location = "./../employee/employee.html";
              });
          })
          .catch(function (error) {
            // An error happened.
            console.log(error)
          });
      }
    } else {
      showDialog();
    }
  };
  const form = document.querySelector("#reset_pass");
  form.addEventListener("submit", reset);
  function showDialog() {
    $("#auto_hide_dialog").modal("show");
    setTimeout(function () {
      $("#auto_hide_dialog").modal("hide");
    }, 1300);
  }
});
