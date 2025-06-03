"use client"
import React, { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";

export default function Home() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "F9":
          event.preventDefault();
          GeneratePrefix();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const { Canvas } = useQRCode();
  const StrQRContent = React.useRef<HTMLInputElement>(null);
  const etLocation = React.useRef<HTMLSelectElement>(null);
  const etAccount = React.useRef<HTMLSelectElement>(null);
  const etPerolehan = React.useRef<HTMLInputElement>(null);
  const [qrData, setqrData] = useState("");
  const GeneratePrefix = () => {
    if (StrQRContent.current && etLocation.current && etPerolehan.current && etAccount.current) {
      const selectedDate = new Date(etPerolehan.current.value);
      //const yyMM = `${selectedDate.getFullYear().toString().slice(-2)}${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}`;
      const yyMM = `${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}`;
      //StrQRContent.current.value = `${etLocation.current.value}-${etAccount.current.value}-${yyMM}-`;
      StrQRContent.current.value = `${etAccount.current.value}${yyMM}`;
    }
  }
  const GenerateQRCode = () => {
    if (StrQRContent.current) {
      setqrData(StrQRContent.current.value);

      // Wait for QR Code to update first
      setTimeout(() => {
        const getcanvas = document.querySelector("canvas");
        if (!getcanvas) {
          alert("cannot found canvas");
          return;
        }
        const printFrame = document.createElement("iframe");
        printFrame.style.position = "absolute";
        printFrame.style.width = "0px";
        printFrame.style.height = "0px";
        printFrame.style.border = "none";
        document.body.appendChild(printFrame);

        const doc = printFrame.contentDocument || printFrame.contentWindow?.document;
        doc?.open();
        doc?.write(`
          <html>
            <head>
              <title>Print Preview</title>
              <style>
                @page {
                  size: 3cm 2cm;
                  margin: 0cm;
                }

                Got it. "Overlapped" definitely points to issues with the available space not being correctly distributed, especially with such a tiny print area.

Let's adjust the grid percentages for the left and right sides to 60%/40% and specifically set the bottom-right image to 25px. We'll also maintain the object-fit: contain to prevent cropping while ensuring the whole image is visible within its allocated (and now smaller) space.

To avoid overlap, we'll keep the gap property for spacing between the main columns and the inner rows.

HTML

<html>
  <head>
    <title>Print Preview</title>
    <style>
      @page {
        size: 3cm 2cm;
        margin: 0cm; /* No physical paper margin */
      }

      body {
        font-family: Arial, sans-serif;
        display: grid;
        /* Outer Grid: Left 60% (for image), Right 40% (for text + image) */
        grid-template-columns: 60% 40%;
        gap: 2px; /* Small gap between the main left and right halves */
        height: 100vh; /* Take full viewport height for proper layout */
        margin: 0; /* Remove default body margin */
        padding: 2px; /* Small overall padding around the entire content */
        box-sizing: border-box; /* Include padding in element's total width and height */
        overflow: hidden; /* Prevent scrollbars if content overflows */
      }

      /* Styles for the left side (main canvas image) */
      .left-content {
        display: flex; /* Use flexbox to center the image */
        justify-content: center;
        align-items: center;
        overflow: hidden; /* Hide anything that overflows this area */
        /* Optional: Add a border for debugging layout boundaries */
        /* border: 1px dashed blue; */
      }

      .left-content img {
        max-width: 100%; /* Ensure it fits within its column's width */
        max-height: 100%; /* Ensure it fits within its column's height */
        width: 64px; /* Target size if possible */
        height: 64px; /* Target size if possible */
        object-fit: contain; /* KEY: Ensures the image fits without cropping and maintains aspect ratio */
        display: block; /* Removes any extra space below inline images */
      }

      /* Styles for the right side (text and small image) */
      .right-container {
        display: grid; /* Inner Grid: 2 horizontal rows */
        /* SPECIFIC CHANGE: Top for text (30%), Bottom for image (70%) */
        grid-template-rows: 30% 70%;
        gap: 2px; /* Small gap between text and bottom image */
        height: 100%; /* Take full height of its parent grid cell (the right 40%) */
        overflow: hidden; /* Hide anything that overflows this area */
        /* Optional: Add a border for debugging layout boundaries */
        /* border: 1px dashed green; */
      }

      .top-text {
        font-size: 5px; /* Adjust font size, likely even smaller for this layout */
        color: #333;
        text-align: center; /* Center the text horizontally */
        display: flex; /* Use flexbox to vertically center text */
        align-items: center;
        justify-content: center;
        word-wrap: break-word; /* Allow long words to break */
        line-height: 1.1; /* Adjust line height for very small text */
        overflow: hidden; /* Hide overflow text */
        /* Optional: Add a border for debugging layout boundaries */
        /* border: 1px dashed red; */
      }

      .bottom-image {
        display: flex; /* Use flexbox to center the image */
        justify-content: center;
        align-items: center;
        overflow: hidden; /* Hide anything that overflows this area */
        /* Optional: Add a border for debugging layout boundaries */
        /* border: 1px dashed purple; */
      }

      .bottom-image img {
        width: 100%; /* Fixed width for the small image */
        height: 100%; /* Fixed height for the small image */
        object-fit: contain; /* KEY: Ensures it fits without cropping */
        display: block;
      }
              </style>
            </head>
            <body>
                <div class="left-content">
                  <img src="${document.querySelector("canvas")?.toDataURL()}"/>
                </div>

                <div class="right-container">
                  <div class="top-text">
                    PT. INTIDAYA DINAMIKA SEJATI
                  </div>

                  <div class="bottom-image">
                    <img src="LOGO_IDS.jpg" alt="Small Image"/>
                    </div>
                </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => window.close(), 100);
                };
              </script>
            </body>
          </html>
        `);
        doc?.close();
      }, 300); // Delay ensures QR code finishes rendering
    }
  }
  return (
    <div className="container-md pb-0 mt-4">
        <div className="shadow"><label className="d-none form-label">Location</label><select ref={etLocation} className="hidden form-select-sm w-100 border-2" id="etLocation">
                <option value="IDSSBY" defaultValue={"IDSSBY"}>IDSSBY</option>
                <option value="IDSJBR">IDSJBR</option>
                <option value="IDSJKT">IDSJKT</option>
                <option value="IDSSMG">IDSSMG</option>
            </select>
            <div><label className="d-none form-label">Location</label><select ref={etAccount} className="hidden form-select-sm w-100 border-2" id="etAccount">
                    <option value="01" defaultValue={"01"}>Surabaya</option>
                    <option value="02">Jember</option>
                    <option value="03">Semarang</option>
                    <option value="04">Jakarta</option>
                    <option value="05">Medan</option>
                </select></div>
                <div><label className="d-none form-label">Periode Perolehan</label><input ref={etPerolehan} id="etPerolehan" className="hidden w-100  border-2" type="date"/></div>
        <div className="mt-2 mb-2"><button onClick={GeneratePrefix} className="d-none btn btn-primary mt-1 mb-1 w-25" id="btnPrefix" type="button">Prefix</button></div>
        <div><label className="form-label">QR Content</label><input type="text" ref={StrQRContent} id="etQRContent" className="w-100  border-2"/></div>
        <div className="mt-2 mb-2"><button onClick={GenerateQRCode} className="btn btn-success mt-1 mb-1 w-25" id="btnGenerate" type="button">Generate</button></div>
        {qrData && (
          <div className="mt-2 mb-2">
            <Canvas
              text = {qrData}
              options = {{
                errorCorrectionLevel: "H",
                scale: 4,
                margin: 0,
                width: 64
              }}
            />
          </div>
        )}
        </div>
    </div>
  );
}
