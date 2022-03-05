const getLeaves = async (e) => {
  let Dbdata = await getDbCollData("leave");
  Dbdata.data.map(async (d) => {
    let objData = d.data;
    document.getElementById("leaveType_dropdown").innerHTML +=
      `
      <option value="` +
      objData.name +
      `">` +
      objData.name +
      `</option>
      `;
  });
};
setTimeout(function () {
  getLeaves();
}, 500);
const form = document.querySelector("#leave");
const applyLeave = async (e) => {
  e.preventDefault();
  let day = form["days"].value;
  let dates = form["dates"].value;
  let desc = form["desc"].value;
  let type = document.getElementById("leaveType_dropdown").value;
  let status = "pending";
  let id = window.localStorage.getItem("uid");
  let arr = [];
  let data1 = {
    days: day,
    dates: dates,
    description: desc,
    type: type,
    status: status,
    id: id,
    createdAt: new Date().toString(),
  };
  let res1 = await db.collection("request_leave").doc(id).get();
  if (res1.data()) {
      if(res1.data().leaves){
        for(let i in res1.data().leaves ){
            arr.push(res1.data().leaves[i])
        }
      }
     
  }
  arr.push(data1);
  let data2 = window.localStorage.getItem("data");
  let final_data = {
    leaves: arr,
    data: data2,
  };

  let res = await setDbData({
    collectionName: "request_leave",
    docId: id,
    dataToUpdate: final_data,
  });
  document.getElementById("dialog-label").innerHTML = "Success";
  document.getElementById("dialog-message").innerHTML =
    "Leave applied Successfully";
  $("#dialog").modal("show");
};
form.addEventListener("submit", applyLeave);
