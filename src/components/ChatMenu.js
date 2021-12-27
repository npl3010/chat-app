import React from 'react';

// CSS:
import '../styles/scss/components/ChatMenu.scss';


function ChatMenu(props) {
    return (
        <div className='chatmenu'>
            <div className='chatmenu__header'>
                <div className='searchbox-wrapper'>
                    <div className='searchbox'>
                        <input type='text' placeholder='Tìm kiếm trên app'></input>
                    </div>
                </div>
            </div>
            <div className='chatmenu__chatlist'>
                <div className='chatlist-wrapper'>
                    <div className='chatlist'>
                        <div className='chatlist__item'>
                            <div className='chatbox'>
                                <div className='chatbox__person-img'>
                                    <img className='person-img' src='' alt='' ></img>
                                </div>
                                <div className='chatbox__info'>
                                    <div className='chatbox-title'>Trần Giả Trân</div>
                                    <div className='chatbox-latest-message'>Tin nhắn mới nhất nè!</div>
                                </div>
                            </div>
                        </div>
                        <div className='chatlist__item active'>
                            <div className='chatbox'>
                                <div className='chatbox__person-img'>
                                    <img className='person-img' src='' alt='' ></img>
                                </div>
                                <div className='chatbox__info'>
                                    <div className='chatbox-title'>Trần Giả Trân</div>
                                    <div className='chatbox-latest-message'>Tin nhắn mới nhất nè!</div>
                                </div>
                            </div>
                        </div>
                        <div className='chatlist__item'>
                            <div className='chatbox'>
                                <div className='chatbox__person-img'>
                                    <img className='person-img' src='' alt='' ></img>
                                </div>
                                <div className='chatbox__info'>
                                    <div className='chatbox-title'>Trần Giả Trân</div>
                                    <div className='chatbox-latest-message'>Tin nhắn mới nhất nè!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatMenu;