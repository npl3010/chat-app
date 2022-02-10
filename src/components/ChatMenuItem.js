import React, { useEffect, useState } from 'react';

// Components:
import AvatarGroup from './AvatarGroup';

// Redux:
import { useSelector } from 'react-redux';

// Services:
import { fetchUserListByUidList } from '../firebase/queryUsers';


function ChatMenuItem(props) {
    const {
        membersOfARoom = [],
        roomType = '',
        title = '',
        content = '',
        isSeenBy = []
    } = props;


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // State:
    const [membersDetails, setMembersDetails] = useState([]);
    const [isSeen, setIsSeen] = useState(false);


    // Side effects:
    useEffect(() => {
        if (membersOfARoom.length > 0) {
            if (roomType === 'one-to-one-chat') {
                const arr = membersOfARoom.filter((element) => {
                    return !(element === user.uid);
                });
                fetchUserListByUidList(arr)
                    .then((users) => {
                        const data = users.map((u, i) => {
                            return {
                                uid: u.uid,
                                imgSrc: u.photoURL,
                                displayName: u.displayName
                            }
                        });
                        setMembersDetails(data);
                    });
            } else if (roomType === 'group-chat') {
                const arr = membersOfARoom.filter((element) => {
                    return !(element === user.uid);
                });
                if (arr.length === 1) {
                    fetchUserListByUidList(arr)
                        .then((users) => {
                            const data = users.map((u, i) => {
                                return {
                                    uid: u.uid,
                                    imgSrc: u.photoURL,
                                    displayName: u.displayName
                                }
                            });
                            data.push({
                                uid: user.uid,
                                imgSrc: user.photoURL,
                                displayName: user.displayName
                            });
                            setMembersDetails(data);
                        });
                } else {
                    fetchUserListByUidList(arr)
                        .then((users) => {
                            const data = users.map((u, i) => {
                                return {
                                    uid: u.uid,
                                    imgSrc: u.photoURL,
                                    displayName: u.displayName
                                }
                            });
                            setMembersDetails(data);
                        });
                }
            }
        }
    }, [user, membersOfARoom, roomType]);

    useEffect(() => {
        let count = 0;
        for (let i = 0; i < isSeenBy.length; i++) {
            if (isSeenBy[i] === user.uid) {
                setIsSeen(true);
                count++;
                break;
            }
        }
        if (count === 0) {
            setIsSeen(false);
        }
    }, [user.uid, isSeenBy]);


    // Component:
    const renderOneToOneChatRoomImg = () => {
        if (membersDetails.length === 1) {
            return (
                <div className='person-img-wrapper'>
                    {membersDetails[0].imgSrc ? (
                        <img className='person-img' src={membersDetails[0].imgSrc} alt='' ></img>
                    ) : (
                        <div className='person-character-name'>
                            <span>{membersDetails[0].displayName?.charAt(0)?.toUpperCase()}</span>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div className='person-img-wrapper'></div>
            );
        }
    };

    const renderGroupChatImg = () => {
        if (membersDetails.length > 0) {
            return (
                <div className='group-img-wrapper'>
                    <AvatarGroup
                        className='normal'
                        imgsData={membersDetails}
                        moreAvatarsNumber={1}
                    ></AvatarGroup>
                </div>
            );
        } else {
            return (
                <div className='group-img-wrapper'></div>
            );
        }
    };

    const renderChatRoomImage = () => {
        if (roomType === 'group-chat') {
            return renderGroupChatImg();
        } else {
            return renderOneToOneChatRoomImg();
        }
    };

    const renderChatRoomName = () => {
        if (roomType === 'group-chat') {
            return title;
        } else if (roomType === 'one-to-one-chat') {
            if (membersDetails.length === 1) {
                const name = membersDetails[0]?.displayName ? (membersDetails[0].displayName) : '';
                return name;
            } else {
                return 'Unknown';
            }
        } else {
            return '';
        }
    };

    return (
        <div className='chatbox-wrapper'>
            <div className={`chatbox${isSeen === false ? ' unseen' : ''}`}>
                <div className='chatbox__img'>
                    {renderChatRoomImage()}
                </div>
                <div className='chatbox__info'>
                    <div className='chatbox-title'>{renderChatRoomName()}</div>
                    <div className='chatbox-latest-message'>{content}</div>
                </div>
                <div className='chatbox__status'>
                    {
                        isSeen === false ? (
                            <div className='chatbox-dot'></div>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default ChatMenuItem;