import React from 'react';

// CSS:
import '../../styles/scss/components/TextWithEffect.scss';


function TextWithEffect(props) {
    /**
     * Props:
     * Values for type: "" || "default".
     */
    const {
        text = 'TEXT',
        textType = ''
    } = props;


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
    const renderTextWithEffect = () => {
        if (Array.isArray(textType) === true) {
            return (
                <div className='text-with-effect-wrapper'>
                    <div className={`text-with-effect animated-glitch-text-effect${getClassNames()}`}>
                        <span className='text-layer' aria-hidden={true}>{text}</span>
                        {text}
                        <span className='text-layer' aria-hidden={true}>{text}</span>
                    </div>
                </div>
            );
        } else if (typeof textType === 'string') {
            if (textType === '' || textType === 'default') {
                return (
                    <div className='text-with-effect-wrapper'>
                        <div className='text-with-effect animated-glitch-text-effect'>
                            <span className='text-layer' aria-hidden={true}>{text}</span>
                            {text}
                            <span className='text-layer' aria-hidden={true}>{text}</span>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className='text-with-effect-wrapper'>
                        <div className={`text-with-effect animated-glitch-text-effect${textType ? ' ' + textType : ''}`}>
                            <span className='text-layer' aria-hidden={true}>{text}</span>
                            {text}
                            <span className='text-layer' aria-hidden={true}>{text}</span>
                        </div>
                    </div>
                );
            }
        } else {
            return (null);
        }
    };
    
    return (
        <>
            {renderTextWithEffect()}
        </>
    );
}

export default TextWithEffect;