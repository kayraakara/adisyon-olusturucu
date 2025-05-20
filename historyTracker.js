// historyTracker.js


const currentPage = window.location.pathname.split("/").pop();


let navHistory = JSON.parse(sessionStorage.getItem("navHistory")) || [];

if (navHistory[navHistory.length - 1] !== currentPage) {
  navHistory.push(currentPage);
}

sessionStorage.setItem("navHistory", JSON.stringify(navHistory));


function goBack() {


  let navHistory = JSON.parse(sessionStorage.getItem("navHistory")) || [];

  if (navHistory.length > 1) {

    navHistory.pop();

    const previous = navHistory[navHistory.length - 1];
    sessionStorage.setItem("navHistory", JSON.stringify(navHistory));
    location.href = previous;
  } else {
    location.href = "index.html";
  }
}