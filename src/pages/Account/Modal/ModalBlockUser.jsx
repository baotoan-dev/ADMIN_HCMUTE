import React, { useEffect } from 'react';
import { Input, Modal } from 'antd';
import axios from 'axios';
import { Select, Space } from 'antd';
import { toast } from 'react-toastify';
import { API_CONSTANT_V3 } from 'constant/urlServer';

const BlockUser = ({
    isActive,
    setIsActive,
    userId
}) => {
    const REASON = 'Other'
    const [dataReasonBlock, setDataReasonBlock] = React.useState([]);
    const [checkReasonBlock, setCheckReasonBlock] = React.useState(null);
    const [otherReason, setOtherReason] = React.useState('');
    const [reasonId, setReasonId] = React.useState(null);
    useEffect(() => {
        fetchDataResonBlock();
    }, [])
    // create fake data from option
    const fetchDataResonBlock = async () => {
        try {
            const res = await axios.get(`${API_CONSTANT_V3}/v3/block-reasons?type=1`)

            if (res && res.data.statusCode === 200) {
                setDataReasonBlock(res.data.data);
            }
        } catch (error) {
            throw error;
        }
    }

    const postBlockUser = async () => {
        const data = {
            user_Id: userId,
            reasonId: reasonId,
            status: 0
        }

        if (checkReasonBlock) {
            data.description = otherReason;
        }
        try {
            const res = await axios.post('`${API_CONSTANT_V3}/v3/users/block', data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('access-token')
                    }
                }
            )

            if (res && res.data.statusCode === 200) {
                toast.success('Khóa tài khoản thành công');
            }

            setIsActive(false);
        } catch (error) {
            throw error;
        }
    }

    const option = dataReasonBlock.map((item) => {
        return {
            label: item.reason,
            value: item.id,
        }
    })

    const onOk = async () => {
        // Call API to block user
        if (reasonId) {
            postBlockUser();
        }
        else {
            alert('Vui lòng chọn lý do khóa tài khoản');
        }
    }

    const onCancel = () => {
        // Close modal
        setIsActive(false)
    }

    const changeReason = (value) => {
        setReasonId(value.value);
        if (value.label === REASON) {
            // Show input other reason
            setCheckReasonBlock(true);
        }
        else {
            setCheckReasonBlock(false);
        }
    }
    return (
        <Modal
            title="Khóa tài khoản"
            visible={isActive}
            onOk={() => { onOk() }}
            onCancel={() => { onCancel() }}
            okText="Khóa"
            cancelText="Hủy"
        >

            <Select
                style={{ width: '100%' }}
                placeholder="Chọn lý do khóa"
                onChange={
                    (value, label) => {
                        changeReason(label);
                    }
                }
                options={option}
            />

            {
                checkReasonBlock && (
                    <Space direction="vertical" style={{
                        width: '100%',
                        marginTop: '1rem'
                    }}>
                        <label>Lý do khác</label>
                        <Input type="text"
                            placeholder="Nhập lý do khác"
                            style={{ width: '100%' }}
                            onChange={(e) => {
                                setOtherReason(e.target.value)
                            }}
                        />
                    </Space>
                )
            }
            {
                (checkReasonBlock && !otherReason) && (
                    <p style={{
                        color: 'red',
                        marginTop: '1rem'
                    }}>
                        Vui lòng nhập lý do khác
                    </p>
                )
            }
        </Modal>
    );
}

export default BlockUser;