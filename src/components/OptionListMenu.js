import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft, faChevronRight, faCog, faQuestionCircle, faMoon, faSignOutAlt, faGlobe
} from '@fortawesome/free-solid-svg-icons';

// CSS:
import '../styles/scss/components/OptionListMenu.scss';


function OptionListMenu(props) {
    const optionListPageRef_1 = useRef(null);
    const optionListPageRef_2 = useRef(null);


    // State:
    const [idOfPageToBeDisplayed, setidOfPageToBeDisplayed] = useState(1);
    const [idOfMenuToBeDisplayed, setidOfMenuToBeDisplayed] = useState(0);
    const [optionListHeight, setOptionListHeight] = useState(0);


    // Methods:
    const goToMenu = (menuNumber) => {
        setidOfMenuToBeDisplayed(menuNumber);
        setidOfPageToBeDisplayed(2);
    }

    const goToMainMenu = () => {
        // setidOfMenuToBeDisplayed(0);
        setidOfPageToBeDisplayed(1);
    }


    // Side effects:
    useEffect(() => {
        if (idOfPageToBeDisplayed === 1) {
            setOptionListHeight(optionListPageRef_1.current.clientHeight)
        } else if (idOfPageToBeDisplayed === 2) {
            setOptionListHeight(optionListPageRef_2.current.clientHeight)
        }
    }, [idOfPageToBeDisplayed]);


    // Component:
    return (
        <div className='option-list-wrapper for-topnav' style={{ height: optionListHeight }}>
            <div className={`option-list-wrapper__pages-wrapper page-${idOfPageToBeDisplayed}`}>

                {/* Page 1: */}
                <div className='option-list-wrapper__page' ref={optionListPageRef_1}>
                    <div className='option-list'>
                        <div className='option-list__item' onClick={() => goToMenu(1)}>
                            <div className='option-list__option-title'>
                                <div className='option-list__icon-wrapper'>
                                    <FontAwesomeIcon className='option-list__icon' icon={faCog} />
                                </div>
                                <span>Cài đặt &amp; quyền riêng tư</span>
                            </div>
                            <FontAwesomeIcon className='option-list__icon' icon={faChevronRight} />
                        </div>
                        <div className='option-list__item' onClick={() => goToMenu(2)}>
                            <div className='option-list__option-title'>
                                <div className='option-list__icon-wrapper'>
                                    <FontAwesomeIcon className='option-list__icon' icon={faQuestionCircle} />
                                </div>
                                <span>Trợ giúp &amp; hỗ trợ</span>
                            </div>
                            <FontAwesomeIcon className='option-list__icon' icon={faChevronRight} />
                        </div>
                        <div className='option-list__item' onClick={() => goToMenu(3)}>
                            <div className='option-list__option-title'>
                                <div className='option-list__icon-wrapper'>
                                    <FontAwesomeIcon className='option-list__icon' icon={faMoon} />
                                </div>
                                <span>Màn hình &amp; trợ năng</span>
                            </div>
                            <FontAwesomeIcon className='option-list__icon' icon={faChevronRight} />
                        </div>
                        <div className='option-list__item' onClick={() => props.handleLogout()}>
                            <div className='option-list__option-title'>
                                <div className='option-list__icon-wrapper'>
                                    <FontAwesomeIcon className='option-list__icon' icon={faSignOutAlt} />
                                </div>
                                <span>Đăng xuất</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page 2: */}
                <div className='option-list-wrapper__page' ref={optionListPageRef_2}>

                    {/* Menu 1: */}
                    <div className={`option-list-wrapper__menu${idOfMenuToBeDisplayed === 1 ? ' is-displayed' : ''}`}>
                        <div className='navigation'>
                            <div className='navigation__left-section'>
                                <div className='navigation_button go-back-btn' onClick={() => goToMainMenu()}>
                                    <FontAwesomeIcon className='navigation_button-icon' icon={faChevronLeft} />
                                </div>
                                <div className="navigation_title">Cài đặt &amp; quyền riêng tư</div>
                            </div>
                            <div className='navigation__right-section'></div>
                        </div>
                        <div className='option-list'>
                            <div className='option-list__item is-disabled'>
                                <div className='option-list__option-title'>
                                    <div className='option-list__icon-wrapper'>
                                        <FontAwesomeIcon className='option-list__icon' icon={faCog} />
                                    </div>
                                    <span>Cài đặt</span>
                                </div>
                            </div>
                            <div className='option-list__item is-disabled'>
                                <div className='option-list__option-title'>
                                    <div className='option-list__icon-wrapper'>
                                        <FontAwesomeIcon className='option-list__icon' icon={faGlobe} />
                                    </div>
                                    <span>Ngôn ngữ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu 2: */}
                    <div className={`option-list-wrapper__menu${idOfMenuToBeDisplayed === 2 ? ' is-displayed' : ''}`}>
                        <div className='navigation'>
                            <div className='navigation__left-section'>
                                <div className='navigation_button go-back-btn' onClick={() => goToMainMenu()}>
                                    <FontAwesomeIcon className='navigation_button-icon' icon={faChevronLeft} />
                                </div>
                                <div className="navigation_title">Trợ giúp &amp; hỗ trợ</div>
                            </div>
                            <div className='navigation__right-section'></div>
                        </div>
                        <div className='option-list'>
                            <div className='option-list__item is-disabled'>
                                <div className='option-list__option-title'>
                                    <div className='option-list__icon-wrapper'>
                                        <FontAwesomeIcon className='option-list__icon' icon={faQuestionCircle} />
                                    </div>
                                    <span>Trung tâm trợ giúp</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu 3: */}
                    <div className={`option-list-wrapper__menu${idOfMenuToBeDisplayed === 3 ? ' is-displayed' : ''}`}>
                        <div className='navigation'>
                            <div className='navigation__left-section'>
                                <div className='navigation_button go-back-btn' onClick={() => goToMainMenu()}>
                                    <FontAwesomeIcon className='navigation_button-icon' icon={faChevronLeft} />
                                </div>
                                <div className="navigation_title">Màn hình &amp; trợ năng</div>
                            </div>
                            <div className='navigation__right-section'></div>
                        </div>
                        <div className='option-list'>
                            <div className='option-list__item is-disabled'>
                                <div className='option-list__option-title'>
                                    <div className='option-list__icon-wrapper'>
                                        <FontAwesomeIcon className='option-list__icon' icon={faMoon} />
                                    </div>
                                    <span>Chế độ tối</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OptionListMenu;