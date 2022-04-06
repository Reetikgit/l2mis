// setTimeout(function () {
//   firebase.auth().onAuthStateChanged(async function (user) {
//     if (user) {
//       // User is signed in.
//       curr_user = user;
//       console.log(curr_user.uid);
//       let Dbdata = await getDbData({
//         collectionName: "employee",
//         docId: curr_user.uid,
//       });

//       let data = Dbdata.data;
//       console.log(data);
//       document.getElementById("daily_name").innerHTML = data.fname;
//       //let user_type = get_user_type("admin-users",user.uid)
//     } else {
//       window.location = "./../auth/login.html";
//     }
//   });

// },500);
setTimeout(async function () {
    let check_login_status = await getDbSubCollData({
      collectionName: "attendance",
      docId: new Date().toUTCString().slice(5, 16),
      subCollName: window.localStorage.getItem("uid"),
      subDocId: window.localStorage.getItem("uid"),
    });
  
    let status = check_login_status.data;
    if (check_login_status.data) {
      console.log(check_login_status.data)
      //  window.location = "../employee/employee.html";
    }
  },10);