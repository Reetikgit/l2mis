if(window.localStorage.getItem("uid") !=undefined){
  window.location = "./../employee/employee.html";
}else{
  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {

      // User is signed in.
      let Dbdata = await getDbData({
        collectionName: "employee",
        docId: user.uid,
      });
      let data = Dbdata.data;
  
      if (data.password_reset) {
        window.localStorage.setItem("uid", user.uid);
        window.location = "./../employee/employee.html";
      } else {
        window.location = "./../auth/reset_pass.html";
      }
      //  window.location = "./../employee/employee.html";
    } else {
      // User is signed out.
      // setTimeout(function () {
      //   document.getElementById("verifying").style.display = "none";
      // }, 300);
    }
  });
}

const form = document.querySelector("#login");
const verify = async (e) => {
  e.preventDefault();
  let email = form["email"].value;
  let password = form["password"].value;
  let res = await login({ email: email, password: password });
  if (res.user) {
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("key", password);
    let uid = res.user_data.user.uid;
    let Dbdata = await getDbData({
      collectionName: "employee",
      docId: uid,
    });
    let data = Dbdata.data;
    window.localStorage.setItem("data",JSON.stringify(data))
    window.localStorage.removeItem("uid")
    window.localStorage.removeItem("working_time")
    window.localStorage.removeItem("uname")
    if (data.password_reset) {
      window.localStorage.setItem("uid", uid);
      window.location = "./../employee/employee.html";
    } else {
      window.location = "./../auth/reset_pass.html";
    }
  } else {
    //User not found
    document.getElementById("errorMessage").innerHTML = "Invalid email id or password";
    setTimeout(function () {
      document.getElementById("errorMessage").innerHTML = "";
    }, 2000);
  }
};
form.addEventListener("submit", verify);
// setTimeout(function(){
//     document.getElementById("verifying").style.display = "block";
// },500)
