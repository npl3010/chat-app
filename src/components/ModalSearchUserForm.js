import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

// CSS:
import '../styles/scss/components/ModalSearchUserForm.scss';


const { Option } = Select;

function ModalSearchUserForm({ isModalSearchVisible, setIsModalSearchVisible }) {
    // State:
    const [idOfFormToBeDisplayed, setIdOfFormToBeDisplayed] = useState(1);


    // Variables:
    const selectBefore = (
        <Select defaultValue="user-name" className="select-before">
            <Option value="user-name">Tên</Option>
            <Option value="user-email">Email</Option>
        </Select>
    );


    // Component:
    return (
        <>
            <div
                className={`overlay${isModalSearchVisible ? ' visible' : ''}`}
                onClick={() => setIsModalSearchVisible(!isModalSearchVisible)}
            ></div>

            <div
                className={`modal-search-user-form${isModalSearchVisible ? ' visible' : ''}`}
            >
                <div className='modal-content-wrapper'>
                    <div className={`user-search-form-wrapper form-${idOfFormToBeDisplayed}`}>

                        {/* First form: */}
                        <div className='user-search-form'>
                            <div className='user-search-form__search-box-wrapper'>
                                <span className='title'>Đến:</span>
                                <Input addonBefore={selectBefore} />
                            </div>

                            <div className='user-search-form__userlist'>
                                <div className='userlist-wrapper'>
                                    <div className='userlist'>
                                        <div
                                            className='userlist__item'
                                            key={`user-1`}
                                            onClick={() => setIdOfFormToBeDisplayed(2)}
                                        >
                                            <div className='user'>
                                                <div className='user__person-img'>
                                                    <img className='person-img' src='' alt='' ></img>
                                                </div>
                                                <div className='user__info'>
                                                    <div className='user-title'>Username</div>
                                                    <div className='user-more-info'>...</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Second form: */}
                        <div className='user-search-form'>
                            <div className='user-search-form__navigation'>
                                <div className='navigation-wrapper'>
                                    <div className='navigation'>
                                        <div className='navigation__left-section'>
                                            <div
                                                className='nav_button go-back-btn'
                                                onClick={() => setIdOfFormToBeDisplayed(1)}
                                            >
                                                <FontAwesomeIcon className='nav_button__icon' icon={faChevronLeft} />
                                            </div>
                                            <div className='nav-title'>Tìm bạn bè</div>
                                        </div>
                                        <div className='navigation__right-section'>
                                            <div
                                                className='nav_button close-btn'
                                                onClick={() => setIsModalSearchVisible(!isModalSearchVisible)}
                                            >
                                                <FontAwesomeIcon className='nav_button__icon' icon={faTimes} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='user-search-form__user-profile'>
                                <div className='user-profile-wrapper'>
                                    <div className='quick-user-profile'>
                                        <div className='img-wrapper'>
                                            <div className='user-bg-img-wrapper'></div>
                                            <div className='user-avatar-wrapper'>
                                                <img className='user-avatar' src='' alt='' ></img>
                                            </div>
                                        </div>
                                        <div className='info-wrapper'>
                                            <div className='info'>
                                                <div className='info__user-name'>
                                                    <a className='info__user-name-url' href='/'>Trần Giả Trân</a>
                                                </div>
                                                <div className='info__actions'>
                                                    <div className='info__action-list-wrapper'>
                                                        <div className='info__action-list'>
                                                            <button className='info__action-button'>Thêm bạn</button>
                                                            <button className='info__action-button'>Nhắn tin</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </ div>
        </>
    );

}

export default ModalSearchUserForm;