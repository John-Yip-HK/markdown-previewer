const setMainHeight = () => {
  const bodyHeight = document.querySelector("body").offsetHeight;
  const navbarHeight = document.querySelector("#navbar").offsetHeight;

  document.querySelector("main").style.height = `${
    bodyHeight - navbarHeight
  }px`;
};

const setTextareaHeight = () => {
  const pageContainer = document.querySelector(".page-container");
  const topBar = document.querySelector(".page-container > .page");

  document.querySelector("textarea").style.height = `${
    pageContainer.offsetHeight -
    pageContainer.clientTop * 2 -
    topBar.offsetHeight
  }px`;
};

const setElementsHeights = () => {
  setMainHeight();
  setTextareaHeight();
};

const setModalBodyContent = (elemId) => {
  if (elemId == "editor-enlarge-btn") {
    document.querySelector(".modal-body").innerHTML =
      document.getElementById("md-editor").value;
  } else if (elemId == "preview-enlarge-btn") {
    document.querySelector(".modal-body").innerHTML =
      document.getElementById("md-preview").value;
  } else {
    document.querySelector(".modal-body").innerHTML =
      "Unknown button is clicked!";
  }
};

window.onload = () => {
  document.querySelector("#preview").style.display = "none";
  setElementsHeights();
};

window.addEventListener("resize", setElementsHeights);
