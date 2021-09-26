// Need to think a way to extract Bootstrap SASS variable into JavaScript.

const changeNavLinkInnerHTML = (navLinkTitle) => {
  const navLink = document.querySelector(".nav-link");
  const editorContainer = document.querySelector("#md-editor");
  const previewContainer = document.querySelector("#md-preview");

  if (navLinkTitle === "View Preview") {
    navLink.innerHTML = "Edit Markdown";

    previewContainer.style.display = "block";
    editorContainer.style.display = "none";

    setIFrameConfig(document.querySelector("#preview"));
  } else {
    navLink.innerHTML = "View Preview";

    previewContainer.style.display = "none";
    editorContainer.style.display = "block";
  }
};

const setMainHeight = () => {
  const bodyHeight = document.body.offsetHeight;
  const navbarHeight = document.querySelector("#navbar").offsetHeight;

  document.querySelector("main").style.height = `${
    bodyHeight - navbarHeight
  }px`;
};

const setDisplayAreaHeight = () => {
  const pageContainer =
    document.querySelector("#md-editor").offsetHeight > 0
      ? document.querySelector("#md-editor")
      : document.querySelector("#md-preview");
  const topBar = pageContainer.firstElementChild;

  for (let elem of [
    document.querySelector("#editor"),
    document.querySelector("#preview"),
  ]) {
    elem.style.height = `${
      pageContainer.offsetHeight -
      pageContainer.clientTop * 2 -
      topBar.offsetHeight
    }px`;
  }

  if (document.body.offsetWidth >= 992) {
    document.querySelector("#md-editor").style.display = "block";
    document.querySelector("#md-preview").style.display = "block";
  } else {
    if (
      document.querySelector("#edit-or-preview").innerHTML === "View Preview"
    ) {
      document.querySelector("#md-editor").style.display = "block";
      document.querySelector("#md-preview").style.display = "none";
    } else {
      document.querySelector("#md-editor").style.display = "none";
      document.querySelector("#md-preview").style.display = "block";
    }
  }
};

const setupElements = () => {
  setMainHeight();
  setDisplayAreaHeight();
};

const setIFrameConfig = (iframe) => {
  const configs = [
    {
      cssSelector: "pre",
      configFunction: (elem) => (elem.style.whiteSpace = "pre-wrap"),
    },
    {
      cssSelector: "img",
      configFunction: (elem) => (elem.style.width = "100%"),
    },
    {
      cssSelector: "a",
      configFunction: (elem) => elem.setAttribute("target", "_blank"),
    },
    {
      cssSelector: "pre, code",
      configFunction: (elem) => {
        elem.style.background = "#FFF";
        elem.style.fontWeight = "600";
      },
    },
    {
      cssSelector: "blockquote",
      configFunction: (elem) => {
        elem.style.fontSize = "1.5rem";
        elem.style.fontFamily = '"Book Antiqua", serif';
      },
    },
    {
      cssSelector: "table",
      configFunction: (elem) => {
        elem.style.borderCollapse = "collapse";
      },
    },
    {
      cssSelector: "th, td",
      configFunction: (elem) => {
        elem.style.border = "2px solid black";
        elem.style.padding = "2px 5px";
      },
    },
    {
      cssSelector: "body",
      configFunction: (elem) => {
        elem.style.fontFamily = "Verdana, sans-serif";
      },
    },
  ];

  for (let config of configs) {
    Array.from(
      iframe.contentDocument.querySelectorAll(config["cssSelector"])
    ).map(config["configFunction"]);
  }
};

const setModalContent = (elemId) => {
  const modalTitle = document.querySelector(".modal-title");
  const modalBody = document.querySelector(".modal-body");

  if (elemId == "editor-enlarge-btn") {
    modalTitle.innerHTML = "Markdown";

    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = document.getElementById("editor").value;
    modalBody.append(contentDiv);
  } else if (elemId == "preview-enlarge-btn") {
    modalTitle.innerHTML = "Preview";

    const previewIFrameBody =
      document.querySelector("#preview").contentDocument.body;
    const iframe = document.createElement("iframe");

    modalBody.append(iframe);
    modalBody.style.height = `${previewIFrameBody.scrollHeight}px`;
    modalBody.style.overflowY = "clip";

    iframe.contentDocument.write(previewIFrameBody.innerHTML);
    iframe.style.height = `${previewIFrameBody.scrollHeight}px`;

    setIFrameConfig(iframe);
  } else {
    modalTitle.innerHTML = "Error";

    modalBody.innerHTML = "You have pressed an unknown button.";
  }
};

const clearModalBody = () => {
  setTimeout(() => {
    const modalBody = document.querySelector(".modal-body");
    modalBody.lastElementChild.remove();
    modalBody.removeAttribute("style");
  }, 300);
};

const setEditorContent = () => {
  const markdownPerSection = [
    "# Welcome to my Bootstrap Markdown Previewer!",
    "## This is a sub-heading...\n### And here's some other cool stuff:",
    "Heres some code, `<div></div>`, between 2 backticks.",
    "```\n// this is multi-line code:",
    "function anotherExample(firstLine, lastLine) {\n\tif (firstLine == '```' && lastLine == '```') {\n\t\treturn multiLineCode;\n\t}\n}\n```",
    "You can also make text **bold**... whoa!\nOr _italic_.\nOr... wait for it... **_both!_**\nAnd feel free to go crazy ~~crossing stuff out~~.",
    "There's also [links](https://www.freecodecamp.org), and\n> Block Quotes!",
    "And if you want to get really crazy, even tables:",
    "Wild Header | Crazy Header | Another Header?\n------------ | ------------- | -------------\nYour content can | be here, and it | can be here....\nAnd here. | Okay. | I think we get it.",
    "- And of course there are lists.\n\t- Some are bulleted.\n\t\t- With different indentation levels.\n\t\t\t- That look like this.",
    "1. And there are numbered lists too.\n1. Use just 1s if you want!\n1. And last but not least, let's not forget embedded images:",
    "![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)",
  ];
  document.querySelector("#editor").value = markdownPerSection.join("\r\r");
};

const parseMarkdown = (md) => {
  let dirty = marked(md, {
    breaks: true,
  });
  let clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });

  let iframeDocument = document.querySelector("#preview").contentDocument;

  iframeDocument.write(clean);
  iframeDocument.close();
};

window.onload = () => {
  setupElements();
  setEditorContent();
  parseMarkdown(document.querySelector("#editor").value);
  setIFrameConfig(document.querySelector("#preview"));

  window.addEventListener("resize", setupElements);
  document.querySelector("#editor").addEventListener("input", (event) => {
    parseMarkdown(event.currentTarget.value);
    setIFrameConfig(document.querySelector("#preview"));
  });
};
