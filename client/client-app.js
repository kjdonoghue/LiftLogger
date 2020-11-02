// function for opening and closing hamburger menu
function myFunction() {
    let menuLinks = document.getElementById("menuLinks");
    if (menuLinks.style.display === "block") {
      menuLinks.style.display = "none";
    } else {
      menuLinks.style.display = "block";
    }
  }


  async function showBadge(numWorkout) {
    let div = document.getElementById("badge")
    
    if (numWorkout <=1) {
      var message = "one workout"
    } else if (numWorkout >1) {
      var message = "more than one workout"
    } else {
      var message = "this isn't working"
    }

      div.innerHTML = message
    
  }