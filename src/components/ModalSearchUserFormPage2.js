import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

// Components:
import AppButtonForFriendRequest from './AppButtonForFriendRequest';
import AppButtonForJoiningChatRoom from './AppButtonForJoiningChatRoom';

// Redux:
import { useSelector } from 'react-redux';


function ModalSearchUserFormPage2(props) {
    const {
        userSearchResultList,
        userSearchResultSelected,
        isModalSearchUserVisible,
        setIsModalSearchUserVisible,
        hanldeGoBackToUserSearchResultList
    } = props;
    const userProfile = useRef(null);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // Component:
    const renderUserProfile = () => {
        for (let i = 0; i < userSearchResultList.length; i++) {
            if (userSearchResultList[i].uid === userSearchResultSelected) {
                userProfile.current = userSearchResultList[i];
                break;
            }
        }
        return (
            <div className='quick-user-profile'>
                <div className='img-wrapper'>
                    <div className='user-bg-img-wrapper'></div>
                    <div className='user-avatar-wrapper'>
                        <div className='person-img-wrapper'>
                            {userProfile.current?.photoURL ? (
                                <img className='user-avatar' src={userProfile.current.photoURL} alt='' ></img>
                            ) : (
                                <div className='user-character-name'>
                                    <span>{userProfile.current?.displayName?.charAt(0)?.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='info-wrapper'>
                    <div className='info'>
                        <div className='info__user-name'>
                            <a className='info__user-name-url' href='/'>{userProfile.current?.displayName}</a>
                        </div>
                        <div className='info__actions'>
                            <div className='info__action-list-wrapper'>
                                <div className='info__action-list'>
                                    <div className='info__action-button'>
                                        <AppButtonForFriendRequest
                                            userID={user.uid}
                                            otherUserID={userProfile.current?.uid}
                                        ></AppButtonForFriendRequest>
                                    </div>
                                    <div className='info__action-button'>
                                        <AppButtonForJoiningChatRoom
                                            userData={userProfile.current}
                                            doActionAfter={() => setIsModalSearchUserVisible(!isModalSearchUserVisible)}
                                        ></AppButtonForJoiningChatRoom>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='user-search-form'>
                <div className='user-search-form__navigation'>
                    <div className='navigation-wrapper'>
                        <div className='navigation'>
                            <div className='navigation__left-section'>
                                <div
                                    className='nav_button go-back-btn'
                                    onClick={() => hanldeGoBackToUserSearchResultList()}
                                >
                                    <FontAwesomeIcon className='nav_button__icon' icon={faChevronLeft} />
                                </div>
                                <div className='nav-title'>Tìm bạn bè</div>
                            </div>
                            <div className='navigation__right-section'>
                                <div
                                    className='nav_button close-btn'
                                    onClick={() => setIsModalSearchUserVisible(!isModalSearchUserVisible)}
                                >
                                    <FontAwesomeIcon className='nav_button__icon' icon={faTimes} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='user-search-form__user-profile'>
                    <div className='user-profile-wrapper'>
                        {renderUserProfile()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalSearchUserFormPage2;