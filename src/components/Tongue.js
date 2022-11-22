// import React from 'react'

// function Tongue() {
//     function speak(string) {
//         const u = new SpeechSynthesisUtterance();
//         allVoices = speechSynthesis.getVoices();
//         console.log(allVoices);
//         u.voice = allVoices.filter(
//           (voice) => voice.name === "Microsoft Mark"
//         )[0];
//         u.text = string;
//         u.lang = "en-US";
//         u.volume = 1; //0-1 interval
//         u.rate = 1;
//         u.pitch = 1; //0-2 interval
//         speechSynthesis.speak(u);
//       }
//       const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
//       const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
//       const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
      
//       const grammar =
//         "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
//       const recognition = new SpeechRecognition();
//       const speechRecognitionList = new SpeechGrammarList();
//       speechRecognitionList.addFromString(grammar, 1);
//       recognition.grammars = speechRecognitionList;
//       recognition.continuous = false;
//       recognition.lang = "en-US";
//       recognition.interimResults = false;
//       recognition.maxAlternatives = 1;

//       const diagnostic = document.querySelector(".output");
//       const bg = document.querySelector("html");

//       document.body.onclick = () => {
//         recognition.start();
//         console.log("Ready to receive a color command.");
//       };

//       recognition.onresult = (event) => {
//         const color = event.results[0][0].transcript;
//         console.log(event.results)
//         //diagnostic.textContent = `Result received: ${color}`;
//         //bg.style.backgroundColor = color;
//       };
//   return (
//     <div>
//         <button onClick={()=>speak("Hello my man")}>Speak</button>
//     </div>
//   )
// }

// export default Tongue