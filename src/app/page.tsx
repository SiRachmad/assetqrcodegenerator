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
      const yyMM = `${selectedDate.getFullYear().toString().slice(-2)}${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}`;
      StrQRContent.current.value = `${etLocation.current.value}-${etAccount.current.value}-${yyMM}-`;
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
                body {
                  font-family: Arial, sans-serif;
                }
              </style>
            </head>
            <body>
              <img src="${document.querySelector("canvas")?.toDataURL()}"/>
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
        <div className="shadow"><label className="form-label">Location</label><select ref={etLocation} className="form-select-sm w-100 border-2" id="etLocation">
                <option value="IDSSBY" defaultValue={"IDSSBY"}>IDSSBY</option>
                <option value="IDSJBR">IDSJBR</option>
                <option value="IDSJKT">IDSJKT</option>
                <option value="IDSSMG">IDSSMG</option>
            </select>
            <div><label className="form-label">Account</label><select ref={etAccount} className="form-select-sm w-100 border-2" id="etAccount">
                    <option value="010" defaultValue={"010"}>Tanah - 010</option>
                    <option value="020">Bangunan - 020</option>
                    <option value="031">Mesin - 031</option>
                    <option value="032">Peralatan - 032</option>
                    <option value="040">Inventaris - 040</option>
                    <option value="050">Kendaraan - 050</option>
                </select></div>
                <div><label className="form-label">Periode Perolehan</label><input ref={etPerolehan} id="etPerolehan" className="w-100  border-2" type="date"/></div>
        <div className="mt-2 mb-2"><button onClick={GeneratePrefix} className="btn btn-primary mt-1 mb-1 w-25" id="btnPrefix" type="button">Prefix</button></div>
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
