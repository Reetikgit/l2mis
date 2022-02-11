firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      // User is signed in.
      curr_user = user;
      console.log(curr_user.uid)
      let Dbdata = await getDbData({collectionName:"employee",docId:curr_user.uid});
      
      let data=(Dbdata.data)
      console.log(data)
      document.getElementById("name").innerHTML=data.fname
      document.getElementById("img").src=data.image
      //let user_type = get_user_type("admin-users",user.uid)
    } else {
      window.location = "./../auth/login.html";
    }
  });

