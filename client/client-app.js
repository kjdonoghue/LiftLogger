/***************************** NAV MENU ***************************** */
function myFunction() {
    let menuLinks = document.getElementById("menuLinks");
    if (menuLinks.style.display === "block") {
      menuLinks.style.display = "none";
    } else {
      menuLinks.style.display = "block";
    }
  }
  /***************************** WORKOUT BADGES ***************************** */

  async function showBadge(numWorkout) {
    let div = document.getElementById("badge")
    
    if (numWorkout >= 100) {
      div.innerHTML = `<img src="images/hundred-badge.png"/>`
    } else if (numWorkout >=50) {
      div.innerHTML = `<img src="images/fifty-badge.png"/>`
    } else if (numWorkout >=25) {
      div.innerHTML = `<img src="images/twenty-five-badge.png"/>`
    } else if (numWorkout >=10) {
      div.innerHTML = `<img src="images/ten-badge.png"/>`
    } else {
      div.innerHTML = `<img src="images/newbie-badge.png"/>`
    }
    
  }

/***************************** TIMER ***************************** */
  
let timer = document.getElementById("timer")
   
//sets timer on screen and starts countdown

function setTimer(minutes) {
  timer.innerHTML =
    minutes + ":" + 00
  startTimer()
}

function startTimer() {
  let presentTime = timer.innerHTML
  let timeArray = presentTime.split(/[:]+/)
  let m = timeArray[0]
  var s = checkSecond((timeArray[1] - 1))
  if (s == 59) {
    m = m - 1
  }

  timer.innerHTML = m + ":" + s
  let countdown = setTimeout(startTimer, 1000) //starts countdown

  if (m == 0 && s == 00) {
    console.log('timer completed')
    clearTimeout(countdown) //stops countdown when 0:00
  }
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) { sec = "0" + sec } // add zero in front of numbers < 10
  if (sec < 0) { sec = "59" } //resets to 59 seconds
  return sec
}    
