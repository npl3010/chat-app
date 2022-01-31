import React, { useEffect, useState } from 'react';

// Redux:
import { useDispatch, useSelector } from 'react-redux';

// Services:
import { acceptFriendRequest, cancelFriendRequestSent, getFriendRequestsBetweenTwoUsers, sendFriendRequest, unfriend } from '../firebase/queryFriends';

// CSS:
import '../styles/scss/components/AppButtonForFriendRequest.scss';


function AppButtonForFriendRequest(props) {
    const {
        userID = '',
        otherUserID = ''
    } = props;


    // Redux:
    const { friends } = useSelector((state) => state.manageFriends);
    const dispatch = useDispatch();


    // State:
    // Values for buttonType: null, "add-friend", "unfriend", "cancel-request-sent", "decline-or-accept-request".
    const [buttonType, setButtonType] = useState(null);
    // Values for loadingStateFor: "add-friend", "unfriend", "cancel-request-sent", "accept-request-received", "decline-request-received".
    const [loadingStateFor, setLoadingStateFor] = useState('');


    // Methods:
    const handleSendFriendRequest = (fromUID, toUID) => {
        setLoadingStateFor('add-friend');
        sendFriendRequest(fromUID, toUID)
            .then((res) => {
                if (res) {
                    setButtonType('cancel-request-sent');
                    setLoadingStateFor('');
                }
            });
    };

    const handleCancelFriendRequestSent = (fromUID, toUID) => {
        setLoadingStateFor('cancel-request-sent');
        cancelFriendRequestSent(fromUID, toUID)
            .then((res) => {
                if (res === true) {
                    setButtonType('add-friend');
                    setLoadingStateFor('');
                }
            });
    };

    const handleUnfriend = (fromUID, toUID) => {
        // setLoadingStateFor('unfriend');
        unfriend(fromUID, toUID)
            .then((res) => {
                if (res === true) {
                    // setButtonType('add-friend');
                    // setLoadingStateFor('');
                }
            });
    };

    const handleAcceptFriendRequestReceived = (fromUID, toUID) => {
        setLoadingStateFor('accept-request-received');
        acceptFriendRequest(fromUID, toUID)
            .then((res) => {
                if (res === true) {
                    setButtonType('unfriend');
                    setLoadingStateFor('');
                }
            });
    };

    const handleCancelFriendRequestReceived = (fromUID, toUID) => {
        setLoadingStateFor('decline-request-received');
        cancelFriendRequestSent(fromUID, toUID)
            .then((res) => {
                if (res === true) {
                    setButtonType('add-friend');
                    setLoadingStateFor('');
                }
            });
    };


    // Side effects:
    useEffect(() => {
        if (userID !== '' && otherUserID !== '' && userID !== otherUserID) {
            // Check if they are already friends of each other:
            let count = 0;
            for (let i = 0; i < friends.length; i++) {
                if (friends[i] === otherUserID) {
                    count++;
                    break;
                }
            }

            if (count === 0) {
                // If they are not friends of each other, check if there is a friend request between them:

                // 1. If there is a friend request between them:
                // As for sender:
                // - Display "Cancel Request" button (to cancel a sent friend request).
                // As for receiver:
                // - Display "Delete" button (to cancel a received friend request).
                // - Display "Confirm" button (to accept a received friend request => "Request accepted").

                // 2. If there are no friend requests between them:
                // - Display "Add Friend" button.

                getFriendRequestsBetweenTwoUsers(userID, otherUserID)
                    .then((res) => {
                        let countPendingFriendRequests = 0;
                        for (let i = 0; i < res.length; i++) {
                            if (userID === res[i].senderUID) {
                                setButtonType('cancel-request-sent');
                                countPendingFriendRequests++;
                                break;
                            } else if (userID === res[i].receiverUID) {
                                setButtonType('decline-or-accept-request');
                                countPendingFriendRequests++;
                                break;
                            }
                        }

                        if (countPendingFriendRequests === 0) {
                            setButtonType('add-friend');
                        }
                    });
            } else {
                // If they are friends of each other:
                // - Display "Unfriend" button.
                setButtonType('unfriend');
            }
        }

        return (() => {
            setButtonType(null);
            setLoadingStateFor('');
        });
    }, [dispatch, friends, userID, otherUserID]);


    // Component:
    const renderButtons = () => {
        if (buttonType !== null) {
            if (buttonType === 'add-friend') {
                return (
                    <div className='app-btn-wrapper' onClick={() => handleSendFriendRequest(userID, otherUserID)}>
                        <div className={`app-btn${loadingStateFor === 'add-friend' ? ' is-loading' : ' highlighted'}`}>Thêm bạn</div>
                    </div>
                );
            } else if (buttonType === 'unfriend') {
                return (
                    <div className='app-btn-wrapper' onClick={() => handleUnfriend(userID, otherUserID)}>
                        <div className={`app-btn${loadingStateFor === 'unfriend' ? ' is-loading' : ' unhighlighted'}`}>Hủy kết bạn</div>
                    </div>
                );
            } else if (buttonType === 'cancel-request-sent') {
                return (
                    <div className='app-btn-wrapper' onClick={() => handleCancelFriendRequestSent(userID, otherUserID)}>
                        <div className={`app-btn${loadingStateFor === 'cancel-request-sent' ? ' is-loading' : ' unhighlighted'}`}>Hủy lời mời kết bạn</div>
                    </div>
                );
            } else if (buttonType === 'decline-or-accept-request') {
                return (
                    <div className='app-btns-wrapper'>
                        <div className='app-btn-wrapper' onClick={() => handleAcceptFriendRequestReceived(otherUserID, userID)}>
                            <div className={`app-btn${loadingStateFor === 'accept-request-received' ? ' is-loading' : ' highlighted'}`}>Chấp nhận</div>
                        </div>
                        <div className='app-btn-wrapper' onClick={() => handleCancelFriendRequestReceived(otherUserID, userID)}>
                            <div className={`app-btn${loadingStateFor === 'decline-request-received' ? ' is-loading' : ' unhighlighted'}`}>Từ chối</div>
                        </div>
                    </div>
                );
            }
        } else {
            if (userID === otherUserID) {
                return (
                    <div className='app-message unhighlighted'>Tài khoản của bạn</div>
                );
            } else {
                return (
                    <div className='app-btns-on-loading'>
                        <div className='app-loading-spinner-wrapper'>
                            <div className='app-loading-spinner normal'></div>
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <div className='app-btns for-friend-request'>
            {renderButtons()}
        </div>
    );
}

export default AppButtonForFriendRequest;