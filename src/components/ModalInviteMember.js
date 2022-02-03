import React, { useEffect } from 'react';
import { Form, Modal, Select, Spin, Avatar } from 'antd';
import debounce from 'lodash/debounce';

// Firebase:
import { db, doc, updateDoc } from '../firebase/config';

// Redux:
import { useSelector } from 'react-redux';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// Services:
import { fetchUserListByUserEmail, fetchUserListByUserName } from '../firebase/queryUsers';
import { updateNotificationVisibleToUsers } from '../firebase/queryNotifications';

// CSS:
import '../styles/scss/components/ModalInviteMember.scss';


const { Option } = Select;

function DebounceSelect({ debounceTimeout = 500, ...props }) {
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
            const regexForEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (regexForEmail.test(value) === true) {
                fetchUserListByUserEmail(value, props.custom_attr.membersAlreadyInRoom, 1)
                    .then((newOptions) => {
                        if (fetchId !== fetchRef.current) {
                            // for fetch callback order
                            return;
                        }
                        setOptions(newOptions);
                        setFetching(false);
                    });
            } else {
                fetchUserListByUserName(value, props.custom_attr.membersAlreadyInRoom)
                    .then((newOptions) => {
                        if (fetchId !== fetchRef.current) {
                            // for fetch callback order
                            return;
                        }
                        setOptions(newOptions);
                        setFetching(false);
                    });
            }
        };
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, props.custom_attr.membersAlreadyInRoom]);

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
                options.map((element) => {
                    return (
                        <Option key={`uid-${element.uid}`} title={`${element.displayName}`} value={`${element.uid}`}>
                            <Avatar src={element.photoURL} shape='circle' draggable={false} style={{ marginRight: '10px' }}>
                                {element.photoURL ? '' : element.displayName?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <span>{`${element.displayName}`}</span>
                        </Option>
                    );
                })
            }
        </Select>
    );
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
                })
                    .then((res) => {
                        updateNotificationVisibleToUsers(rooms[indexOfRoom].id, [...value.map((val) => val)]);
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
                        placeholder="Nhập tên, email của người dùng"
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