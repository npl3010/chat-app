import React from 'react';
import { Form, Input, Modal } from 'antd';

// Redux:
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChatRoom } from '../features/manageRooms/manageRoomsSlice';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// CSS:
import '../styles/scss/components/ModalAddGroupChat.scss';

// Services:
import { addDocument } from '../firebase/services';


function ModalAddGroupChat(props) {
    // Hooks:
    const [form] = Form.useForm();


    // Context:
    const { isModalAddGroupVisible, setisModalAddGroupVisible } = React.useContext(ModalControlContext);


    // Redux:
    const user = useSelector((state) => state.userAuth.user);
    const dispatch = useDispatch();


    // Methods:
    const handleOk = () => {
        // Get form data and insert it to database:
        const formData = form.getFieldsValue();
        addDocument('rooms', {
            name: formData.groupChatName,
            description: 'Group chat',
            type: 'group-chat',
            members: [user.uid],
            membersAddedBy: [user.uid],
            membersRole: ['group-admin'],
            latestMessage: ''
        });

        // Clear form:
        form.resetFields();

        // Hide form:
        setisModalAddGroupVisible(false);

        // Select the last created chat room:
        const action = setSelectedChatRoom(0);
        dispatch(action);
    };

    const handleCancel = () => {
        // Clear form:
        form.resetFields();

        // Hide form:  
        setisModalAddGroupVisible(false);
    };


    // Component:
    return (
        <>
            {/* <div className='modal-add-group-chat'>
            </div> */}

            <Modal
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
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item label="Tên nhóm" name="groupChatName">
                        <Input placeholder='Nhập tên nhóm' />
                    </Form.Item>

                    <Form.Item label="Thành viên" name="users">
                        <Input placeholder='Nhập tên, email' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ModalAddGroupChat;