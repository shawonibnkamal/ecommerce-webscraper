// Animate Sync Icon
var deg = 2; // starting
var rotation_diff = 30; // you can change it to 2 if you want to rotate 2 deg in each second
var run_animation = true;

// animation for the sync icon
function animateSyncIcon() {
  deg = 2; // starting
  rotation_diff = 30; // you can change it to 2 if you want to rotate 2 deg in each second
  run_animation = true;
  recursiveAnimation();
}

// Recursive animation that rotates the sync icon
function recursiveAnimation() {
  var img = document.getElementById("sync-icon");

  img.style.webkitTransform = "rotate(" + deg + "deg)";
  img.style.transform = "rotate(" + deg + "deg)";
  img.style.MozTransform = "rotate(" + deg + "deg)";
  img.style.msTransform = "rotate(" + deg + "deg)";
  img.style.OTransform = "rotate(" + deg + "deg)";

  if (run_animation) {
    setTimeout("recursiveAnimation()", 100);
  }
  deg = deg + rotation_diff;
}

// Turn of animation for the sync icon
function stopSyncIcon() {
  run_animation = false;
}

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
