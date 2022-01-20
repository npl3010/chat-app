import React from 'react';

// CSS:
import '../styles/scss/components/AvatarGroup.scss';


/**
 * 
 * @param {Array} props.imgsData
 * @param {string} props.imgsData.imgSrc Image's URL.
 * @param {string} props.imgsData.displayName Name of the image.
 * @returns 
 */
function AvatarGroup(props) {
    const {
        imgsData = []
    } = props;


    // Component:
    const renderClassNameForAvatarGroup = () => {
        let className = '';
        if (imgsData.length === 2) {
            className = ' two-imgs';
        } else if (imgsData.length === 3) {
            className = ' three-imgs';
        } else if (imgsData.length === 4) {
            className = ' four-imgs';
        }
        return className;
    };

    const renderAvatars = () => {
        return (
            <div className='avatar-wrapper'>
                {
                    imgsData.map((data, index) => {
                        return (
                            <div className='avatar' key={`avatar${index}`}>
                                {data.imgSrc ? (
                                    <img className='avatar__img' src={data.imgSrc} alt='' ></img>
                                ) : (
                                    <div className='avatar__character'>
                                        <span>{data.displayName?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    return (
        <div className={`avatar-group${renderClassNameForAvatarGroup()}`}>
            {renderAvatars()}
        </div>
    );
}

export default AvatarGroup;