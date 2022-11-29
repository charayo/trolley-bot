import React, { useEffect, useState } from "react";

import SpeechRecognition, {  useSpeechRecognition } from "react-speech-recognition";
import TBot from "../assets/Dictionary.json";

function WebkitComponent() {
  //destructure the dictionary object from the Imported json file
  const { dictionary } = TBot;

  const [recStarted, setRecStarted] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0); //Here, I use the prompt index to match a corresponding response index from the Dictionary Json file
  const [prompt, setPrompt] = useState("");
  const [possiblePrompts, setPossiblePrompts] = useState([]);
  const [searchEnded, setSearchEnded] = useState(false)
  const [score, setScore] = useState({statement: "not yet", score: 0, itsIndex:0});
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [status, setStatus] = useState(0);

  useEffect(() => {
    // console.log(dictionary);

    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }
    //auto click the start button on load
    // document.getElementById('startBtn').click()
  }, []);
  useEffect(() => {
    if (!listening && recStarted) {
      console.log("listening ended");
      setRecStarted(false)
      // handleVoiceRec();
      dictLooper()
    }
  }, [listening]);

useEffect(()=>{
  if(searchEnded && score.score !== 0){
    speak(dictionary.response[score.itsIndex]);
    console.log("spoken");
    setSearchEnded(false);
    setScore({statement: "not yet", score: 0, itsIndex:0})
    // setScore({statement: "", score: 0, itsIndex: 0})
  }
},[dictLooper, searchEnded])


  //function Speak that speaks out a string of texts
  function speak(string) {
    const u = new window.SpeechSynthesisUtterance();
    let allVoices = speechSynthesis.getVoices();
    // console.log(allVoices);
    u.voice = allVoices.filter((voice) => voice.name === "Microsoft Mark")[0];
    u.text = string;
    u.lang = "en-US";
    u.volume = 1; //0-1 interval
    u.rate = 1.6;
    u.pitch = 1; //0-2 interval
    speechSynthesis.speak(u);
  }

  //Function that breaks the sentence into words
  const sentenceTokenizer = (sentence) => {
    let token = sentence.split(" ");
    return token;
  };

  /*------------dictionaryMatch function Starts here-----------------*/
  //dictionaryMatch: a function that compares two arrays of tokens to see if they have common words and then returns a result object
  let dictionaryMatch = async (arrayOfInputTokens, arrayOfDicTokens) => {
    let match = 0; //this checks the number of match after comparing each word
    let commonTokens = []; //to store words that match

    arrayOfInputTokens.map((tokenA) => {
      for (let i = 0; i < arrayOfDicTokens.length; i++) {
        if (tokenA.toLowerCase() == arrayOfDicTokens[i].toLowerCase()) {
          commonTokens.push(tokenA); //store common words
          match++; //tracks number of matches
        }
      }
    });

    let matchResult = {
      status: match,
      commonTokens: commonTokens,

    };
    // console.log(matchResult);
    return matchResult; //returning the match count and common words as an object of result
  };
  /*------------dictionaryMatch function ends here-----------------*/

  let handleVoiceRec = (prompt, promptIndex) => {
    let dict_token;
    //tokenize the prompt to words
    dict_token = sentenceTokenizer(prompt);
    // dict_token = sentenceTokenizer(dictionary.prompt[0]);

    let transcriptTokens = sentenceTokenizer(transcript);
    let result = dictionaryMatch(transcriptTokens, dict_token);
    const { status } = result;
    let res;
    result.then((data) => {
      res = data;


      // console.log(res.status);
      
      // setPossiblePrompts.push({statement: prompt, score: res.status})
      if (res.status >= 1) {
        console.log(prompt, res.status);
        setPossiblePrompts(current=> [...current, {statement: prompt, score: res.status}])
        // setScore(currentScore => {
        //   if(currentScore.score <res.status){
        //     return {statement: prompt, score: res.status}
        //   }
        // })
        console.log(score.score, res.status);
        if(score.score < res.status){
          console.log("changing score");
          setScore({statement: prompt, score: res.status, itsIndex: promptIndex})
        }
        // speak(dictionary.response[0]);
        // setTimeout(() => {
        //   beginListening();
        // }, 2000);
        
      }
    });
    console.log("over");
  };

  //a function that will loop through all dictionary prompts, find the one with the highest status score
  var dictLooper = () => {
    dictionary.prompt.map((prompt, index) => {
      handleVoiceRec(prompt, index);
      if(index == dictionary.prompt.length-1){
        setTimeout(()=>{
          setSearchEnded(true)
        },100)
        
      }
    });

   //loop through the possible prompts and decide which one has the highest score

  };
  ///////////////////////////

  let beginListening = () => {
    SpeechRecognition.startListening();
    setRecStarted(true);
  };
  // console.log(cur)
  // console.log(score.score)
  // console.log("ended")

  return (
    <div>
      <h1>Trolley Building Voice Assistant</h1>

      <br />
      <div>
        <p>
          <span style={{ color: "red" }}>Temporary feature:</span> Click the
          start button then say "Hello Media"{" "}
        </p>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button id="startBtn" onClick={beginListening}>
          Start
        </button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>

        <div>
          <label>Voice Prompt</label>
          <p style={styles.promptWrap}>{transcript}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  promptWrap: {
    padding: 10,
    border: "solid 4 black",
  },
};

export default WebkitComponent;
