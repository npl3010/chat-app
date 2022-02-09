import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faUserPlus, faUsers, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Components:
import ChatMenuItem from './ChatMenuItem';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { resetRoomsStatesToInitial, selectRoom, setIsLoadingARoom, setRoomIDWillBeSelected, setRoomList, setselectedChatRoomUsers, setTemporaryRoom } from '../features/manageRooms/manageRoomsSlice';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// Custom hooks:
import useRooms from '../customHooks/useRooms';

// Services:
import { fetchUserListByUidList } from '../firebase/queryUsers';
import { fetchFriendListByUserName, fetchFriendListOfUser } from '../firebase/queryFriends';
import { markNewMessagesAsReadByUID } from '../firebase/queryRooms';

// CSS:
import '../styles/scss/components/ChatMenu.scss';


function ChatMenu(props) {
    const timeout = useRef(null);


    // Context:
    const {
        isModalSearchUserVisible, setIsModalSearchUserVisible,
        isModalAddGroupVisible, setisModalAddGroupVisible
    } = React.useContext(ModalControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const { rooms, selectedChatRoomID, roomIDWillBeSelected } = useSelector((state) => state.manageRooms);
    const { friends } = useSelector((state) => state.manageFriends);
    const dispatch = useDispatch();


    // State:
    const [isSearchBoxInputFocused, setIsSearchBoxInputFocused] = useState(false);
    const [searchResultList, setSearchResultList] = useState([]);
    const [stateForSearching, setStateForSearching] = useState('none'); // Value: none, fetching, empty-search-result.


    // Methods:
    const getUsersByUids = useCallback((roomID, uidList) => {
        fetchUserListByUidList(uidList)
            .then((users) => {
                // Select this room after the data of is room is already loaded:
                dispatch(selectRoom({
                    roomID: roomID,
                    users: users
                }));
                dispatch(setIsLoadingARoom(false));
            });
    }, [dispatch]);

    const handleClickChatRoom = useCallback((roomID) => {
        let uidList = [];
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].id === roomID) {
                uidList = [...rooms[i].members];
                dispatch(setIsLoadingARoom(true));
                break;
            }
        }

        fetchUserListByUidList(uidList)
            .then((users) => {
                // Select this room after the data of is room is already loaded:
                dispatch(selectRoom({
                    roomID: roomID,
                    users: users
                }));
                dispatch(setIsLoadingARoom(false));

                // Then, new messages of this room is seen by the user:
                markNewMessagesAsReadByUID(roomID, user.uid);
            });
    }, [dispatch, rooms, user.uid]);

    const handleFocusSearchBox = (e) => {
        setIsSearchBoxInputFocused(true);
        if (searchResultList.length === 0) {
            if (!e.target.value) {
                getDefaultFriendList(e);
            }
        }
    };

    const handleBlurSearchBox = () => {
        setIsSearchBoxInputFocused(false);
    };

    const getDefaultFriendList = (e) => {
        clearTimeout(timeout.current);
        // Data is being fetched or not:
        setStateForSearching('fetching');
        // Clear options:
        setSearchResultList([]);
        // Fetch API:
        timeout.current = setTimeout(async () => {
            fetchFriendListOfUser(user.uid, [])
                .then((userList) => {
                    setSearchResultList(userList);
                    if (userList.length === 0) {
                        setStateForSearching('empty-search-result');
                    } else {
                        setStateForSearching('none');
                    }
                });
        }, 500);
    }

    const handleSearchInputChange = (e) => {
        // We must clearTimeout to prevent autocomplete on submitting many requests when fetching API:
        clearTimeout(timeout.current);

        // Handle search:
        if (e.target.value) {
            // Data is being fetched or not:
            setStateForSearching('fetching');
            // Clear options:
            setSearchResultList([]);
            // Fetch API:
            let keywordToSearchFor = e.target.value;
            timeout.current = setTimeout(async () => {
                fetchFriendListByUserName(user.uid, keywordToSearchFor, [])
                    .then((userList) => {
                        setSearchResultList(userList);
                        if (userList.length === 0) {
                            setStateForSearching('empty-search-result');
                        } else {
                            setStateForSearching('none');
                        }
                    });
            }, 500);
        } else {
            // Data is being fetched or not:
            setStateForSearching('fetching');
            // Clear options:
            setSearchResultList([]);
            // Fetch API:
            timeout.current = setTimeout(async () => {
                fetchFriendListOfUser(user.uid, [])
                    .then((userList) => {
                        setSearchResultList(userList);
                        if (userList.length === 0) {
                            setStateForSearching('empty-search-result');
                        } else {
                            setStateForSearching('none');
                        }
                    });
            }, 500);
        }
    };

    const goToChatRoomWith = (userData) => {
        const usersOfRoom = [user.uid, userData.uid];

        // Check if a room (of local room list) for the users above already exists:
        let idOfRoom = '';
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].type === 'one-to-one-chat' && rooms[i].members.length === 2) {
                const allFounded = usersOfRoom.every(uid => {
                    return rooms[i].members.includes(uid);
                });
                if (allFounded === true) {
                    idOfRoom = rooms[i].id;
                    break;
                }
            }
        }

        // If idOfRoom === '', it is probably because of the pagination/load-more.
        // (This means that the app hasn't loaded all the rooms yet).
        if (idOfRoom === '') {
            // Do these steps below:
            // 1. Check if roomIDWillBeSelected is equal to a room's id already exists in database.
            // - If yes:
            // Load the room and store it in temporaryRoom.
            // Load and store all data related to the room, like selectedChatRoomID, selectedChatRoomUsers,... .
            // - If no: do nothing.
        }

        // If a room for the users above already exists, select this room,
        // otherwise you must create a new one.
        if (idOfRoom === '') {
            const newTemporaryRoom = {
                id: 'temporary',
                name: 'Room\'s name',
                description: 'One To One chat',
                type: 'one-to-one-chat',
                members: usersOfRoom,
                state: 'temporary',
                latestMessage: '',
                isSeenBy: [],
                fromOthers_BgColor: '',
                fromMe_BgColor: '',
                createdAt: '',
                lastActiveAt: ''
            };
            dispatch(setTemporaryRoom(newTemporaryRoom));

            // Select the last created chat room.
            dispatch(setRoomIDWillBeSelected(newTemporaryRoom.id));
            // Reset some states:
            handleBlurSearchBox();
        } else {
            // Select chat room.
            dispatch(setRoomIDWillBeSelected(idOfRoom));
            // Reset some states:
            handleBlurSearchBox();
        }
    };


    // Hooks:
    const paramsToGetRooms = useMemo(() => {
        const uid = (user === null) ? '' : user.uid;
        return {
            userID: uid,
            limit: 50
        };
    }, [user]);
    // (GET REALTIME UPDATES) Get all rooms that the user is a member of:
    const chatRooms = useRooms('rooms', paramsToGetRooms);


    // Side effects:
    useEffect(() => {
        // Get all rooms that the user is a member of:
        if (chatRooms.length > 0) {
            dispatch(setRoomList(chatRooms));
        } else {
            dispatch(resetRoomsStatesToInitial())
        }
    }, [dispatch, chatRooms]);

    useEffect(() => {
        // Check if there are some updates with the selected room:
        if (selectedChatRoomID !== '') {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === selectedChatRoomID) {
                    fetchUserListByUidList(rooms[i].members)
                        .then((users) => {
                            dispatch(setselectedChatRoomUsers(users));
                        });
                    break;
                }
            }
        }
    }, [dispatch, rooms, selectedChatRoomID]);

    useEffect(() => {
        // If user selects new room using setRoomIDWillBeSelected(), run these code below:
        if (roomIDWillBeSelected !== '') {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === roomIDWillBeSelected) {
                    getUsersByUids(rooms[i].id, rooms[i].members);
                    dispatch(setRoomIDWillBeSelected(''));
                    break;
                }
            }
        }
    }, [dispatch, rooms, roomIDWillBeSelected, handleClickChatRoom, getUsersByUids]);


    // Component:
    const renderNonEmptySearchResult = () => {
        return (
            <div className='results-wrapper'>
                <div className='results nonempty'>
                    {
                        searchResultList.map((listItem, index) => {
                            return (
                                <div
                                    className='results__item'
                                    key={`search-result-${listItem.uid}`}
                                    onClick={() => goToChatRoomWith(listItem)}
                                    style={{ '--order': index }}
                                >
                                    <div className='object'>
                                        <div className='object__img-wrapper'>
                                            {listItem.photoURL ? (
                                                <img className='object-img' src={listItem.photoURL} alt='' ></img>
                                            ) : (
                                                <div className='object-character-name'>
                                                    <span>{listItem.displayName?.charAt(0)?.toUpperCase()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className='object__info-wrapper'>
                                            <div className='object-title'>{listItem.displayName}</div>
                                            <div className='object-more-info'>{listItem.email}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    };

    const renderSearchResultOnLoading = () => {
        return (
            <div className='results-wrapper'>
                <div className='results skeleton-loading'>
                    <div className='results__item sample'>
                        <div className='object'>
                            <div className='object__img-wrapper'>
                                <div className='object-character-name'>
                                    <span>U</span>
                                </div>
                            </div>
                            <div className='object__info-wrapper'>
                                <div className='object-title'>Name</div>
                                <div className='object-more-info'>More info</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEmptySearchResult = () => {
        return (
            <div className='results-wrapper'>
                <div className='results empty'>
                    <div className='empty-search-result'>
                        <div className='empty-search-result__msg'>Không tìm thấy kết quả tương ứng!</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEmptyFriendList = () => {
        return (
            <div className='results-wrapper'>
                <div className='results empty'>
                    <div className='empty-search-result'>
                        <div className='empty-search-result__msg'>Bạn chưa có người liên hệ nào!</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSearchResult = () => {
        if (friends?.length === 0) {
            return renderEmptyFriendList();
        } else {
            if (stateForSearching === 'fetching') {
                return renderSearchResultOnLoading();
            } else if (stateForSearching === 'empty-search-result') {
                return renderEmptySearchResult();
            } else if (stateForSearching === 'none') {
                return renderNonEmptySearchResult();
            } else {
                return (<></>);
            }
        }
    };

    return (
        <div className='chatmenu'>
            <div className='chatmenu__header'>
                <div className='chatmenu__actions'>
                    <div className='title'>Chats</div>

                    <div className='action-list'>
                        <div className='action-item action-button more-options-btn'>
                            <FontAwesomeIcon className='action-button__icon more-options-icon' icon={faEllipsisH} />
                        </div>
                        <div
                            className='action-item action-button add-room-btn'
                            onClick={() => setIsModalSearchUserVisible(!isModalSearchUserVisible)}
                        >
                            <div className="tooltip">
                                <FontAwesomeIcon className='action-button__icon add-room-icon' icon={faUserPlus} />
                                <span className="tooltip__text">Thêm bạn</span>
                            </div>
                        </div>
                        <div
                            className='action-item action-button add-group-chat-btn'
                            onClick={() => setisModalAddGroupVisible(!isModalAddGroupVisible)}
                        >
                            <div className="tooltip">
                                <FontAwesomeIcon className='action-button__icon add-group-chat-icon' icon={faUsers} />
                                <span className="tooltip__text">Tạo nhóm chat</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='chatmenu__search'>
                    <div className='navbar-wrapper'>
                        <div className='navbar'>
                            {
                                isSearchBoxInputFocused === true ? (
                                    <div className='go-back-btn' onClick={handleBlurSearchBox}>
                                        <FontAwesomeIcon className='go-back-btn__icon' icon={faArrowLeft} />
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                            <div className='search-box-wrapper'>
                                <div className='search-box'>
                                    <FontAwesomeIcon className='search-box__icon' icon={faSearch} />
                                    <input
                                        className='search-box__input'
                                        type='text'
                                        placeholder='Tìm trong danh bạ'
                                        onFocus={(e) => handleFocusSearchBox(e)}
                                        onChange={(e) => handleSearchInputChange(e)}
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`search-results-wrapper${isSearchBoxInputFocused === true ? ' visible' : ''}`}>
                        <div className='search-results-panel'>
                            <div className='search-results'>
                                {renderSearchResult()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='chatmenu__chatlist'>
                <div className='chatlist-wrapper'>
                    <div className='chatlist'>
                        {
                            rooms.map((element, index) => {
                                return (
                                    <div
                                        className={`chatlist__item${selectedChatRoomID === element.id ? ' active' : ''}`}
                                        key={`chatRoom-${index}`}
                                        onClick={() => handleClickChatRoom(element.id)}
                                    >
                                        <ChatMenuItem
                                            membersOfARoom={element.members}
                                            roomType={element.type}
                                            title={element.name}
                                            content={element.latestMessage ? element.latestMessage : '(Không có tin nhắn)'}
                                            isSeenBy={element.isSeenBy ? element.isSeenBy : []}
                                        ></ChatMenuItem>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatMenu;