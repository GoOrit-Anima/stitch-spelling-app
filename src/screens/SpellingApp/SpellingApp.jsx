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
      }
    } else {
      setFeedback("Speech recognition not supported in your browser");
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
