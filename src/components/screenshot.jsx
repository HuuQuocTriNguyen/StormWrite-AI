import React, { useState } from 'react'
import html2canvas from 'html2canvas'

const Screenshot = ({ targetRef }) => {  
  const [screenshotTaken, setScreenshotTaken] = useState(false);

  const handleScreenShot = async () => {
      try {
        const ref = targetRef.current;
        if (!ref) return alert('Please generate content first before taking screenshot');
  
        const canvas = await html2canvas(ref, {
          backgroundColor: "#0F1014",
        });

        const link = document.createElement("a");

        link.href = canvas.toDataURL("image/png");
        link.download = `X Thread.png`;
        link.click();
        link.remove();

        setScreenshotTaken(true);
        setTimeout(() => setScreenshotTaken(false), 1000);
        
      } catch (error) {
        console.error(`Error screenshotting the text: ${error}`)
      }
  }

  return (
    <button onClick={handleScreenShot}>
        <img src="/screenshot.svg" alt="screenshot" width={25} height={25} />
        {screenshotTaken ? "Captured" : "Capture"}
    </button>
  )
}

export default Screenshot