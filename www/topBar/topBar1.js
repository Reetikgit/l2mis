const displaynotification = async (e) => {
    let Dbdata = await getDbCollData("notification_to_employee");
    let count=0;
    Dbdata.data.map(async (d) => {
    if(d._id==window.localStorage.getItem("uid")){
        let objData = d.data;
        console.log(objData)
             
                count++;
                document.getElementById("notify_count").innerHTML = count;
                document.getElementById("content").innerHTML += `
                <div class="col-md-12 notif">
                    <a href="./../leave/leave_status.html"
                    >
                    <h6 class="text-xs">Your request for `+objData.type+` applied for `+(objData).days+` days has been `+(objData.status)+` by the admin</h6></a
                    >
                </div>`
    }

      
   
    });
  };
  setTimeout(function () {
    displaynotification();
  }, 1000);
  