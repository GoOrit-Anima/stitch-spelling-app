import { Mic2Icon, Volume2Icon, XCircleIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { weeklyWords } from "../../data/words";

export const SpellingApp = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const currentWord = weeklyWords[currentWordIndex];

  const playErrorSound = () => {
    const audio = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    audio.play();
  };

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setFeedback("Listening...");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setFeedback("");
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setFeedback("Please try again");
        playErrorSound();
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
        setUserInput(spokenWord);
        
        if (spokenWord === currentWord.word.toLowerCase()) {
          setFeedback("Nice job Shelly!");
          speak("Nice job Shelly!");
          setIsCorrect(true);
          setTimeout(() => {
            if (currentWordIndex < weeklyWords.length - 1) {
              setCurrentWordIndex(currentWordIndex + 1);
              setUserInput("");
              setFeedback("");
              setIsCorrect(false);
            }
          }, 2000);
        } else {
          setFeedback("Try again");
          playErrorSound();
          speak(currentWord.word);
          setIsCorrect(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentWordIndex]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower speech
    speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    speak(currentWord.word);
  };

  const checkSpelling = () => {
    if (userInput.toLowerCase().trim() === currentWord.word.toLowerCase()) {
      setFeedback("Good job Shelly!");
      setIsCorrect(true);
      speak("Good job Shelly!");
      setTimeout(() => {
        if (currentWordIndex < weeklyWords.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setUserInput("");
          setFeedback("");
          setIsCorrect(false);
        } else {
          setFeedback("Congratulations! You've completed all words!");
        }
      }, 2000);
    } else {
      setFeedback("Try again");
      setIsCorrect(false);
      playErrorSound();
      speak("Try again");
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkSpelling();
    }
  };

  const startSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        if (isListening) {
          recognitionRef.current.stop();
        } else {
          recognitionRef.current.start();
        }
      } catch (error) {
        console.error('Speech recognition error:', error);
        setFeedback("Please try again");
        playErrorSound();
      }
    } else {
      setFeedback("Speech recognition not supported in your browser");
      playErrorSound();
    }
  };

  const clearInput = () => {
    setUserInput("");
    setFeedback("");
  };

  return (
    <div className="bg-white flex justify-center w-full min-h-screen">
      <div className="bg-white w-[317px] py-8">
        <div className="flex flex-col items-center gap-6 w-[222px] mx-auto">
          <h1 className="text-[#3e4f67] text-[22px] leading-7">Hi Shelly!</h1>
          
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600">Word {currentWordIndex + 1} of {weeklyWords.length}</p>
            <p className="text-xs text-gray-500">Hint: {currentWord.hint}</p>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 p-0"
            onClick={handleSpeak}
          >
            <Volume2Icon className="w-6 h-6" />
          </Button>

          <Card className="w-full border-0 bg-transparent">
            <CardContent className="p-0">
              <div className="relative">
                <div className="flex flex-col gap-1 bg-[#e6e0e9] rounded-t-sm p-4">
                  <label className="text-xs text-[#49454f]">
                    Spell the word
                  </label>

                  <div className="flex items-center gap-2">
                    <Input
                      className="flex-1 border-0 bg-transparent p-0 text-right text-[#1d1b20]"
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Type what you hear"
                    />
                    {userInput && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-6 h-6 p-0"
                        onClick={clearInput}
                      >
                        <XCircleIcon className="w-6 h-6" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className={`h-px w-full ${isCorrect ? 'bg-green-500' : 'bg-[#49454f]'}`} />

                <span className={`absolute -bottom-5 left-4 text-xs ${
                  isCorrect ? 'text-green-500' : 
                  feedback === 'Try again' ? 'text-red-500' : 
                  'text-[#49454f]'
                }`}>
                  {feedback || "Type what you hear"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-6 h-6 p-0 ${isListening ? 'bg-red-100' : ''}`}
            onClick={startSpeechRecognition}
          >
            <Mic2Icon className={`w-6 h-6 ${isListening ? 'text-red-500' : ''}`} />
          </Button>

          <img
            className="w-full h-[230px] object-cover"
            alt="Cute character illustration"
            src="https://c.animaapp.com/DHVTwJyn/img/image-1@2x.png"
          />
        </div>
      </div>
    </div>
  );
};
