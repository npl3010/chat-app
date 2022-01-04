import React from 'react';
import { Form, Modal, Select, Spin, Avatar } from 'antd';
import debounce from 'lodash/debounce';

// Redux:
// import { useSelector } from 'react-redux';

// Context:
import { ModalControlContext } from '../context/ModalControlProvider';

// CSS:
import '../styles/scss/components/ModalInviteChat.scss';


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
            fetchOptions(value)
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
    }, [fetchOptions, debounceTimeout]);

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
                        <Option key={`user-${element.value}`} label={`${element.label}`} value={`${element.value}`}>
                            <Avatar src={element.photoURL} shape='circle' draggable={false}>
                                {element.photoURL ? '' : element.label?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            {`${element.label}`}
                        </Option>
                    );
                })
            }
        </Select>
    );
}


async function fetchUserList(username) {
    return fetch('https://randomuser.me/api/?results=5')
        .then((response) => response.json())
        .then((body) => {
            return body.results.map((user) => ({
                label: `${user.name.first} ${user.name.last}`,
                value: user.login.username,
                photoURL: user.picture.thumbnail,
            }));
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
    // const user = useSelector((state) => state.userAuth.user);


    // Methods:
    const handleOk = () => {
        // Get form data and insert it to database:
        // const formData = form.getFieldsValue();
        // addDocument('rooms', {
        //     name: formData.groupChatName,
        //     description: 'Group chat',
        //     type: 'group-chat',
        //     members: [user.uid]
        // });

        // Clear form:
        form.resetFields();

        // Hide form:
        setisModalInviteVisible(false);
    };

    const handleCancel = () => {
        // Clear form:
        form.resetFields();

        // Hide form:  
        setisModalInviteVisible(false);
    };


    // Component:
    return (
        <>
            {/* <div className='modal-invite-member'>
            </div> */}

            <Modal
                title="Thêm thành viên"
                centered
                visible={isModalInviteVisible}
                onOk={() => handleOk()}
                onCancel={() => handleCancel()}
                okText='Thêm'
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
                    <DebounceSelect
                        mode="multiple"
                        value={value}
                        placeholder="Nhập người dùng"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        style={{
                            width: '100%',
                        }}
                    />
                </Form>
            </Modal>
        </>
    );
}

export default ModalInviteMember;