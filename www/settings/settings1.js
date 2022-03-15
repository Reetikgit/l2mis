const form = document.querySelector("#update_password");
const updatePassword = async (e) => {
  e.preventDefault();
  let curr_pass = document.querySelector("#curr_password").value;
  let newpass = document.querySelector("#new_password").value;
  let cnfpass = document.querySelector("#cnf_password").value;
  var credential = firebase.auth.EmailAuthProvider.credential(
    window.localStorage.getItem("email"),
    curr_pass
  );

  // Prompt the user to re-provide their sign-in credentials
  auth.onAuthStateChanged(async (user) => {
    user
      .reauthenticateWithCredential(credential)
      .then(function () {
        if (newpass != "" && cnfpass != "") {
          if (newpass == cnfpass) {
            user
              .updatePassword(newpass)
              .then(function () {
                // Update successful.
                document.getElementById("dialog-label").innerHTML = "Success";
                document.getElementById("dialog-message").innerHTML =
                  "Password updated Successfully";
                $("#dialog").modal("show");
                setTimeout(function () {
                  $("#dialog").modal("hide");
                }, 1300);
              })
              .catch(function (error) {
                // An error happened.
              });
          } else {
            document.getElementById("dialog-label").innerHTML = "Error";
            document.getElementById("dialog-message").innerHTML =
              "Password Miss matched";
            $("#dialog").modal("show");
            setTimeout(function () {
              $("#dialog").modal("hide");
            }, 1300);
          }
        } else {
          document.getElementById("dialog-label").innerHTML = "Invalid";
          document.getElementById("dialog-message").innerHTML =
            "Please enter values in all fields";
          $("#dialog").modal("show");
          setTimeout(function () {
            $("#dialog").modal("hide");
          }, 1300);
        }
      })
      .catch(function (error) {
        // An error happened.
        document.getElementById("dialog-label").innerHTML = "Error";
        document.getElementById("dialog-message").innerHTML =
          "Wrong current password";
        $("#dialog").modal("show");
        setTimeout(function () {
          $("#dialog").modal("hide");
        }, 1300);
      });
  });

  // //////////////////////////////////
};
form.addEventListener("submit", updatePassword);
