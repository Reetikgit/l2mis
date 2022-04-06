var curr_user;
if (document.getElementById("daily_name")){
  document.getElementById("daily_name").innerHTML = window.localStorage.getItem("uname");
}
setTimeout(function(){
  document.getElementById("e_img").src=window.localStorage.getItem("image");
},200)

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
    window.localStorage.setItem("data", JSON.stringify(data));
    window.localStorage.setItem("uname", data.fname);
    window.localStorage.setItem("image", data.image)
    document.getElementById("e_img").src=data.image
    if (document.getElementById("daily_name")){
        document.getElementById("daily_name").innerHTML = data.fname;
    }

    
  } else {
    window.location = "./../auth/login.html";
    window.localStorage.removeItem("uid")
  }
  cordova.getAppVersion.getVersionNumber(function (version) {
    version="1.0.4"
    document.getElementById("version_number").innerHTML=version;
  });
});


// Check network status 

document.addEventListener("offline", onOffline, false);

function onOffline() {
    // Handle the offline event
    window.location="./../network/not_found.html"
} 
