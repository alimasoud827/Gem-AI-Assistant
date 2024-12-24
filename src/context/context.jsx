import { createContext, useState } from 'react';
import run from '../config/gemini.js';

export const Context = createContext();

const ContextProvider = (props) => {

  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, index * 75);
  };

  const onSent = async (prompt) => {
    setResultData('');
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    setPreviousPrompt((prev) => [...prev, input]);
    console.log(previousPrompt.length);
    const response = await run(input);

    let responseArray = response.split('**');
    let formattedArray = responseArray.map((item, index) =>
      index % 2 === 0 ? item : `<b>${item}</b>`
    );
    let formattedResponse = formattedArray.join('').split('*').join('<br>');

    let words = formattedResponse.split(' ');
    
    words.forEach((word, i) => {
      delayPara(i, word + ' ');
    });
    setResultData(formattedArray);
    setLoading(false);
    setInput('');
  }

  const contextValue = {
    onSent,
    previousPrompt,
    setPreviousPrompt,
    setRecentPrompt,
    recentPrompt,
    showResult,
    setInput,
    resultData,
    loading,
    input,
  }

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  )
}

export default ContextProvider;