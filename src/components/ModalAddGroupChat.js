import React, { useRef, useState } from 'react';
import { Avatar, Form, Input, Modal, Select, Spin } from 'antd';

// Firebase:
import { db, getDocs, collection, query, where, orderBy, limit } from '../firebase/config';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChatRoom } from '../features/manageRooms/manageRoomsSlice';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// Services:
import { addDocument, capitalizeAllWords } from '../firebase/services';

// CSS:
import '../styles/scss/components/ModalAddGroupChat.scss';


const { Option } = Select;

async function fetchUserListByUserEmail(username = '', membersAlreadyInRoom = []) {
    /**
     * 
     * @param {string} username This is a keyword to search for. 
     * @param {array} membersAlreadyInRoom The list of users who are already existed in this room,
     * we need to hide these users in Select options.
     * @returns 
     */

    // Get all documents in a collection from Firestore:
    const q = query(collection(db, "users"),
        where("email", "==", username),
        orderBy("displayName"),
        limit(10)
    );

    const querySnapshot = await getDocs(q);

    let results = [];

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const resultItem = {
            label: `${docData.displayName}`,
            value: docData.uid,
            photoURL: docData.photoURL,
        }
        results.push(resultItem);
    });

    return results;
}

async function fetchUserListByUserName(username = '', membersAlreadyInRoom = []) {
    /**
     * 
     * @param {string} username This is a keyword to search for. 
     * @param {array} membersAlreadyInRoom The list of users who are already existed in this room,
     * we need to hide these users in Select options.
     * @returns 
     */

    // Get all documents in a collection from Firestore:
    const capitalizedUsername = capitalizeAllWords(username);

    const q = query(collection(db, "users"),
        where("displayNameSearchKeywords", "array-contains-any", [username, capitalizedUsername]),
        orderBy("displayName"),
        limit(10)
    );

    const querySnapshot = await getDocs(q);

    let results = [];

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const resultItem = {
            label: `${docData.displayName}`,
            value: docData.uid,
            photoURL: docData.photoURL,
        }
        results.push(resultItem);
    });

    return results;
}

function ModalAddGroupChat(props) {
    // Hooks:
    const [form] = Form.useForm();


    // Context:
    const { isModalAddGroupVisible, setisModalAddGroupVisible } = React.useContext(ModalControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const dispatch = useDispatch();


    // State:
    const [optionsData, setOptionsData] = useState([]);
    const [optionsSelected, setOptionsSelected] = useState([]);
    const [stateForSelectOnSearch, setStateForSelectOnSearch] = useState('none'); // Value: none, fetching, empty-search-result.
    const timeout = useRef(null);


    // Methods:
    const handleOk = () => {
        form.submit();

        // Get form data and insert it to database:
        const formData = form.getFieldsValue();
        if (formData.groupChatName) {
            addDocument('rooms', {
                name: formData.groupChatName,
                description: 'Group chat',
                type: 'group-chat',
                members: [user.uid, ...optionsSelected],
                membersAddedBy: [user.uid, ...optionsSelected.map(() => user.uid)],
                membersRole: ['group-admin', ...optionsSelected.map(() => 'group-member')],
                latestMessage: ''
            });

            // Clear form:
            form.resetFields();

            // Hide form:
            setisModalAddGroupVisible(false);

            // Select the last created chat room:
            const action = setSelectedChatRoom(0);
            dispatch(action);
        } else {
            return;
        }
    };

    const handleCancel = () => {
        // Clear form:
        form.resetFields();

        // Hide form:  
        setisModalAddGroupVisible(false);
    };

    const handleSearch = (searchKeyword) => {
        // Validate email address:
        const regexForEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // We must clearTimeout to prevent autocomplete on submitting many requests when fetching API:
        clearTimeout(timeout.current);
        // Handle search:
        if (searchKeyword) {
            // Data is being fetched or not:
            setStateForSelectOnSearch('fetching');
            // Clear options:
            setOptionsData([]);
            // Fetch API:
            if (regexForEmail.test(searchKeyword) === true) {
                timeout.current = setTimeout(() => {
                    fetchUserListByUserEmail(searchKeyword)
                        .then((newOptions) => {
                            setOptionsData(newOptions);
                            if (newOptions.length === 0) {
                                setStateForSelectOnSearch('empty-search-result');
                            } else {
                                setStateForSelectOnSearch('none');
                            }
                        });
                }, 500);
            } else {
                timeout.current = setTimeout(() => {
                    fetchUserListByUserName(searchKeyword)
                        .then((newOptions) => {
                            setOptionsData(newOptions);
                            if (newOptions.length === 0) {
                                setStateForSelectOnSearch('empty-search-result');
                            } else {
                                setStateForSelectOnSearch('none');
                            }
                        });
                }, 500);
            }
        } else {
            setStateForSelectOnSearch('none');
        }
    };

    const handleChange = (selectedOption) => {
        setOptionsSelected(selectedOption);
    };

    const renderMessageForNotFoundContent = () => {
        if (stateForSelectOnSearch === 'fetching') {
            return (
                <span className='loading-msg for-antd-modal-add-group-chat'>
                    <div className='spinner-wrapper'>
                        <Spin className='spinner' size="small" />
                    </div>
                    <span className='title for-searching'>Đang tìm kiếm...</span>
                </span>
            );
        } else if (stateForSelectOnSearch === 'empty-search-result') {
            return (
                <span className='loading-msg for-antd-modal-add-group-chat'>
                    <span className='title for-empty-search-result'>Không tìm thấy kết quả tương ứng!</span>
                </span>
            );
        } else {
            return null;
        }
    };


    // Component:
    return (
        <>
            {/* <div className='modal-add-group-chat'>
            </div> */}

            <Modal
                className='antd-modal-add-group-chat'
                title="Tạo nhóm chat"
                centered
                visible={isModalAddGroupVisible}
                onOk={() => handleOk()}
                onCancel={() => handleCancel()}
                okText='Tạo nhóm'
                cancelText='Hủy'
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout='horizontal'
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    {/* Fields: */}
                    <Form.Item
                        label="Tên nhóm" name="groupChatName"
                        rules={[
                            { required: true, message: 'You have to input your group name!' },
                            {
                                validator: (rule, value = '') => {
                                    if (value.length > 45) {
                                        // 1. Text length.
                                        return Promise.reject(new Error("Group name exceed 45 characters limit!"));
                                    } else if (value?.length !== 0 && value?.trim()?.length === 0) {
                                        // 2. Text contains only spaces:
                                        return Promise.reject(new Error("Group name is invalid with whitespaces!"));
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            }
                        ]}
                    >
                        <Input placeholder='Nhập tên nhóm' />
                    </Form.Item>

                    {/* Search with select options: */}
                    <Form.Item
                        label="Thành viên" name="groupMembers"
                        rules={[
                            { required: true, message: 'You have to input your group members!' },
                            {
                                validator: (rule, value = []) => {
                                    if (value.length > 100) {
                                        return Promise.reject(new Error("Number of members exceed a maximum of 100!"));
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            }
                        ]}
                    >
                        <Select
                            mode="multiple"
                            showSearch
                            value={optionsSelected}
                            onSearch={handleSearch}
                            onChange={handleChange}
                            placeholder={'Nhập tên, email của thành viên'}
                            labelInValue={false}
                            allowClear={true}
                            showArrow={true}
                            defaultActiveFirstOption={true}
                            filterOption={false}
                            notFoundContent={renderMessageForNotFoundContent()}
                            style={{ width: '100%' }}
                        >
                            {
                                optionsData.map((op, index) => {
                                    return (
                                        <Option value={op.value} key={`user-${op.value}`}>
                                            <Avatar src={op.photoURL} shape='circle' draggable={false} style={{ marginRight: '10px' }}>
                                                {op.photoURL ? '' : op.label?.charAt(0)?.toUpperCase()}
                                            </Avatar>
                                            <span>{op.label}</span>
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ModalAddGroupChat;