const setMainHeight = () => {
  const bodyHeight = document.getElementsByTagName("body")[0].offsetHeight;
  const navbarHeight = document.getElementById("navbar").offsetHeight;

  document.getElementsByTagName("main")[0].style.height = `${
    bodyHeight - navbarHeight
  }px`;
};

const setTextareaHeight = () => {
  const bodyHeight = document.getElementsByTagName("body")[0].offsetHeight;
  const navbarHeight = document.getElementById("navbar").offsetHeight;
  const topBarHeight = document.getElementById("top-bar").offsetHeight;

  document.getElementsByClassName("editor")[0].style.height = `${
    bodyHeight - navbarHeight - topBarHeight - 2
  }px`;
};

window.onload = () => {
  setMainHeight();
  setTextareaHeight();
};

window.addEventListener("resize", (event) => {
  setMainHeight();
  setTextareaHeight();
});
