// Users functions ===============================================
// ==================================================================

// get products functions
function getAllUsers() {
  $.ajax({
    type: "get",
    url: "/users",
    dataType: "json",
    success: function (response) {
      console.log(response);
      let users = response.users;
      let html = "";
      for (let i = 0; i < users.length; i++) {
        html += `
              <tr>
                  <td>${users[i].name}</td>
                  <td>${users[i].email}</td>
                <td>
                  <a href=""><button class="btn btn-secondary btn-sm">Edit</button></a>
                  <a href="#" onclick="deleteProductHandler(event, '${users[i]._id}')" class="btn btn-danger btn-sm">Delete</a>
                </td>
            </tr>
            `;
      }
      $("#list-users .content").html(html);
      $("#list-users .success").html(response.msg);
      $("#list-users .error").html("");
    },
    error: function (error) {
      console.log("An error has occured");
      console.error(error.responseText);
      $("#list-users .error").html(error.responseText);
      $("#list-users .success").html("");
    },
  });
}
