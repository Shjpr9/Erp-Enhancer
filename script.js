// Function to apply the desired width to the #box_Content element
function resizeBoxContent(iframeDocument) {
  const boxContent = iframeDocument.getElementById("box_Content");
  if (boxContent) {
    console.log("Found #box_Content element:", boxContent);
    boxContent.style.width = "90%"; // Set your desired width here
    console.log("Applied new width to #box_Content:", boxContent.style.width);
  } else {
    console.error("Could not find #box_Content element in iframe.");
  }
}

function applyAdditionalStyles(iframeDocument) {
  const headerTableRow = iframeDocument.querySelector("table.mxgrid_header tr").childNodes;
  const firstTableRow = iframeDocument.querySelector("div#mxgrid_table_container tr").childNodes;
  iframeDocument.querySelector("div#mxgrid_table_container").style = "height:710px !important; width:100% !important";

  // change course name column
  firstTableRow[2].style = "width: 220px;";
  headerTableRow[2].style = "width: 220px;";

  // change exam time column
  firstTableRow[5].style = "width: 200px;";
  headerTableRow[5].style = "width: 200px;";

  // change level column
  firstTableRow[6].style = "width: 60px;";
  headerTableRow[6].style = "width: 60px;";

  console.log("Applied additional styles to table rows");
}

// Function to monitor the iframe's content
function monitorIframe(iframe) {
  if (iframe) {
    console.log("Iframe found. Waiting for it to load...");

    // Wait for the iframe to load
    iframe.onload = () => {
      console.log("Iframe loaded. Checking for #box_Content...");
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      // Apply the style to #box_Content
      resizeBoxContent(iframeDocument);
      applyAdditionalStyles(iframeDocument);

      // Observe DOM changes inside the iframe to handle dynamically added elements
      const iframeObserver = new MutationObserver((mutationsList) => {
        console.log("DOM changed inside iframe. Checking for #box_Content...");
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            console.log(
              "Child nodes added or removed. Resizing #box_Content..."
            );
            resizeBoxContent(iframeDocument);
            applyAdditionalStyles(iframeDocument);
          }
        }
      });

      // Start observing the iframe's document
      iframeObserver.observe(iframeDocument.body, {
        childList: true,
        subtree: true,
      });
    };
  } else {
    console.error("Iframe not found.");
  }
}

// Observe the main document for changes to detect when the iframe is added or modified
const mainObserver = new MutationObserver((mutationsList) => {
  console.log("DOM changed in main document. Checking for iframe...");
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const iframe = document.getElementById("iframe_7717"); // Use the iframe's ID
      if (iframe) {
        console.log("Iframe detected. Setting up monitoring...");
        monitorIframe(iframe);
      }
    }
  }
});

// Start observing the main document
mainObserver.observe(document.body, { childList: true, subtree: true });

// Initial check in case the iframe is already present
console.log("Initial check for iframe...");
const initialIframe = document.getElementById("iframe_7717");
if (initialIframe) {
  monitorIframe(initialIframe);
} else {
  console.error("Initial iframe not found.");
}
