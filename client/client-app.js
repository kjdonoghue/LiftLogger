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
    
    if (numWorkout >=50) {
      div.innerHTML = `<img src="images/ten-badge.png"/>`
    } else if (numWorkout >=25) {
      div.innerHTML = `<img src="images/ten-badge.png"/>`
    } else if (numWorkout >=10) {
      div.innerHTML = `<img src="images/ten-badge.png"/>`
    } else {
      div.innerHTML = `<img src="images/ten-badge.png"/>`
    }
    
  }