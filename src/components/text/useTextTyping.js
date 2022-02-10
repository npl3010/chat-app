import { useEffect, useRef, useState } from 'react';


const Phase = {
    STARTING: 0,
    TYPING: 1,
    PAUSING: 2,
    DELETING: 3
};


function useTextTyping(text) {
    const timeoutID = useRef(null);


    // State:
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [currentPhase, setCurrentPhase] = useState(Phase.STARTING);
    const [typedText, setTypedText] = useState('');


    // Side effects:
    useEffect(() => {
        // There are two cases of text:
        // - 1. text variable is an array of strings.
        // - 2. text variable is a string.

        switch (currentPhase) {
            case Phase.TYPING:
                {
                    if (Array.isArray(text) === true) {
                        // (CASE 1).
                        if (text.length > 0) {
                            const nextTextToType = text[selectedIndex].slice(0, (typedText.length + 1));

                            if (nextTextToType === typedText) {
                                // Pause text animation:
                                setCurrentPhase(Phase.PAUSING);
                                // Start text animation for 'DELETING':
                                timeoutID.current = setTimeout(() => {
                                    setCurrentPhase(Phase.DELETING);
                                }, 1000);
                                break;
                            } else {
                                timeoutID.current = setTimeout(() => {
                                    setTypedText(nextTextToType);
                                }, 150);
                                break;
                            }
                        }
                    } else if (typeof text === 'string') {
                        // (CASE 2).
                        const nextTextToType = text.slice(0, (typedText.length + 1));

                        if (nextTextToType === typedText) {
                            // Pause text animation:
                            setCurrentPhase(Phase.PAUSING);
                            // Start text animation for 'DELETING' after a second:
                            timeoutID.current = setTimeout(() => {
                                setCurrentPhase(Phase.DELETING);
                            }, 1000);
                            break;
                        } else {
                            timeoutID.current = setTimeout(() => {
                                setTypedText(nextTextToType);
                            }, 150);
                            break;
                        }
                    }
                    break;
                }
            case Phase.DELETING:
                {
                    if (Array.isArray(text) === true) {
                        // (CASE 1).
                        if (text.length > 0) {
                            if (typedText === '') {
                                // Start text animation for 'TYPING':
                                if (text.length - 1 > selectedIndex) {
                                    setSelectedIndex(selectedIndex + 1);
                                } else {
                                    setSelectedIndex(0);
                                }
                                setCurrentPhase(Phase.TYPING);
                                break;
                            } else {
                                const nextRemainingText = text[selectedIndex].slice(0, (typedText.length - 1));

                                timeoutID.current = setTimeout(() => {
                                    setTypedText(nextRemainingText);
                                }, 50);
                                break;
                            }
                        }
                    } else if (typeof text === 'string') {
                        // (CASE 2).
                        if (typedText === '') {
                            // Start text animation for 'TYPING':
                            setCurrentPhase(Phase.TYPING);
                            break;
                        } else {
                            const nextRemainingText = text[0].slice(0, (typedText.length - 1));

                            timeoutID.current = setTimeout(() => {
                                setTypedText(nextRemainingText);
                            }, 150);
                            break;
                        }
                    }
                    break;
                }
            case Phase.STARTING:
                {
                    if (Array.isArray(text) === true) {
                        if (text.length > 0) {
                            setSelectedIndex(0);
                            setCurrentPhase(Phase.TYPING);
                        } else {
                            setCurrentPhase(Phase.PAUSING);
                        }
                    } else {
                        setCurrentPhase(Phase.PAUSING);
                    }
                    break;
                }
            case Phase.PAUSING:
            default:
                break;
        }

        return (() => {
            clearTimeout(timeoutID.current);
        });
    }, [text, typedText, currentPhase, selectedIndex]);


    // Result:
    return (typedText);
}

export default useTextTyping;