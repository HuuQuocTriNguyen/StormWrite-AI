/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from "@google/genai";
import { prompt, systemInstructions } from './utils/prompt';
import Spinner from './components/Spinner';
import Screenshot from './components/screenshot';
import Save from './components/Save';
import Copy from './components/Copy';
import { getSavedTweets } from './utils/appwrite';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY,  })

const StormWriteAI = () => {
  const [storeTweet, setStoreTweet] = useState([]);
  const [savedTweets, setSavedTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tone, setTone] = useState('');
  const [input, setInput] = useState('');
  const [displayTweets, setDisplayTweets] = useState(false);

  const latestTweet = storeTweet.length > 0 ? storeTweet[storeTweet.length - 1] : "";
  const outputRef = useRef(); // The center to connect screenshot button and the place to screenshot

  const generateThread = async () => {  
      if (!input || !tone) return alert("Please say something")
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt(input, tone),
          config: {
            systemInstruction: systemInstructions()
          }
        });
        
        const result = response.text;
        setStoreTweet((prev) => [...prev, result]);

      } catch (error) {
        console.error(`An error occured while fetching APIs: ${error}`);
        setErrorMessage('Error fetching API. Please try again later.');
      } finally {
        setIsLoading(false);
      }
  }

  // Fetch Store Tweets and display them.
  useEffect(() => {
    const fetchTweets = async () => {
      const data = await getSavedTweets();
      setSavedTweets(data);
    }

    fetchTweets();
  }, [])

  const displaySavedTweets = () => {
    setDisplayTweets((prev) => {
      const change = !prev;
      document.getElementById("Save-tweet-block").style.display = change ? "block" : "none";
      return change;
    })
  }

  return (
    <main>
      <div className="Header">
          <div className="flex items-center justify-center gap-0.5">
            <img src="./Logo.svg" alt="Logo" width={50} height={50} />
            <p className='sm:text-lg md:text-xl lg:text-2xl xl:text-4xl my-auto font-bold text-[#8bfdec]'>StormWrite AI</p>
          </div>
      </div>

      <div className="Banner">
        <div className='py-10 max-w-[900px]'>
          <h1 className='Banner-highlight'>⚡ Create Viral X Thread with AI-Powered Writing</h1>
          <p>Write your content in the first box, the tone of content in the second box, and click the button. The magic will do itself.</p>
        </div>
        <img src="./copywriting.png" alt="copywriting" />  
      </div>
        
      <section className="px-[10%] items-center">
          <div className='mb-[25px]'>
            <label>What is your thread about?</label>
            <textarea id="input-field" placeholder="e.g. How to stay productive while studying aboard" rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
          </div>

          <div className='mb-[30px]'>
            <label>Describe the tone</label>
            <input type="text" placeholder="e.g. funny, controversial, unique" value={tone} onChange={(e) => setTone(e.target.value)} />
          </div>

          <div className='flex mb-[50px]'>
            <button onClick={generateThread} className='generate-button'>
              {isLoading ? "Generating Content" : "Generate Content"}
            </button>
            
            <button className='generate-button' onClick={displaySavedTweets}>
              {displayTweets ? "Hide Saved Tweets" : "Display Saved Tweets"}
            </button>
          </div>

          <div id="Save-tweet-block">
            <label>Saved Tweets</label>
            <div className='saved-tweets-display'>
              {savedTweets.map((tweet) => (
                 <div key={tweet.$id} className='saved-tweets-block'>
                  <p className='saved-text text-amber-50'>ID: {tweet.id_number}</p>
                  <p className='saved-text text-amber-50'>{tweet.userInput} </p>
                  <p className='saved-text'>{tweet.GeneratedTweets} </p>
               </div>
              ))}
            </div>
          </div>

          { isLoading ? <Spinner className='mt-[25px]' /> : errorMessage ? (<p className='text-red-500 text-xl font-semibold font-mona-sans'>{errorMessage}</p>) : (
            <div className='mt-[25px]'>
              <div className='flex justify-between mb-[20px]'>
                {latestTweet && <label>Write</label>}
                <div className='flex gap-5'>
                  {latestTweet && <Screenshot targetRef={outputRef} />}
                  {latestTweet && <Save savedTweet={latestTweet} savedID={Date.now()} userContent={input} />}
                  {latestTweet && <Copy copyText={latestTweet} />}
                </div>
              </div>

              <div className='rounded-lg w-full h-[300px] mb-[10px]' ref={outputRef}> 
                {latestTweet && <pre className='h-[300px] text-[#fafafa] border-transparent text-sm whitespace-pre-wrap overflow-auto'>
                  {latestTweet} 
                </pre>}
              </div>
            </div>
          )}

      </section>
    </main>

  
  )
}

export default StormWriteAI