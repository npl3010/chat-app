import React, { useState } from 'react';


function ModalSearchUserFormPage1(props) {
    const {
        userSearchResultList,
        handleInputKeywordChange,
        hanldeSelectUserToViewQuickProfile,
        stateForSearching
    } = props;


    // State:
    const [isSearchFieldFocused, setIsSearchFieldFocused] = useState(false);


    // Methods:
    const handleFocusSearchField = () => {
        setIsSearchFieldFocused(true);
    }

    const handleBlurSearchField = () => {
        setIsSearchFieldFocused(false);
    }


    // Component:
    const renderNonEmptyUserList = () => {
        return (
            <div className='userlist-wrapper'>
                <div className='userlist nonempty'>
                    {
                        userSearchResultList.map((userListItem, index) => {
                            return (
                                <div
                                    className='userlist__item'
                                    key={`user-${userListItem.uid}`}
                                    onClick={() => hanldeSelectUserToViewQuickProfile(userListItem.uid)}
                                    style={{ '--order': index }}
                                >
                                    <div className='user'>
                                        <div className='user__person-img'>
                                            {userListItem.photoURL ? (
                                                <img className='person-img' src={userListItem.photoURL} alt='' ></img>
                                            ) : (
                                                <div className='person-character-name'>
                                                    <span>{userListItem.displayName?.charAt(0)?.toUpperCase()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className='user__info'>
                                            <div className='user-title'>{userListItem.displayName}</div>
                                            {/* <div className='user-more-info'>{userListItem.email}</div> */}
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

    const renderUserListOnLoading = () => {
        return (
            <div className='userlist-wrapper'>
                <div className='userlist skeleton-loading'>
                    <div
                        className='userlist__item sample'
                    >
                        <div className='user'>
                            <div className='user__person-img'>
                                <div className='person-img'></div>
                            </div>
                            <div className='user__info'>
                                <div className='user-title'>Name</div>
                                <div className='user-more-info'>More info</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEmptyUserList = () => {
        return (
            <div className='userlist-wrapper'>
                <div className='userlist empty'>
                    <div className='empty-search-result'>
                        <div className='empty-search-result__msg'>Không tìm thấy kết quả tương ứng!</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSearchResult = () => {
        if (stateForSearching === 'fetching') {
            return renderUserListOnLoading();
        } else if (stateForSearching === 'empty-search-result') {
            return renderEmptyUserList();
        } else if (stateForSearching === 'none') {
            return renderNonEmptyUserList();
        } else {
            return (<></>);
        }
    };

    return (
        <>
            <div className='user-search-form'>
                <div className='user-search-form__search-box-wrapper'>
                    <span className='title'>Đến:</span>
                    <div className={`search-field-wrapper${isSearchFieldFocused === true ? ' focused' : ''}`}>
                        <input
                            type='text'
                            className='search-field'
                            id='keywordToSearchFor'
                            name='keyword'
                            placeholder='Nhập tên, email của người dùng'
                            onChange={(e) => handleInputKeywordChange(e)}
                            onFocus={handleFocusSearchField}
                            onBlur={handleBlurSearchField}
                            autoFocus
                        ></input>
                    </div>
                </div>

                <div className='user-search-form__userlist'>
                    {renderSearchResult()}
                </div>
            </div>
        </>
    );
}

export default ModalSearchUserFormPage1;