import React from 'react';
import { Form, Input, Modal } from 'antd';

// Redux:
import { useSelector } from 'react-redux';

// CSS:
import '../styles/scss/components/ModalAddGroupChat.scss';

// Services:
import { addDocument } from '../firebase/services';


function ModalAddGroupChat({ isModalAddGroupVisible, setisModalAddGroupVisible, setSelectedChatRoom }) {
    // Hooks:
    const [form] = Form.useForm();


    // Redux:
    const user = useSelector((state) => state.userAuth.user);


    // Methods:
    const handleOk = () => {
        // Get form data and insert it to database:
        const formData = form.getFieldsValue();
        addDocument('rooms', {
            name: formData.groupChatName,
            description: 'Group chat',
            type: 'group-chat',
            members: [user.uid]
        });

        // Clear form:
        form.resetFields();

        // Hide form:
        setisModalAddGroupVisible(false);

        // Select the last created chat room:
        setSelectedChatRoom(0);
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