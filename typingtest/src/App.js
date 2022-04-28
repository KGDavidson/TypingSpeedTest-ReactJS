import { React, useState, useEffect } from "react";
import paragraphs from "./paragraphs.json";

const charsFitted = Math.floor(Math.min(window.innerWidth * 0.8, 1500) / 37);

const initialExtraChars = Math.floor(charsFitted / 2);
var extraCharsAtFront = initialExtraChars;
var extraCharsAtEnd = initialExtraChars;
var currentChar = 0;

const getRandomText = () => {
    return paragraphs.data[Math.round(Math.random() * 347)].paragraph;
};

const App = () => {
    const getTextArray = (text) => {
        return text.split("").map((c, index) => {
            return (
                <div className="char" key={index}>
                    <pre>{c}</pre>
                </div>
            );
        });
    };
    const [textArray, setTextArray] = useState(
        getTextArray(
            'The robot clicked disapprovingly, gurgled briefly inside its cubical interior and extruded a pony glass of brownish liquid. "Sir, you will undoubtedly end up in a drunkard\'s grave, dead of hepatic cirrhosis," it informed me virtuously as it returned my ID card. I glared as I pushed the glass across the table.'
        )
    );

    return (
        <div className="container">
            <Input textArray={textArray} setTextArray={setTextArray}></Input>
        </div>
    );
};

const Input = (props) => {
    var propsTextArray = [...props.textArray];

    const getDisplayTextArray = () => {
        var textArray = propsTextArray.slice(0, extraCharsAtEnd);
        if (extraCharsAtFront > 0) {
            for (var i = 0; i < extraCharsAtFront; i++) {
                textArray.unshift(
                    <div className="char" key={-(i + 1)}>
                        <pre> </pre>
                    </div>
                );
            }
        } else {
            textArray = propsTextArray.slice(
                -extraCharsAtFront,
                extraCharsAtEnd
            );
        }
        return textArray;
    };

    const [displayTextArray, _setDisplayTextArray] = useState(
        getDisplayTextArray()
    );

    const setDisplayTextArray = () => {
        _setDisplayTextArray(getDisplayTextArray());
    };

    useEffect(() => {
        window.addEventListener("keypress", (e) => {
            //console.log(textArray[currentChar].props.children.props.children);
            //console.log(e.keyCode);
            //console.log(extraCharsAtFront);

            var className = "char negative";
            if (
                propsTextArray[currentChar].props.children.props.children !=
                e.key
            ) {
                console.log("test");
                propsTextArray[currentChar] = (
                    <div className={className} key={currentChar}>
                        <pre>{e.key}</pre>
                    </div>
                );
            }
            console.log(propsTextArray);
            props.setTextArray(propsTextArray);

            console.log(
                props.textArray[currentChar].props.children.props.children
            );
            //_setDisplayTextArray(textArray);

            extraCharsAtFront--;
            if (extraCharsAtEnd < props.textArray.length) extraCharsAtEnd++;
            setDisplayTextArray();

            //console.log(text[currentChar].props.children.props.children);
            /*text[currentChar] = (
                <div className="char negative" key={currentChar}>
                    <pre>{text[currentChar].props.children.props.children}</pre>
                </div>
            );*/
            //_setTextArray(text);\
            currentChar++;
            e.stopPropagation();
            e.preventDefault();
        });
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 8) {
                if (extraCharsAtFront < initialExtraChars) {
                    extraCharsAtFront++;
                    if (extraCharsAtEnd > 0) extraCharsAtEnd--;
                    currentChar--;

                    propsTextArray[currentChar] = (
                        <div className="char" key={currentChar}>
                            <pre>{props.textArray[currentChar]}</pre>
                        </div>
                    );
                }
                setDisplayTextArray();
            }
        });
    }, []);

    return (
        <div className="input">
            <div className="mask">{displayTextArray}</div>
        </div>
    );
};

export default App;
