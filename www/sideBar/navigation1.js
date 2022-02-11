var curr_user;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    curr_user = user;
    //let user_type = get_user_type("admin-users",user.uid)
  } else {
    window.location = "./../auth/login.html";
  }
});
