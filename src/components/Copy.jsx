import React, { useState } from 'react'

const Copy = ({ copyText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText?.trim()) {
      alert("I don't see anything to copy.");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);

    } catch (error) {
      console.error("Copy failed", error)
    }
  }

  return (
    <button onClick={handleCopy}>
        <img src="/Copy.svg" alt="Copy" width={25} height={25 }/>
        {copied ? "Copied" : "Copy"}
    </button>
  )
}

export default Copy