import React, { useEffect, useState } from 'react';
import { Avatar, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Components:
import ChatRoomCollapsibleMenu from './ChatRoomCollapsibleMenu';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/ChatRoomMenu.scss';


function ChatRoomMenu(props) {
    const {
        handleDisplayChatRoomMenu
    } = props;


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const { rooms, selectedChatRoomID, selectedChatRoomUsers } = useSelector((state) => state.manageRooms);


    // State:
    const [roomData, setRoomData] = useState({});


    // Side effects:
    useEffect(() => {
        if (selectedChatRoomID !== '') {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === selectedChatRoomID) {
                    setRoomData(rooms[i]);
                    break;
                }
            }
        }
    }, [rooms, selectedChatRoomID]);


    // Component:
    const renderGroupOfAvatars = () => {
        return (
            <Avatar.Group
                maxCount={3}
                maxPopoverTrigger="click"
                size="large"
                maxStyle={{ color: '#000', backgroundColor: '#ddd', cursor: 'pointer' }}
            >
                {
                    selectedChatRoomUsers.map((element, index) => {
                        const props = {};
                        if (element.photoURL !== null) {
                            props.src = element.photoURL;
                        }
                        return (
                            <Tooltip title={element.displayName} placement="bottom" key={`user-${index}`}>
                                <Avatar
                                    style={{ backgroundColor: '#eee' }}
                                    {...props}
                                >{element.photoURL === null ? 'U' : ''}</Avatar>
                            </Tooltip>
                        )
                    })
                }
            </Avatar.Group>
        );
    };

    const renderSingleUserAvatar = (roomType = '') => {
        // Specify user image to be displayed:
        let imgIndex = -1;
        if (selectedChatRoomUsers.length > 0) {
            if (roomType === 'one-to-one-chat') {
                for (let i = 0; i < selectedChatRoomUsers.length; i++) {
                    if (selectedChatRoomUsers[i].uid !== user.uid) {
                        imgIndex = i;
                        break;
                    }
                }
            } else if (roomType === 'self-chat') {
                imgIndex = 0;
            } else {
                imgIndex = -1;
            }
        }

        // Get img src:
        const imgSrc = (imgIndex === -1)
            ? '' : (selectedChatRoomUsers[imgIndex].photoURL);

        // Result:
        return (
            <div className='user-avatar-wrapper'>
                {
                    imgSrc === '' ? (
                        <div className='user-avatar' ></div>
                    ) : (
                        <img className='user-avatar' src={imgSrc} alt='' ></img>
                    )
                }
            </div>
        );
    };

    const renderRoomUserAvatars = () => {
        if (selectedChatRoomID !== '' && rooms.length > 0) {
            let roomType = roomData.type ? roomData.type : '';

            if (roomType === 'group-chat') {
                return renderGroupOfAvatars();
            } else if (roomType === 'one-to-one-chat') {
                return renderSingleUserAvatar('one-to-one-chat');
            } else if (roomType === 'self-chat') {
                return renderSingleUserAvatar('self-chat');
            } else {
                return renderSingleUserAvatar();
            }
        }
    }

    const renderOptionList = () => {
        if (selectedChatRoomID !== '' && rooms.length > 0) {
            let roomType = roomData.type ? roomData.type : '';

            if (roomType === 'group-chat') {
                return (
                    <>
                        <ChatRoomCollapsibleMenu
                            roomData={roomData}
                            selectedChatRoomUsers={selectedChatRoomUsers}
                        ></ChatRoomCollapsibleMenu>
                    </>
                );
            } else {
                return (
                    <></>
                );
            }
        }
    }

    const generateChatRoomName = () => {
        let result = '';
        if (selectedChatRoomID !== '') {
            let roomType = roomData.type ? roomData.type : '';

            if (roomType === 'one-to-one-chat') {
                if (selectedChatRoomUsers.length > 0) {
                    for (let i = 0; i < selectedChatRoomUsers.length; i++) {
                        if (selectedChatRoomUsers[i].uid !== user.uid) {
                            result = selectedChatRoomUsers[i].displayName;
                            break;
                        }
                    }
                }
            } else if (roomType === 'group-chat') {
                result = roomData.name ? roomData.name : '';
            }
        }
        return result;
    };

    const renderGoBackButtonForSmallDevices = () => {
        return (
            <div className='btn-for-small-devices' onClick={() => handleDisplayChatRoomMenu()}>
                <FontAwesomeIcon className='btn-icon' icon={faArrowLeft} />
            </div>
        );
    };

    return (
        <div className='chatroom-menu'>
            <div className='chatroom-menu__nav'>
                {renderGoBackButtonForSmallDevices()}
            </div>

            <div className='chatroom-menu__header'>
                <div className='chatroom-menu__info'>
                    <div className='chatroom-menu__members'>
                        {renderRoomUserAvatars()}
                    </div>
                    <div className='chatroom-menu__name'>{generateChatRoomName()}</div>
                </div>
            </div>

            <div className='chatroom-menu__options'>
                {renderOptionList()}
                <div className='actions-wrapper'>
                    <div className='action'></div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(ChatRoomMenu);