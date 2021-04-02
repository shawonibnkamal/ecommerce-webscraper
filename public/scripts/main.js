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
