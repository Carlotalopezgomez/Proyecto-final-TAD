// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; 
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; 
      criticalElement.appendChild(resultDocument);
      
      
      calculateWordCount();
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  
  documentLoader();
  statsLoader();

  // Event listener for sel1 change
  function selectHand(event) {
  var visible_mary = document.getElementsByClassName('#MWS');
  var visible_percy = document.getElementsByClassName('#PBS');
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
    if (event.target.value == 'both') {
    //write an forEach() method that shows all the text written and modified by both hand (in black?). The forEach() method of Array instances executes a provided function once for each array element.
     MaryArray.forEach(function(el) {
      el.style.color = "black";
      el.style.backgroundColor = "transparent";
    });

    PercyArray.forEach(function(el) {
      el.style.color = "black";
      el.style.backgroundColor = "transparent";
    });

    } else if (event.target.value == 'Mary') {
     //write an forEach() method that shows all the text written and modified by Mary in a different color (or highlight it) and the text by Percy in black. 
     MaryArray.forEach(function(el) {
      el.style.color = "red";
      el.style.backgroundColor = "transparent";
    });

    PercyArray.forEach(function(el) {
      el.style.color = "black";
      el.style.backgroundColor = "transparent";
    });

    } else {
     //write an forEach() method that shows all the text written and modified by Percy in a different color (or highlight it) and the text by Mary in black.
    PercyArray.forEach(function(el) {
      el.style.color = "green";
      el.style.backgroundColor = "transparent";
    });

    MaryArray.forEach(function(el) {
      el.style.color = "black";
      el.style.backgroundColor = "transparent";
    });

    }
  }
// write another function that will toggle the display of the deletions by clicking on a button
function toggleDeletions() {
  var deletions = document.getElementsByTagName("del");
  var deletionsArray = Array.from(deletions);

  deletionsArray.forEach(function(el) {
    if (el.style.display === "none") {
      el.style.display = "inline";
    } else {
      el.style.display = "none";
    }
  });
}

// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline (not in superscript)
let readingMode = false;

function toggleReadingMode() {
    readingMode = !readingMode;
    console.log("Reading mode activated:", readingMode);

    const deletions = document.querySelectorAll("del");
    const supraAdds = document.querySelectorAll(".supraAdd");
    const infraAdds = document.querySelectorAll(".infraAdd");

    deletions.forEach(el => {
        el.style.setProperty('display', readingMode ? 'none' : 'inline', 'important');
    });

    supraAdds.forEach(el => {
        el.style.verticalAlign = readingMode ? "baseline" : "super";
        el.style.fontSize = readingMode ? "inherit" : "0.8em";
        el.style.color = readingMode ? "#2d4f3c" : "inherit"; 
    });

    infraAdds.forEach(el => {
        el.style.verticalAlign = readingMode ? "baseline" : "sub";
        el.style.fontSize = readingMode ? "inherit" : "0.8em";
    });
}


// Function to calculate word count
function calculateWordCount() {
  const transcriptionElement = document.querySelector('.transcription');
  if (transcriptionElement) {
    const textContent = transcriptionElement.textContent;
    const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wordCountDisplay = document.getElementById('wordCountDisplay');
    if (wordCountDisplay) {
      wordCountDisplay.textContent = wordCount;
    }
  }
}

// Navigation between pages
const pageSequence = ['21r', '21v', '22r', '22v', '23r', '23v', '24r', '24v', '25r', '25v'];

function setupNavigation() {
  const currentPageElement = document.getElementById('folio');
  const currentPage = currentPageElement ? currentPageElement.textContent.trim() : null;
  
  if (!currentPage || !pageSequence.includes(currentPage)) {
    return; 
  }
  
  const currentIndex = pageSequence.indexOf(currentPage);
  
  const prevButton = document.getElementById('prevPage');
  if (prevButton) {
    if (currentIndex === 0) {
      prevButton.disabled = true;
      prevButton.style.opacity = '0.5';
    } else {
      prevButton.onclick = function() {
        window.location.href = pageSequence[currentIndex - 1] + '.html';
      };
    }
  }
  
  const nextButton = document.getElementById('nextPage');
  if (nextButton) {
    if (currentIndex === pageSequence.length - 1) {
      nextButton.disabled = true;
      nextButton.style.opacity = '0.5';
    } else {
      nextButton.onclick = function() {
        window.location.href = pageSequence[currentIndex + 1] + '.html';
      };
    }
  }
}

setupNavigation();




