import React from 'react';
import { Input, Select } from 'antd';

// CSS:
import '../styles/scss/components/ModalSearchUserForm.scss';


const { Option } = Select;

function ModalSearchUserForm({ isModalSearchVisible, setIsModalSearchVisible }) {


    const selectBefore = (
        <Select defaultValue="user-name" className="select-before">
            <Option value="user-name">Tên</Option>
            <Option value="user-email">Email</Option>
        </Select>
    );


    return (
        <>
            <div
                className={`overlay${isModalSearchVisible ? ' visible' : ''}`}
                onClick={() => setIsModalSearchVisible(!isModalSearchVisible)}
            ></div>

            <div
                className={`modal-search-user-form${isModalSearchVisible ? ' visible' : ''}`}
            >

                <div className='modal-search-user-form__search-box-wrapper'>
                    <span className='title'>Đến:</span>
                    <Input addonBefore={selectBefore} />
                </div>

                <div className='modal-search-user-form__userlist'>
                    <div className='userlist-wrapper'>
                        <div className='userlist'>
                            <div className='userlist__item' key={`user-1`}>
                                <div className='user'>
                                    <div className='user__person-img'>
                                        <img className='person-img' src='' alt='' ></img>
                                    </div>
                                    <div className='user__info'>
                                        <div className='user-title'>Username</div>
                                        <div className='user-more-info'>Tin nhắn mới nhất nè!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ div>
        </>
    );

}

export default ModalSearchUserForm;