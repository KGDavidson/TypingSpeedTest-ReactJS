import { React, useState, useEffect } from "react";
import paragraphs from "./paragraphs.json";

const getRandomText = () => {
    return paragraphs.data[Math.round(Math.random() * 347)].paragraph;
};

const App = () => {
    const [text, setText] = useState(
        'The robot clicked disapprovingly, gurgled briefly inside its cubical interior and extruded a pony glass of brownish liquid. "Sir, you will undoubtedly end up in a drunkard\'s grave, dead of hepatic cirrhosis," it informed me virtuously as it returned my ID card. I glared as I pushed the glass across the table.'
    );

    return (
        <div className="container">
            <Input text={text}></Input>
        </div>
    );
};

const Input = (props) => {
    const charsFitted = Math.floor(
        Math.min(window.innerWidth * 0.8, 1000) / 37
    );

    const initialExtraChars = Math.floor(charsFitted / 2);
    var extraCharsAtFront = initialExtraChars;
    var extraCharsAtEnd = initialExtraChars;

    const getTextArray = (text) => {
        if (extraCharsAtFront > 0)
            text =
                " ".repeat(extraCharsAtFront) +
                text.substring(0, extraCharsAtEnd);
        else text = text.substring(-extraCharsAtFront, extraCharsAtEnd);
        return text.split("").map((c, index) => {
            return (
                <div className="char" key={index}>
                    <pre>{c}</pre>
                </div>
            );
        });
    };

    const [textArray, _setTextArray] = useState(getTextArray(props.text));

    const setTextArray = () => {
        const textArray = _setTextArray(getTextArray(props.text));
    };

    var currentChar = extraCharsAtFront;

    useEffect(() => {
        window.addEventListener("keypress", (e) => {
            console.log(e.keyCode);
            extraCharsAtFront--;
            if (extraCharsAtEnd < props.text.length) extraCharsAtEnd++;
            setTextArray();
        });
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 8) {
                if (extraCharsAtFront < initialExtraChars) {
                    extraCharsAtFront++;
                    if (extraCharsAtEnd > 0) extraCharsAtEnd--;
                }
                setTextArray();
            }
        });
    }, []);

    return (
        <div className="input">
            <div className="mask">{textArray}</div>
        </div>
    );
};

export default App;
