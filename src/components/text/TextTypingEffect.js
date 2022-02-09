import React from 'react';

// Custom hooks:
import useTextTyping from './useTextTyping';

// CSS:
import '../../styles/scss/components/TextTypingEffect.scss';


function TextTypingEffect(props) {
    /**
     * Props:
     * Values for type: "" || "default".
     */
    const {
        text = 'TEXT',
        textType = ''
    } = props;


    // State:
    const typedText = useTextTyping(text);


    // Methods:
    const getClassNames = () => {
        let result = '';
        if (Array.isArray(textType) === true) {
            for (let i = 0; i < textType.length; i++) {
                result += (' ' + textType[i]);
            }
        }
        return result;
    };


    // Component:
    const renderHiddenText = () => {
        if (Array.isArray(text) === true) {
            let indexOfText = -1;
            let maxLength = -1;
            for (let i = 0; i < text.length; i++) {
                if (maxLength < text[i].length) {
                    indexOfText = i;
                    maxLength = text[i].length;
                }
            }
            if (indexOfText !== -1) {
                return (
                    <span className='text-typing-effect hidden-text'>{text[indexOfText]}</span>
                );
            } else {
                return null;
            }
        } else if (typeof text === 'string') {
            return (
                <span className='text-typing-effect hidden-text'>{text}</span>
            );
        }
    };

    const renderTextTypingEffect = () => {
        if (Array.isArray(textType) === true) {
            return (
                <div className='text-typing-effect-wrapper'>
                    <span className={`text-typing-effect blinking-cursor${getClassNames()}`}>
                        {typedText}
                    </span>
                </div>
            );
        } else if (typeof textType === 'string') {
            if (textType === '' || textType === 'default') {
                return (
                    <div className='text-typing-effect-wrapper'>
                        {renderHiddenText()}
                        <span className={`text-typing-effect visible-text blinking-cursor`}>
                            {typedText}
                        </span>
                    </div>
                );
            } else {
                return (
                    <div className='text-typing-effect-wrapper'>
                        {renderHiddenText()}
                        <span className={`text-typing-effect visible-text blinking-cursor${textType ? ' ' + textType : ''}`}>
                            {typedText}
                        </span>
                    </div>
                );
            }
        } else {
            return (null);
        }
    };

    return (
        <>
            {renderTextTypingEffect()}
        </>
    );
}

export default TextTypingEffect;