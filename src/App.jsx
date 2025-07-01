/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from "@google/genai";
import { prompt } from './utils/prompt';
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
  const [expandedTweets, setExpandedTweets] = useState({});

  const latestTweet = storeTweet.length > 0 ? storeTweet[storeTweet.length - 1] : "";
  const outputRef = useRef(); // The center to connect screenshot button and the place to screenshot

  const fetchTweets = async () => {
    const data = await getSavedTweets();
    setSavedTweets(data);
  }

  const generateThread = async () => {  
      if (!input || !tone) return alert("Please say something")
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt(input, tone),
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
    fetchTweets();
  }, []);

  const displaySavedTweets = () => {
    setDisplayTweets((prev) => !prev);
    console.log();
  }

  // Helper to get truncated text
  const getTruncatedText = (text, id) => {
    const words = text.split(' ');
    if (words.length <= 8 || expandedTweets[id]) return text;
    return words.slice(0, 8).join(' ') + '...';
  };

  // Handler for toggling read more/hide text
  const handleToggleExpand = (id) => {
    setExpandedTweets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        <img src="./copywriting.png" alt="copywriting" className='copywriting-img' width={300} height={300} />  
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

          <div className='flex flex-col sm:flex-row gap-3 sm:gap-6 mb-[50px'>
            <button onClick={generateThread} className='generate-button'>
              {isLoading ? "Generating Content" : "Generate Content"}
            </button>
            
            <button className='generate-button' onClick={displaySavedTweets}>
              {displayTweets ? "Hide Saved Tweets" : "Display Saved Tweets"}
            </button>
          </div>

          {displayTweets && (
          <div id="Save-tweet-block">
            <label>Saved Tweets</label>
            <div className='saved-tweets-display'>
              {savedTweets.map((tweet) => (
                 <div key={tweet.$id} className='saved-tweets-block'>
                  <p className='saved-text text-amber-50'>ID: {tweet.id_number}</p>
                  <p className='saved-text text-amber-50'>{tweet.userInput} </p>
                  <p className='saved-text'>
                    {getTruncatedText(tweet.GeneratedTweets, tweet.$id)}
                    {tweet.GeneratedTweets.split(' ').length > 8 && (
                      <>
                        {' '}
                        <span className="show-or-hide" onClick={() => handleToggleExpand(tweet.$id)}>
                          {expandedTweets[tweet.$id] ? 'Hide text' : 'read more'}
                        </span>
                      </>
                    )}
                  </p>
               </div>
              ))}
            </div>
          </div>
          )}
          
          { isLoading ? <Spinner className='mt-[25px]' /> : errorMessage ? (<p className='text-red-500 text-xl font-semibold font-mona-sans'>{errorMessage}</p>) : (
            <div className='mt-[25px]'>
              <div className='flex justify-between mb-[20px]'>
                {latestTweet && <label>Write</label>}
                <div className='flex gap-5'>
                  {latestTweet && <Screenshot targetRef={outputRef} />}
                  {latestTweet && <Save savedTweet={latestTweet} savedID={Date.now()} userContent={input} onSave={fetchTweets} />}
                  {latestTweet && <Copy copyText={latestTweet} />}
                </div>
              </div>

              <div className='rounded-lg w-full h-[590px] mb-[10px]' ref={outputRef}> 
                {latestTweet && <pre className='h-[570px] text-[#fafafa] border-transparent text-sm whitespace-pre-wrap overflow-auto'>
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