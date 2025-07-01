import React, { useEffect, useState } from 'react'
import { saveTweets } from '../utils/appwrite';


// Save system - Save button saves to Appwrite's DB (Document)
const Save = ({ savedTweet, savedID, userContent }) => {
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSaved(false), setSavedCount(0)
  }, [savedTweet])

  const saveToAppWrite = async () => {
    if (savedCount > 1) {
      alert("You already saved this.");
      return;
    } 
    else {
      try {
        await saveTweets(savedID, savedTweet, userContent);
        setSavedCount(savedCount + 1);
        setSaved(true);
        setTimeout(() => setSaved(false), 1000)
      } 
      catch (error) {
        console.error("Error saving database: ", error)
      }
    }
  }
  
  return (
    <button onClick={saveToAppWrite}>
        <img src="/Bookmark.svg" alt="Saved" width={25} height={25} />
        {saved ? "Saved" : "Save"}
    </button>
  )
}

export default Save