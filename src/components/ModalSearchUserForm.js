import React from 'react';
import { Modal } from 'antd';


function ModalSearchUserForm({ visible, setVisible }) {
    return (
        <div className='modal-search-user-form'>
            <Modal
                title="Modal 1000px width"
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={500}
            >
                <p>some contents...</p>
                <p>some contents...</p>
                <p>some contents...</p>
            </Modal>
        </div>
    );

}

export default ModalSearchUserForm;