import { React, useState, useEffect, useRef } from "react";
import paragraphs from "./paragraphs.json";

const charsFitted = Math.floor(Math.min(window.innerWidth * 0.8, 1500) / 37);

const initialExtraChars = Math.floor(charsFitted / 2);
var extraCharsAtFront = initialExtraChars;
var extraCharsAtEnd = initialExtraChars;
var currentChar = 0;

const getRandomText = () => {
    return (
        paragraphs.data[Math.round(Math.random() * 347)].paragraph +
        " " +
        paragraphs.data[Math.round(Math.random() * 347)].paragraph +
        " " +
        paragraphs.data[Math.round(Math.random() * 347)].paragraph
    );
};

const App = () => {
    const startTimer = useRef(null);
    const endTimer = useRef(null);

    const getTextArray = (text) => {
        return text.split("").map((c, index) => {
            return (
                <div className="char" key={index}>
                    <pre>{c}</pre>
                </div>
            );
        });
    };
    const [textArray, setTextArray] = useState(getTextArray(getRandomText()));
    const [enabled, setEnabled] = useState(true);

    const startTimerCallback = () => {
        startTimer.current();
    };

    const endTimerCallback = () => {
        setEnabled(false);
        endTimer.current();
    };

    return (
        <div className="container">
            {enabled ? (
                <Timer
                    endTimerCallback={endTimerCallback}
                    startTimer={startTimer}
                ></Timer>
            ) : (
                <Results textArray={textArray}></Results>
            )}

            <Input
                endTimer={endTimer}
                textArray={textArray}
                setTextArray={setTextArray}
                startTimerCallback={startTimerCallback}
            ></Input>
        </div>
    );
};

const Results = (props) => {
    var wpm = 0;
    var cpm = 0;
    var acc = 0;
    var racc = 0;

    var charsCorrect = 0;
    var charsFixed = 0;
    var charsIncorrect = 0;

    props.textArray.forEach((e) => {
        const className = e.props.className;
        if (className.includes("positive") && !className.includes("erased"))
            charsCorrect++;
        if (className.includes("fixed")) charsFixed++;
        if (className.includes("negative") && !className.includes("erased"))
            charsIncorrect++;
    });

    cpm = charsCorrect + charsIncorrect;
    wpm = cpm / 5;
    acc =
        Math.round(
            ((charsFixed + charsCorrect) /
                (charsFixed + charsCorrect + charsIncorrect)) *
                1000
        ) /
            10 +
        "%";
    racc =
        Math.round(
            (charsCorrect / (charsFixed + charsCorrect + charsIncorrect)) * 1000
        ) /
            10 +
        "%";

    const reload = () => {
        window.location.reload(false);
    };

    return (
        <div className="results">
            <div className="wpm">
                {wpm}
                <span>WPM</span>
            </div>
            <div className="cpm">
                {cpm}
                <span>CPM</span>
            </div>
            <div className="acc">
                {acc}
                <span>Accuracy</span>
            </div>
            <div className="racc">
                {racc}
                <span>Real Accuracy</span>
            </div>
            <div className="restart" onClick={reload}>
                <span>⭮</span>
            </div>
        </div>
    );
};

const Timer = (props) => {
    const totalTime = 60;
    var time = totalTime;
    var timer;
    const [timerValue, setTimerValue] = useState(time);

    const countDown = () => {
        if (time > 0) {
            time -= 1;
            setTimerValue(time);
        } else {
            clearInterval(timer);
            props.endTimerCallback();
        }
    };

    const startTimer = () => {
        timer = setInterval(countDown, 1000);
    };

    useEffect(() => {
        props.startTimer.current = startTimer;
    });

    const style = {
        background: `radial-gradient(rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6)${
            Math.pow(timerValue / totalTime, 2) * 50
        }%, rgba(255, 255, 255, 0.2) ${
            Math.pow(timerValue / totalTime, 2) * 50
        }%, rgba(255, 255, 255, 0.2) 100%)`,
    };

    return (
        <div className="timer" style={style}>
            {timerValue}
        </div>
    );
};

const Input = (props) => {
    var propsTextArray = [...props.textArray];
    var started = false;

    const [enabled, setEnabled] = useState(1);

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

    const handleKeyPress = (e) => {
        if (enabled && e.keyCode !== 13) {
            var className = "";
            if (!started) {
                started = true;
                props.startTimerCallback();
            }

            if (currentChar < props.textArray.length) {
                if (
                    props.textArray[currentChar].props.children.props
                        .children !== e.key
                ) {
                    className = "char negative";
                    propsTextArray[currentChar] = (
                        <div className={className} key={currentChar}>
                            <pre>{e.key}</pre>
                        </div>
                    );
                } else {
                    className = "char positive";
                    if (
                        propsTextArray[currentChar].props.className.includes(
                            "negative"
                        )
                    )
                        className = "char fixed";
                    propsTextArray[currentChar] = (
                        <div className={className} key={currentChar}>
                            <pre>{e.key}</pre>
                        </div>
                    );
                }
                props.setTextArray(propsTextArray);

                extraCharsAtFront--;
                if (extraCharsAtEnd < props.textArray.length) extraCharsAtEnd++;
                setDisplayTextArray();
                currentChar++;
            }
            e.stopPropagation();
            e.preventDefault();
        }
    };

    const handleKeyDown = (e) => {
        if (enabled) {
            if (e.keyCode === 8) {
                if (extraCharsAtFront < initialExtraChars) {
                    extraCharsAtFront++;
                    if (extraCharsAtEnd > 0) extraCharsAtEnd--;
                    currentChar--;

                    var className =
                        propsTextArray[currentChar].props.className + " erased";

                    propsTextArray[currentChar] = (
                        <div className={className} key={currentChar}>
                            <pre>
                                {
                                    props.textArray[currentChar].props.children
                                        .props.children
                                }
                            </pre>
                        </div>
                    );
                    props.setTextArray(propsTextArray);
                }
                setDisplayTextArray();
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keypress", handleKeyPress);

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [enabled]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [enabled]);

    const endTimer = () => {
        setEnabled(0);
    };

    useEffect(() => {
        props.endTimer.current = endTimer;
    });

    return (
        <div className="input">
            <div className="mask">{displayTextArray}</div>
            <div className="cursor"></div>
        </div>
    );
};

export default App;
