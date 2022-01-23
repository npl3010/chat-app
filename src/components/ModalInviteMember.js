import React, { useEffect } from 'react';
import { Form, Modal, Select, Spin, Avatar } from 'antd';
import debounce from 'lodash/debounce';

// Firebase:
import { db, doc, getDocs, updateDoc, collection, query, where, orderBy, limit } from '../firebase/config';

// Redux:
import { useSelector } from 'react-redux';

// Services:
import { toPascalCaseForAllWords } from '../firebase/services';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// CSS:
import '../styles/scss/components/ModalInviteMember.scss';


const { Option } = Select;

function DebounceSelect({ fetchOptions, debounceTimeout = 500, ...props }) {
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchRef = React.useRef(0);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            // Clear options:
            setOptions([]);
            // Data is being fetched or not:
            setFetching(true);
            // Fetch API using the callback which is passed to this component:
            fetchOptions(value, props.custom_attr.membersAlreadyInRoom)
                .then((newOptions) => {
                    if (fetchId !== fetchRef.current) {
                        // for fetch callback order
                        return;
                    }
                    setOptions(newOptions);
                    setFetching(false);
                });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout, props.custom_attr.membersAlreadyInRoom]);

    useEffect(() => {
        return () => {
            // Clear form when unmount:
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue={false}
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            // options={options}
            {...props}
        >
            {
                // Variable: options = [{ label: '', value: '', photoURL: '' }, ...];
                options.map((element) => {
                    return (
                        <Option key={`uid-${element.value}`} title={`${element.label}`} value={`${element.value}`}>
                            <Avatar src={element.photoURL} shape='circle' draggable={false} style={{ marginRight: '10px' }}>
                                {element.photoURL ? '' : element.label?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <span>{`${element.label}`}</span>
                        </Option>
                    );
                })
            }
        </Select>
    );
}


async function fetchUserList(username = '', membersAlreadyInRoom = []) {
    /**
     * 
     * @param {string} username This is a keyword to search for. 
     * @param {array} membersAlreadyInRoom The list of users who are already existed in this room,
     * we need to hide these users in Select options.
     * @returns 
     */

    // Get all documents in a collection from Firestore:
    const capitalizedUsername = toPascalCaseForAllWords(username);

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

    return results.filter((element) => {
        return !membersAlreadyInRoom.includes(element.value);
    });
}


function ModalInviteMember(props) {
    // State:
    const [value, setValue] = React.useState([]);


    // Hooks:
    const [form] = Form.useForm();


    // Context:
    const { isModalInviteVisible, setisModalInviteVisible } = React.useContext(ModalControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const { rooms, selectedChatRoomID } = useSelector((state) => state.manageRooms);


    // Methods:
    const handleOk = async () => {
        if (selectedChatRoomID !== '' && rooms.length > 0) {
            // Get index of selected room:
            let indexOfRoom = -1;
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === selectedChatRoomID) {
                    indexOfRoom = i;
                    break;
                }
            }

            if (indexOfRoom !== -1) {
                // Update member list in the current room:
                const roomRef = doc(db, "rooms", rooms[indexOfRoom].id);

                // Set the "members" field of the selected room:
                const newMemberList = [...rooms[indexOfRoom].members, ...value.map((val) => val)];
                const newMembersAddedBy = [...rooms[indexOfRoom].membersAddedBy, ...value.map(() => (user.uid))];
                const newmembersRole = [...rooms[indexOfRoom].membersRole, ...value.map(() => ('group-member'))];

                await updateDoc(roomRef, {
                    members: newMemberList,
                    membersAddedBy: newMembersAddedBy,
                    membersRole: newmembersRole
                });

                // Clear form:
                form.resetFields();
                setValue([]);

                // Hide form:
                setisModalInviteVisible(false);
            }
        }
    };

    const handleCancel = () => {
        // Clear form:
        form.resetFields();

        // Hide form:  
        setisModalInviteVisible(false);
    };

    const getMemberAlreadyInRoom = () => {
        if (selectedChatRoomID !== '' && rooms.length > 0) {
            // Get index of selected room:
            let indexOfRoom = -1;
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].id === selectedChatRoomID) {
                    indexOfRoom = i;
                    break;
                }
            }

            // Return room members:
            if (indexOfRoom !== -1) {
                return { membersAlreadyInRoom: rooms[indexOfRoom].members };
            } else {
                return { membersAlreadyInRoom: [] };
            }
        } else {
            return { membersAlreadyInRoom: [] };
        }
    }


    // Component:
    return (
        <>
            {/* <div className='modal-invite-member'>
            </div> */}

            <Modal
                className='antd-modal-invite-member'
                title="Thêm thành viên"
                centered
                visible={isModalInviteVisible}
                onOk={handleOk}
                onCancel={() => handleCancel()}
                okText='Thêm'
                cancelText='Hủy'
            >
                <Form
                    className='antd-search-and-select-user-form'
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <DebounceSelect
                        mode="multiple"
                        value={value}
                        placeholder="Nhập tên người dùng"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        style={{
                            width: '100%',
                        }}
                        custom_attr={getMemberAlreadyInRoom()}
                    />
                </Form>
            </Modal>
        </>
    );
}

export default ModalInviteMember;