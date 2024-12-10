import { Form, Input, message, Modal } from 'antd'
import { useApp } from '../wrapper/AppProvider'
import { createRoomService } from '../../firebase/service/room.service';
import { useAuth } from '../wrapper/AuthProvider';

export default function AddRoomModal() {
    const { isOpenModal, setIsOpenModal } = useApp()
    const [form] = Form.useForm()
    const { user } = useAuth()

    const handleOk = async () => {
        try {
            const formData = form.getFieldValue();

            // Validate fields
            if (!formData.name || !formData.description) {
                message.error('Tên phòng và mô tả không được để trống.');
                return;
            }

            // Prepare data for creating a room
            const roomData = {
                name: formData.name,
                description: formData.description,
                members: [user?.uid],
            };

            // Call the service to create the room
            await createRoomService(roomData, 'rooms');

            message.success('Phòng đã được tạo thành công!');
            setIsOpenModal(false);
            form.resetFields(); // Clear form fields
        } catch (error) {
            console.error('Error creating room:', error.message);
            message.error('Đã xảy ra lỗi khi tạo phòng. Vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setIsOpenModal(false)
        form.resetFields()
    }

    return (
        <Modal
            title='Tạo phòng'
            open={isOpenModal}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout='vertical'>
                <Form.Item label='Tên phòng' name='name'>
                    <Input placeholder='Nhập tên phòng' />
                </Form.Item>
                <Form.Item label='Mô tả' name='description'>
                    <Input.TextArea placeholder='Nhập mô tả' />
                </Form.Item>
            </Form>
        </Modal>
    )
}
