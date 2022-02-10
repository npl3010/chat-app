import React from 'react';

// CSS:
import '../styles/scss/components/AvatarGroup.scss';


/**
 * 
 * @param {Array} props.imgsData
 * @param {string} props.imgsData[index].imgSrc Image's URL.
 * @param {string} props.imgsData[index].displayName Name of the image.
 * @returns 
 */
function AvatarGroup(props) {
    const {
        imgsData = [],
        moreAvatarsNumber = 0,
        className = ''
    } = props;


    // Component:
    const renderClassNameForAvatarGroup = () => {
        let className = '';
        if (imgsData.length === 1) {
            className = ' one-img';
        } else if (imgsData.length === 2) {
            className = ' two-imgs';
        } else if (imgsData.length === 3) {
            className = ' three-imgs';
        } else if (imgsData.length === 4) {
            className = ' four-imgs';
        } else if (imgsData.length > 4) {
            className = ' four-imgs';
        }
        return className;
    };

    const renderAvatars = () => {
        let count = 0;
        return (
            <div className='avatar-wrapper'>
                {
                    imgsData.map((data, index) => {
                        count++;
                        if (imgsData.length > 4 && count === 4) {
                            return (
                                <div className='avatar' key={`avatar${index}`}>
                                    <div className='avatar__character'>
                                        <span>+{imgsData.length - 3 + moreAvatarsNumber}</span>
                                    </div>
                                </div>
                            );
                        } else if (imgsData.length > 4 && count > 4) {
                            return (null);
                        } else {
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
                        }
                    })
                }
            </div>
        );
    };

    return (
        <div className={`avatar-group${renderClassNameForAvatarGroup()}${className ? (' ' + className) : ''}`}>
            {renderAvatars()}
        </div>
    );
}

export default AvatarGroup;