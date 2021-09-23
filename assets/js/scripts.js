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

const setMainHeight = () => {
  const bodyHeight = document.querySelector("body").offsetHeight;
  const navbarHeight = document.querySelector("#navbar").offsetHeight;

  document.querySelector("main").style.height = `${
    bodyHeight - navbarHeight
  }px`;
};

const setDisplayAreaHeight = () => {
  const pageContainerId = isInPreview ? "#md-preview" : "#md-editor";
  const pageContainer = document.querySelector(pageContainerId);
  const topBar = pageContainer.firstElementChild;

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
  setDisplayAreaHeight();
};

const setModalContent = (elemId) => {
  const modalTitle = document.querySelector(".modal-title");
  const modalBody = document.querySelector(".modal-body");

  if (elemId == "editor-enlarge-btn") {
    modalTitle.innerHTML = "Markdown";
    modalBody.innerHTML = document.getElementById("editor").value;
  } else if (elemId == "preview-enlarge-btn") {
    modalTitle.innerHTML = "Preview";

    // Create an iframe and copy content in #preview into this iframe.
    const iframe = document.createElement("iframe");
    iframe =
      iframe.contentWindow ||
      iframe.contentDocument.document ||
      iframe.contentDocument;

    iframe.document.open();
    iframe.document.write("<h1>Hello World!</h1>");
    iframe.document.close();

    modalBody.append(iframe);
  } else {
    modalTitle.innerHTML = "Error";
    modalBody.innerHTML = "Unknown button is clicked!";
  }
};

const setEditorContent = () => {
  document.querySelector("#editor").value = "";
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
