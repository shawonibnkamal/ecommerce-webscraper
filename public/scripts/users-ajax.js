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

      // Loop through all users to format in table
      for (let i = 0; i < users.length; i++) {
        html += `
              <tr>
                  <td>${users[i].name}</td>
                  <td>${users[i].email}</td>
                <td>
                  <a href="/dashboard/users/edit?email=${users[i].email}"><button class="btn btn-secondary btn-sm">Edit</button></a>
                  <a href="#" onclick="deleteUserHandler(event, '${users[i].email}')" class="btn btn-danger btn-sm">Delete</a>
                </td>
            </tr>
            `;
      }

      // Place the formated html to dom
      $("#list-users .content").html(html);

      // Show success message
      $("#list-users .success").html(response.msg);
      $("#list-users .error").html("");
    },
    error: function (error) {
      // Show error message in console and dom if any error occurs
      console.log("An error has occured");
      console.error(error.responseText);
      $("#list-users .error").html(error.responseText);
      $("#list-users .success").html("");
    },
  });
}

// Post requests

// Add User
function postAddUser(e) {
  e.preventDefault();

  // Serialize form data
  let data = $("#add-user-container form").serialize();

  // print data for debugging purpose
  console.log(data);

  $.ajax({
    type: "post",
    url: "/users/signup",
    data: data,
    dataType: "json",
    success: function (response) {
      // print response to console
      console.log(response);

      // Show success message
      $(".success").text("User created");
      $(".error").text("");
    },
    error: function (error) {
      // print error message to console
      console.error("An error has occured");
      console.error(error.responseText);

      // show error message to dom
      $(".error").text("An error has occured");
      $(".success").text("");
    },
  });
}

// Retrieve user data to fill up the edit form
function getEditUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  // Get request
  $.ajax({
    type: "get",
    url: "/users/" + email,
    dataType: "json",
    success: function (response) {
      console.log(response);

      // Fill up the form with the information retrieved
      $("#edit-user-container input[name=name]").val(response.name);
      $("#edit-user-container input[name=email]").val(response.email);
      $("#edit-user-container input[name=password]").val("");

      // Show success message
      $("#list-users .success").html(response.msg);
      $("#list-users .error").html("");
    },
    error: function (error) {
      // Display error message if any error occurs
      console.log("An error has occured");
      console.error(error.responseText);
      $("#list-users .error").html(error.responseText);
      $("#list-users .success").html("");
    },
  });
}

// Put Request to update user
// Add User
function putUpdateUser(e) {
  e.preventDefault();

  // Serialize form data
  let data = $("#edit-user-container form").serialize();
  const email = $("#edit-user-container input[name=email]").val();

  // print data for debugging purpose
  console.log(data);

  // PUT request
  $.ajax({
    type: "put",
    url: "/users/" + email,
    data: data,
    dataType: "json",
    success: function (response) {
      // print response to console
      console.log(response);

      // Show success message
      $(".success").text("User updated");
      $(".error").text("");
    },
    error: function (error) {
      // print error message to console
      console.error("An error has occured");
      console.error(error.responseText);

      // show error message to dom
      $(".error").text("An error has occured");
      $(".success").text("");
    },
  });
}

// Delete user handler
function deleteUserHandler(e, email) {
  e.preventDefault();

  // DELETE Request
  $.ajax({
    type: "delete",
    url: "/users/" + email,
    dataType: "json",
    success: function (response) {
      // print response to console
      console.log(response);

      // Show success message
      $(".success").text("User deleted");
      $(".error").text("");

      // Reload page
      location.reload();
    },
    error: function (error) {
      // print error message to console
      console.error("An error has occured");
      console.error(error.responseText);

      // show error message to dom
      $(".error").text("An error has occured");
      $(".success").text("");
    },
  });
}

// Authentication ========================================================
// =========================================================================

// post request to login
function login(e) {
  e.preventDefault();

  // get form data
  let data = $(".login-box-body form").serialize();

  // print data for debugging purpose
  console.log(data);

  // POST request
  $.ajax({
    type: "post",
    url: "/users/login",
    data: data,
    dataType: "json",
    success: function (response) {
      // if succeeded
      console.log(response);

      // Store token in localstorage
      localStorage.setItem("webscrapper-token", response.token);

      // Display success message
      $(".login-box-body .success").text(response.message);
      $(".login-box-body .error").text("");

      // Redirect to dashbaord page if sucessful
      if (response.message != "Invalid credentials") {
        location.href = "/dashboard";
      } else {
        // Else show error message to user
        $(".login-box-body .success").text("");
        $(".login-box-body .error").text("Invalid credentials");
      }
    },
    error: function (error) {
      // If any error occurs

      // Print error message to console
      console.error("An error has occured");
      console.error(error.responseText);

      // Show error message in dom
      $(".login-box-body .error").text("An error has occured");
      $(".login-box-body .success").text("");
    },
  });
}

// this function verifies if the user is logged in
// by retrieving the token from local storage
function getAuthenticatedUser() {
  // get request
  const token = localStorage.getItem("webscrapper-token");

  // redirect to login page if token not present
  if (!token) {
    location.href = "/";
  }

  // verify token
  // GET request
  $.ajax({
    type: "get",
    url: "/users/profile?secret_token=" + token,
    dataType: "json",
    success: function (response) {
      // Print response to console for debugging purpose
      console.log(response);

      // Set user_name in navbar
      $("#user_name").text(response.user.name);
      // Update url for edit user button
      $("#user_edit").attr(
        "href",
        "/dashboard/users/edit?email=" + response.user.email
      );
    },
    error: function (error) {
      // Print error message in console
      console.log("An error has occured");
      console.error(error.responseText);

      // redirect to login page if token not present
      location.href = "/";
    },
  });
}

// logout user
function logout(e) {
  e.preventDefault();

  // Remove token for localstorage
  localStorage.removeItem("webscrapper-token");

  // redirect to login page
  location.href = "/";
}
