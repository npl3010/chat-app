import React from 'react';


function ModalSearchUserFormPage1(props) {
    const {
        userSearchResultList,
        handleInputKeywordChange,
        hanldeSelectUserToViewQuickProfile,
        stateForSearching
    } = props;


    // Component:
    const renderUserList = () => {
        return (
            <div className='userlist'>
                {
                    userSearchResultList.map((userListItem, index) => {
                        return (
                            <div
                                className='userlist__item'
                                key={`user-${userListItem.uid}`}
                                onClick={() => hanldeSelectUserToViewQuickProfile(userListItem.uid)}
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
                                        <div className='user-more-info'>{userListItem.email}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    const renderUserListOnLoading = () => {
        return (
            <div className='userlist skeleton-loading'>
                <div
                    className='userlist__item'
                >
                    <div className='user'>
                        <div className='user__person-img'>
                            <div className='person-img'></div>
                        </div>
                        <div className='user__info'>
                            <div className='user-title'>User's name</div>
                            <div className='user-more-info'>User's email</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderSearchResult = () => {
        if (stateForSearching === 'fetching') {
            return renderUserListOnLoading();
        } else if (stateForSearching === 'empty-search-result') {
            return <>Empty</>;
        } else if (stateForSearching === 'none') {
            return renderUserList();
        } else {
            return (<></>);
        }
    };

    return (
        <>
            <div className='user-search-form'>
                <div className='user-search-form__search-box-wrapper'>
                    <span className='title'>Đến:</span>
                    <input
                        type='text'
                        id='keywordToSearchFor'
                        name='keyword'
                        placeholder='Nhập tên, email của người dùng'
                        onChange={(e) => handleInputKeywordChange(e)}
                        autoFocus
                    ></input>
                </div>

                <div className='user-search-form__userlist'>
                    <div className='userlist-wrapper'>
                        {renderSearchResult()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalSearchUserFormPage1;