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

  for (let elem of [
    document.querySelector("#editor"),
    document.querySelector("#preview"),
  ])
    elem.style.height = `${
      pageContainer.offsetHeight -
      pageContainer.clientTop * 2 -
      topBar.offsetHeight
    }px`;
};

const setElementsHeights = () => {
  setMainHeight();
  setTextareaHeight();
};

const setModalContent = (elemId) => {
  const modalTitle = document.querySelector(".modal-title");
  const modalBody = document.querySelector(".modal-body");

  if (elemId == "editor-enlarge-btn") {
    modalTitle.innerHTML = "Markdown";
    modalBody.innerHTML = document.getElementById("editor").value;
  } else if (elemId == "preview-enlarge-btn") {
    modalTitle.innerHTML = "Preview";
    modalBody.innerHTML = document.getElementById("preview").value;
  } else {
    modalTitle.innerHTML = "Error";
    modalBody.innerHTML = "Unknown button is clicked!";
  }
};

const setEditorContent = () => {
  document.querySelector("#editor").value = "";
};

let isInPreview = false;

const changeNavLinkInnerHTML = () => {
  isInPreview = !isInPreview;

  const navLink = document.querySelector(".nav-link");
  const editorContainer = document.querySelector("#md-editor");
  const previewContainer = document.querySelector("#md-preview");

  if (isInPreview) {
    navLink.innerHTML = "Edit Markdown";
    previewContainer.style.display = "block";
    editorContainer.style.display = "none";
  } else {
    navLink.innerHTML = "View Preview";
    previewContainer.style.display = "none";
    editorContainer.style.display = "block";
  }
};

window.onload = () => {
  setElementsHeights();
  setEditorContent();

  window.addEventListener("resize", setElementsHeights);
  document.querySelector("#editor").addEventListener("input", (event) => {
    let dirty = marked(event.currentTarget.value);
    let clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });

    let iframe = document.querySelector("#preview");
    iframe =
      iframe.contentWindow ||
      iframe.contentDocument.document ||
      iframe.contentDocument;

    iframe.document.open();
    iframe.document.write(clean);
    iframe.document.close();
  });
};
