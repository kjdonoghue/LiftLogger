// function for opening and closing hamburger menu
function myFunction() {
    let menuLinks = document.getElementById("menuLinks");
    if (menuLinks.style.display === "block") {
      menuLinks.style.display = "none";
    } else {
      menuLinks.style.display = "block";
    }
  }


  function showBadge() {
    let div = document.getElementById("badge")

    div.innerHTML = 'the badge will go here'


  }