import React, { useEffect, useState } from "react";
import redEar from "../assets/images/red-ear.png";
import greenEar from "../assets/images/green-ear.png";
import bot from "../assets/images/bot.png";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import TBot from "../assets/Dictionary.json";

function TestComponent() {
  //destructure the dictionary object from the Imported json file
  const { dictionary } = TBot;
  const [botStatus, setBotStatus] = useState("ear");
  const [recStarted, setRecStarted] = useState(false);
  const [possiblePrompts, setPossiblePrompts] = useState([]);
  const [searchEnded, setSearchEnded] = useState(false);
  const [scoreState, setScoreState] = useState({
    statement: "not yet",
    score: 0,
    itsIndex: 0,
  });
  const [wakeIdentified, setWakeIdentified] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }
    //function that starts the recording on load of the page
    // beginListening()
  }, []);

  useEffect(() => {
    if (!listening && recStarted) {
      //   console.log("listening ended?");
      setRecStarted(false);

      dictLooper();
    }
  }, [listening]);

  useEffect(() => {
    let resetter = ()=>{
      setSearchEnded(false);

      //   console.log("resetting score back to 0");
      setScoreState((scoreState) => ({
        ...scoreState,
        statement: "not yet",
        score: 0,
        itsIndex: 0,
      }));
      document.getElementById('transDisplay').innerHTML = "";
    }
    //listen for the wake word
    // if (transcript == "mssd") {
    //   setWakeIdentified(true); //set the state to show the bot has listened to the wake word
    //   console.log("Wakie wakie");
    // }
    // if(wakeIdentified){
    // console.log("that's my name")
    //only if the wake has been identified should it respond to other prompts
    if (searchEnded && scoreState.score !== 0) {
      speak(dictionary.response[scoreState.itsIndex]);
      //   console.log("spoken");
      resetter();
      //   console.log("reset:", scoreState);
    }
    else if(searchEnded && scoreState.score == 0){
      speak("I am sorry, I didn't get that. Maybe the prompt is not in my dictionary");
       //   console.log("spoken");
       resetter();
    }
    // }
  }, [dictLooper, searchEnded]);

  //if statement to check if the wake-word is detected or not

  //function Speak that speaks out a string of texts
  function speak(string) {
    const u = new window.SpeechSynthesisUtterance();
    let allVoices = speechSynthesis.getVoices();
    u.voice = allVoices.filter((voice) => voice.name === "Microsoft Mark")[0];
    u.text = string;
    u.lang = "en-US";
    u.volume = 1; //0-1 interval
    u.rate = 1.6;
    u.pitch = 1; //0-2 interval
    speechSynthesis.speak(u);
    u.addEventListener("end", (event) => {
      console.log(
        `MSSD Bot is done talking after ${event.elapsedTime} miliseconds.`
      );
      setBotStatus("ear");
    });
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
    //    console.log("handleVoiceRec called");
    let dict_token;

    //tokenize the prompt to words
    dict_token = sentenceTokenizer(prompt);

    let transcriptTokens = sentenceTokenizer(transcript);
    let result = dictionaryMatch(transcriptTokens, dict_token);
    const { status } = result;
    let res;
    result.then((data) => {
      res = data;

      if (res.status > 1 || (res.status == 1 && prompt == "mssd")) {
        // console.log("prompt", prompt);
        setPossiblePrompts((current) => [
          ...current,
          { statement: prompt, score: res.status },
        ]);

        if (scoreState.score < res.status) {
          //   console.log("changing score");

          setScoreState((scoreState) => ({
            ...scoreState,
            statement: prompt,
            score: res.status,
            itsIndex: promptIndex,
          }));

          //   console.log("changed", scoreState);
        }
      }
    });
    // console.log("handleVoiceRec over");
  };

  //a function that will loop through all dictionary prompts, find the one with the highest status score
  var dictLooper = () => {
    // console.log("dictLooper called");
    //loop through the possible prompts and decide which one has the highest score
    dictionary.prompt.map((prompt, index) => {
      handleVoiceRec(prompt, index);
      if (index == dictionary.prompt.length - 1) {
        setTimeout(() => {
          setSearchEnded(true);
          setBotStatus("Lips");
        }, 1000);
      }
    });
  };
  ///////////////////////////

  var beginListening = () => {
    // console.log("beginListening called");
    SpeechRecognition.startListening();
    setBotStatus("Listening");
    // SpeechRecognition.startListening({ continuous: true });
    setRecStarted(true);
  };
  let imageUrl;
  if (botStatus == "ear") {
    imageUrl = redEar;
  } else if (botStatus == "Lips") {
    imageUrl = bot;
  } else if (botStatus == "Listening") {
    imageUrl = greenEar;
  }

  return (
    <div className="p-4">
      <h1>Trolley Building Voice Assistant</h1>

      <br />
      <div>
        <p>
          <span style={{ color: "red" }}>Temporary feature:</span> Click the
          start button then say "MSSD"{" "}
        </p>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button className="btn btn-success m-1" id="startBtn" onClick={beginListening}>
          Start
        </button>
        <button className="btn btn-danger m-1" onClick={SpeechRecognition.stopListening}>Stop</button>
        <button className="btn btn-warning m-1" onClick={resetTranscript}>Reset</button>

        <div className="mt-1">
          <div>
            {" "}
            <img src={imageUrl} width={200} />
          </div>
          <div className="border border-primary border-1 p-3 m-3 rounded w-50 mx-auto">
            <span>Dictionary Prompts</span>
            <p>
            "What do you know about mssd?",
            "introduce yourself",
            "Who is Mary?",
            </p>
          </div>
          <div>
            <p id="transDisplay">{transcript}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default TestComponent;
