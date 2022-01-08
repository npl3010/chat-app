import React from 'react';

// CSS:
import '../styles/scss/components/AvatarGroup.scss';


function AvatarGroup(props) {
    return (
        <div className='avatar-group four-imgs'>
            <div className='avatar-wrapper'>
                <div className='avatar'>
                    <img className='avatar__img' src='https://i.pinimg.com/originals/53/34/4d/53344d5fe450709401a190a64d2e7231.jpg' alt='' ></img>
                </div>
                <div className='avatar'>
                    <img className='avatar__img' src='https://i.pinimg.com/originals/53/34/4d/53344d5fe450709401a190a64d2e7231.jpg' alt='' ></img>
                </div>
                <div className='avatar'>
                    <img className='avatar__img' src='https://i.pinimg.com/originals/53/34/4d/53344d5fe450709401a190a64d2e7231.jpg' alt='' ></img>
                </div>
                <div className='avatar'>
                    <div className='avatar__character' >30+</div>
                </div>
            </div>
        </div>
    );
}

export default AvatarGroup;