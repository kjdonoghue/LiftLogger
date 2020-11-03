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
      div.innerHTML = `<img src="images/sample-badge.png"/>`
    } else if (numWorkout >1) {
      div.innerHTML = `<img src="images/sample-badge.png"/>`
    } else {
      var message = "this isn't working"
    }

     
    
  }