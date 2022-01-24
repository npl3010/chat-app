import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faUserPlus, faUsers, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { selectRoom, selectTemporaryChatRoom, setIsLoadingARoom, setRoomList } from '../features/manageRooms/manageRoomsSlice';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// Custom hooks:
import useRooms from '../customHooks/useRooms';

// Services:
import { fetchUserListByUidList } from '../firebase/queryUsers';
import { fetchFriendListByUserName } from '../firebase/queryFriends';

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
    const { rooms, selectedChatRoomID } = useSelector((state) => state.manageRooms);
    const dispatch = useDispatch();


    // State:
    const [isSearchBoxInputFocused, setIsSearchBoxInputFocused] = useState(false);
    const [searchResultList, setSearchResultList] = useState([]);
    const [stateForSearching, setStateForSearching] = useState('none'); // Value: none, fetching, empty-search-result.


    // Methods:
    const handleClickChatRoom = (roomID) => {
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
                dispatch(selectRoom({
                    roomID: roomID,
                    users: users
                }));
                dispatch(setIsLoadingARoom(false));
            });
    }

    const handleFocusSearchBox = () => {
        setIsSearchBoxInputFocused(true);
    }

    const handleBlurSearchBox = () => {
        setIsSearchBoxInputFocused(false);
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
                    .then((newOptions) => {
                        setSearchResultList(newOptions);
                        if (newOptions.length === 0) {
                            setStateForSearching('empty-search-result');
                        } else {
                            setStateForSearching('none');
                        }
                    });
            }, 500);
        } else {
            setStateForSearching('none');
        }
    }

    const createTemporaryChatRoom = (userData) => {
        const payload = {
            users: [{
                ...userData,
                createdAt: (userData.createdAt) && (userData.createdAt.toDate().toString())
            }]
        }
        dispatch(selectTemporaryChatRoom(payload));
    }


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
            const action = setRoomList(chatRooms);
            dispatch(action);
        }
    }, [dispatch, chatRooms]);


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
                                    onClick={() => createTemporaryChatRoom(listItem)}
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
                    <div className='results__item'>
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

    const renderSearchResult = () => {
        if (stateForSearching === 'fetching') {
            return renderSearchResultOnLoading();
        } else if (stateForSearching === 'empty-search-result') {
            return renderEmptySearchResult();
        } else if (stateForSearching === 'none') {
            return renderNonEmptySearchResult();
        } else {
            return (<></>);
        }
    };

    return (
        <div className='chatmenu'>
            <div className='chatmenu__header'>
                <div className='chatmenu__actions'>
                    <div className='title'>Chat</div>

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
                                        placeholder='Tìm bạn để chat'
                                        onFocus={handleFocusSearchBox}
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
                                        <div className='chatbox'>
                                            <div className='chatbox__person-img'>
                                                <img className='person-img' src='' alt='' ></img>
                                            </div>
                                            <div className='chatbox__info'>
                                                <div className='chatbox-title'>{element.name}</div>
                                                <div className='chatbox-latest-message'>Tin nhắn mới nhất nè!</div>
                                            </div>
                                        </div>
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