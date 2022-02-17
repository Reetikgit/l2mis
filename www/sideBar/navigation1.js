var curr_user;
firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
    // User is signed in.
    curr_user = user;
    window.localStorage.setItem("uid", curr_user.uid);
    let Dbdata = await getDbData({
      collectionName: "employee",
      docId: curr_user.uid,
    });
    let data = Dbdata.data;
    //let user_type = get_user_type("admin-users",user.uid)
    window.localStorage.setItem("uname", data.fname);
    document.getElementById("e_img").src=data.image
    if (document.getElementById("daily_name")){
        document.getElementById("daily_name").innerHTML = data.fname;
    }

    
  } else {
    window.location = "./../auth/login.html";
  }
});
