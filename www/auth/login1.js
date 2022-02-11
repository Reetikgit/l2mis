
firebase.auth().onAuthStateChanged(function(user) {
   
    if (user) {
        // User is signed in.
        window.location = "./../employee/employee.html";
    } else {
        
        // User is signed out.
        setTimeout(function(){
            document.getElementById("loading").style.display = "none";
        },300)
       
    }
});
const form = document.querySelector("#login");
const verify = async(e) => {
    e.preventDefault();
    let email = form["email"].value;
    let password = form["password"].value;
    let res = await login({ email: email, password: password });
    if (res.user) {
        window.localStorage.setItem("email", email);
        window.localStorage.setItem("key", password);
        window.location = "./../employee/employee.html";
    } else {
        //User not found
        document.getElementById("errorMessage").innerHTML =
            "Email or password incorrect";
        setTimeout(function() {
            document.getElementById("errorMessage").innerHTML = "";
        }, 2000);
    }
};
form.addEventListener("submit", verify);
setTimeout(function(){
    document.getElementById("loading").style.display = "block";
},500)