import { useEffect, useState } from "react";

const HomePage = () => {
  const [text, setText] = useState("");
  const [valid, setValid] = useState(false);
  const [word, setWord] = useState("អុីមីង");
  useEffect(() => {}, [text]);
  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className={`${valid && "text-blue-600"}`}>{word}</div>
      <input
        className="border border-black"
        onChange={(e) => {
          setText(e.currentTarget.value);
          if (e.currentTarget.value == word) {
            setValid(true);
            console.log(e.currentTarget.value);
          } else {
            setValid(false);
          }
        }}
        value={text}
        type="text"
      />
    </div>
  );
};

export default HomePage;
