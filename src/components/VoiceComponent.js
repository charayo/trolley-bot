import React, { useEffect } from "react";
import { usePorcupine } from "@picovoice/porcupine-react";


function VoiceComponent(props) {
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


  const porcupineModel = {publicPath: "Hey-TB-Bot_en_wasm_v2_1_0.ppn"};
  const keywordModel = {
    publicPath: "Hey-TB-Bot_en_wasm_v2_1_0.ppn",
    label: "hey-tb-bot"
  }
  // const porcupineModel = {publicPath: "porcupine_params.pv"};
  const ACCESS_KEY = "qANt2aKEYxkEMOfQAR9Nqmm6MN02aOHcBs/VatqnCUPCHqfuZyKj/A==";
  useEffect(() => {
     init(
      "qANt2aKEYxkEMOfQAR9Nqmm6MN02aOHcBs/VatqnCUPCHqfuZyKj/A==",
      [keywordModel],
      porcupineModel
    );
  }, []);


  useEffect(() => {
    if (keywordDetection !== null) {
      // ... use keyword detection result
      console.log("heard my name");
    }
  }, [keywordDetection]);


  // ... render component
}
export default VoiceComponent;