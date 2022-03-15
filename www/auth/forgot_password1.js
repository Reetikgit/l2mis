  
  const form = document.querySelector("#forgot");
  const sendLink = async (e) => {
    e.preventDefault();
    let email = form["email"].value;
    auth
    .sendPasswordResetEmail(email)
    .then(function () {
      // Email sent.
      document.getElementById("errorMessage").style.color="green"
      document.getElementById("errorMessage").innerHTML =
        "Reset Link Sent Successfully ✔";
      setTimeout(function () {
        document.getElementById("errorMessage").innerHTML = "";
      }, 3000);
    })
    .catch(function (error) {
      console.log(error)
      document.getElementById("errorMessage").innerHTML =
        "Invalid Email id or too many password reset attempts . Please try after sometime❌";
      setTimeout(function () {
        document.getElementById("errorMessage").innerHTML = "";
      }, 3000);
    });
    
  };
  form.addEventListener("submit", sendLink);
  // setTimeout(function(){
  //     document.getElementById("sendLinking").style.display = "block";
  // },500)
  