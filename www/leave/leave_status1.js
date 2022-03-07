$(document).ready(function () {
  // inspired by http://jsfiddle.net/arunpjohny/564Lxosz/1/


  // document ready
});

const displayLeave_Status = async (e) => {
    let Dbdata = await getDbCollData("request_leave");
    document.getElementById("tableBody").innerHTML = "";
    Dbdata.data.map(async (d) => {
    if(d._id == window.localStorage.getItem("uid")){
        let objData = d.data;
        console.log(objData)
        let color="red"
        for(let i=objData.leaves.length-1;i>=0;i-- ){
            let data = objData.leaves[i];
            console.log(data)
            if(data.status=="confirmed"){
                data.status="Accepted"
                color="green"
            }
            if(data.status=="pending"){
                data.status="Pending"
                color="orange"
            }
            if(data.status=="rejected"){
                data.status="Rejected"
                color="red"
            }
            document.getElementById("tableBody").innerHTML +=
            `
            <span style="float:right;padding:5px;background:`+color+`;color:white;font-weight:600" >`+data.status+`</span>
            <tr> 
                  <td>` +
            data.type +
            `</td>
                  <td>` +
            data.days +
            `</td>
            <td>` +
            data.dates +
            `</td>
                  <td>` +
            data.description +
            `
              </tr>
              `;
        }
        
    }
    
    });
    setTimeout(function () {
    
    //   let table1 = document.querySelector("#tableOne");
    //   let dataTable = new simpleDatatables.DataTable(table1);
    $(".table-responsive-stack").each(function (i) {
        var id = $(this).attr("id");
        //alert(id);
        $(this)
          .find("th")
          .each(function (i) {
            $("#" + id + " td:nth-child(" + (i + 1) + ")").prepend(
              '<span class="table-responsive-stack-thead">' +
                $(this).text() +
                ":</span> "
            );
            $(".table-responsive-stack-thead").hide();
          });
      });
    
      $(".table-responsive-stack").each(function () {
        var thCount = $(this).find("th").length;
        var rowGrow = 100 / thCount + "%";
        //console.log(rowGrow);
        $(this).find("th, td").css("flex-basis", rowGrow);
      });
    
      function flexTable() {
        if ($(window).width() < 768) {
          $(".table-responsive-stack").each(function (i) {
            $(this).find(".table-responsive-stack-thead").show();
            $(this).find("thead").hide();
          });
    
          // window is less than 768px
        } else {
          $(".table-responsive-stack").each(function (i) {
            $(this).find(".table-responsive-stack-thead").hide();
            $(this).find("thead").show();
          });
        }
        // flextable
      }
    
      flexTable();
    
      window.onresize = function (event) {
        flexTable();
      };
     
    }, 10);
  };
  setTimeout(function () {
    displayLeave_Status();
  }, 1000);