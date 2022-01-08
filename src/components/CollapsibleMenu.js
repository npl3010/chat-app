import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';

// CSS:
import '../styles/scss/components/CollapsibleMenu.scss';


function CollapsibleMenu(props) {
    // State:
    const [idOfInlineMenuToBeDisplayed, setidOfInlineMenuToBeDisplayed] = useState(-1);


    // Methods:
    const handleToggleBetweenHidingAndShowingMenu = (e, menuNumber) => {
        e.stopPropagation();
        if (idOfInlineMenuToBeDisplayed === menuNumber) {
            setidOfInlineMenuToBeDisplayed(-1);
        } else {
            setidOfInlineMenuToBeDisplayed(menuNumber);
        }
    }


    // Component:
    return (
        <div className='collapsible-menu-wrapper for-chatroom-menu'>
            <div className='collapsible-menu'>
                <div className='option-list-wrapper'>
                    <div className='option-list'>
                        <div
                            className={`option-list__item${idOfInlineMenuToBeDisplayed === 0 ? ' active' : ''}`}
                        >
                            <div className='option-wrapper'>
                                <div
                                    className='option'
                                    onClick={(e) => handleToggleBetweenHidingAndShowingMenu(e, 0)}
                                >
                                    <div className='option__title'>
                                        <span>Tùy chỉnh đoạn chat</span>
                                    </div>
                                    <FontAwesomeIcon className='option__icon' icon={faChevronDown} />
                                </div>
                                <div className='inline-menu'>
                                    <div>Dòng số 00001</div>
                                    <div>Dòng số 00002</div>
                                    <div>Dòng số 00003</div>
                                    <div>Dòng số 00004</div>
                                    <div>Dòng số 00005</div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`option-list__item${idOfInlineMenuToBeDisplayed === 1 ? ' active' : ''}`}
                        >
                            <div className='option-wrapper'>
                                <div
                                    className='option'
                                    onClick={(e) => handleToggleBetweenHidingAndShowingMenu(e, 1)}
                                >
                                    <div className='option__title'>
                                        <span>Tùy chọn nhóm</span>
                                    </div>
                                    <FontAwesomeIcon className='option__icon' icon={faChevronDown} />
                                </div>
                                <div className='inline-menu'>
                                    <div>Dòng số 00001</div>
                                    <div>Dòng số 00002</div>
                                    <div>Dòng số 00003</div>
                                    <div>Dòng số 00004</div>
                                    <div>Dòng số 00005</div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`option-list__item${idOfInlineMenuToBeDisplayed === 2 ? ' active' : ''}`}
                        >
                            <div className='option-wrapper'>
                                <div
                                    className='option'
                                    onClick={(e) => handleToggleBetweenHidingAndShowingMenu(e, 2)}
                                >
                                    <div className='option__title'>
                                        <span>Thành viên trong đoạn chat</span>
                                    </div>
                                    <FontAwesomeIcon className='option__icon' icon={faChevronDown} />
                                </div>
                                <div className='inline-menu'>
                                    <div>Dòng số 00001</div>
                                    <div>Dòng số 00002</div>
                                    <div>Dòng số 00003</div>
                                    <div>Dòng số 00004</div>
                                    <div>Dòng số 00005</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollapsibleMenu;