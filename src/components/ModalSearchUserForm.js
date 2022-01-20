import React, { useRef, useState } from 'react';

// Components:
import ModalSearchUserFormPage1 from './ModalSearchUserFormPage1';
import ModalSearchUserFormPage2 from './ModalSearchUserFormPage2';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// Services:
import { fetchUserListByUserEmail, fetchUserListByUserName } from '../firebase/queryUsers';

// CSS:
import '../styles/scss/components/ModalSearchUserForm.scss';


function ModalSearchUserForm(props) {
    const timeout = useRef(null);


    // Context:
    const { isModalSearchUserVisible, setIsModalSearchUserVisible } = React.useContext(ModalControlContext);


    // State:
    const [idOfFormToBeDisplayed, setIdOfFormToBeDisplayed] = useState(1);
    const [userSearchResultList, setUserSearchResultList] = useState([]);
    const [userSearchResultSelected, setUserSearchResultSelected] = useState(null);
    const [stateForSearching, setStateForSearching] = useState('none'); // Value: none, fetching, empty-search-result.


    // Methods:
    const handleInputKeywordChange = (e) => {
        // We must clearTimeout to prevent autocomplete on submitting many requests when fetching API:
        clearTimeout(timeout.current);

        // Handle search:
        if (e.target.value) {
            // Validate email address:
            const regexForEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Data is being fetched or not:
            setStateForSearching('fetching');
            // Clear options:
            setUserSearchResultList([]);
            // Fetch API:
            let keywordToSearchFor = e.target.value;
            if (regexForEmail.test(keywordToSearchFor) === true) {
                timeout.current = setTimeout(() => {
                    fetchUserListByUserEmail(keywordToSearchFor, [], 1)
                        .then((newOptions) => {
                            setUserSearchResultList(newOptions);
                            if (newOptions.length === 0) {
                                setStateForSearching('empty-search-result');
                            } else {
                                setStateForSearching('none');
                            }
                        });
                }, 500);
            } else {
                timeout.current = setTimeout(() => {
                    fetchUserListByUserName(keywordToSearchFor, [], 20)
                        .then((newOptions) => {
                            setUserSearchResultList(newOptions);
                            if (newOptions.length === 0) {
                                setStateForSearching('empty-search-result');
                            } else {
                                setStateForSearching('none');
                            }
                        });
                }, 500);
            }
        } else {
            setStateForSearching('none');
        }
    }

    const hanldeSelectUserToViewQuickProfile = (uid) => {
        setUserSearchResultSelected(uid);
        setIdOfFormToBeDisplayed(2);
    }

    const hanldeGoBackToUserSearchResultList = () => {
        setUserSearchResultSelected(null);
        setIdOfFormToBeDisplayed(1);
    }


    // Side effects:
    // useEffect(() => {
    // }, []);


    // Component:
    return (
        <>
            <div
                className={`overlay${isModalSearchUserVisible ? ' visible' : ''}`}
                onClick={() => setIsModalSearchUserVisible(!isModalSearchUserVisible)}
            ></div>

            <div
                className={`modal-search-user-form${isModalSearchUserVisible ? ' visible' : ''}`}
            >
                <div className='modal-content-wrapper'>
                    <div className={`user-search-form-wrapper form-${idOfFormToBeDisplayed}`}>

                        {/* First form (page 1): */}
                        <ModalSearchUserFormPage1
                            userSearchResultList={userSearchResultList}
                            handleInputKeywordChange={handleInputKeywordChange}
                            hanldeSelectUserToViewQuickProfile={hanldeSelectUserToViewQuickProfile}
                            stateForSearching={stateForSearching}
                        ></ModalSearchUserFormPage1>

                        {/* Second form (page 2): */}
                        <ModalSearchUserFormPage2
                            userSearchResultList={userSearchResultList}
                            userSearchResultSelected={userSearchResultSelected}
                            isModalSearchUserVisible={isModalSearchUserVisible}
                            setIsModalSearchUserVisible={setIsModalSearchUserVisible}
                            hanldeGoBackToUserSearchResultList={hanldeGoBackToUserSearchResultList}
                        ></ModalSearchUserFormPage2>
                    </div>
                </div>

            </ div>
        </>
    );

}

export default ModalSearchUserForm;