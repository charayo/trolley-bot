import React, { useEffect, useState } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";
// import {
//   PorcupineKeyword,
//   PorcupineModel,
//   RhinoContext,
//   RhinoModel,
// } from "@picovoice/picovoice-web";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import TBot from "../assets/Dictionary.json";

function WebkitComponent() {
  //destructure the dictionary object from the Imported json file
  const { dictionary } = TBot;

  const [recStarted, setRecStarted] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0); //Here, I use the prompt index to match a corresponding response index from the Dictionary Json file
const [prompt, setPrompt] = useState("")
  ////////////Picovoice Setup///////////////////////////////////////////////////////////////////////////
  /*
  const key = "qANt2aKEYxkEMOfQAR9Nqmm6MN02aOHcBs/VatqnCUPCHqfuZyKj/A==";
  const ACCESS_KEY = key;
  const porcupineKeyword = {
    label: "picovoice",
    publicPath: "Hey-TB-Bot_en_wasm_v2_1_0.ppn",
  };

  const porcupineModel = {
    publicPath: "porcupine_params.pv",
  };
  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();
  // const porcupineModel = {publicPath: "${PPN_MODEL_PATH}"};

  useEffect(() => {
    init(
      ACCESS_KEY,
      [BuiltInKeyword.Porcupine, BuiltInKeyword.Bumblebee],
      porcupineModel
    );
  }, []);

  useEffect(() => {
    if (keywordDetection !== null) {
      // ... use keyword detection result
      console.log("Yes? I can hear you");
    }
  }, [keywordDetection]);
*/
  ////////////////////////////////////////////////////////////////////////////////////////////

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [status, setStatus] = useState(0);

  useEffect(() => {
    console.log(dictionary);

    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }
    //auto click the start button on load
    // document.getElementById('startBtn').click()
  }, []);
  useEffect(() => {
    if (!listening && recStarted) {
      console.log("listening ended");
      handleVoiceRec();
    }
  }, [listening]);

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
let dictLooper = ()=>{
  dictionary.prompt.map((prompt, index)=>{
    
  })
}

  let handleVoiceRec = (prompt) => {
    let dict_token;
    dict_token = sentenceTokenizer(dictionary.prompt[0])

    let transcriptTokens = sentenceTokenizer(transcript);
    let result = dictionaryMatch(transcriptTokens, dict_token);
    const { status } = result;
    let res;
    result.then((data) => {
      res = data;

      console.log(res.status);
      if (res.status > 1) {
        console.log(dictionary.response[0]);
        speak(dictionary.response[0]);
        setTimeout(()=>{
          beginListening();
        },2000)
      }
    });
  };
  let beginListening = () => {
    SpeechRecognition.startListening();
    setRecStarted(true);
  };

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
