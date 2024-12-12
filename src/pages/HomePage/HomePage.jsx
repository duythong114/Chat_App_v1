import { Card, Avatar, Typography, Row, Col, Button, Upload, message } from "antd";
import { useAuth } from "../../components/wrapper/AuthProvider";
import { UploadOutlined } from "@ant-design/icons";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase/config';
import styled from "styled-components";
import imageCompression from "browser-image-compression";

const { Title, Text } = Typography;

const HomeWrapper = styled.div`
    background-color: #f0f2f5;
    height: calc(100vh - 24px);
    margin: 12px;
    border: 3px solid #f0f2f5;
    border-radius: 12px;
`;

const CardWrapper = styled(Card)`
    width: 500px;
    border: 3px solid #f0f2f5;

    @media (max-width: 1024px) {
        width: 400px;
    }

    @media (max-width: 768px) {
        width: 300px;
    }
`;

const AvatarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    border: 3px solid #f0f2f5;
    border-radius: 12px;
    padding: 20px;
`

const Label = styled(Text)`
    color: #1e90ff; /* Màu xanh nước biển */
    font-weight: bold;
`;

export default function HomePage() {
    const {
        user: { displayName, email, uid, photoURL, providerId },
        setUser,
    } = useAuth();

    const handleUpload = async (file) => {
        if (!file) {
            message.error("Vui lòng chọn một tệp.");
            return;
        }

        try {
            // Cài đặt thông số nén ảnh
            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };

            // Nén file
            const compressedFile = await imageCompression(file, options);

            // Chuyển file nén sang Base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64Image = reader.result;

                try {
                    // Cập nhật Base64 ảnh vào Firestore
                    const userDoc = doc(db, "users", uid);
                    await updateDoc(userDoc, { photoURL: base64Image });

                    // Cập nhật trạng thái người dùng
                    setUser((prevUser) => ({ ...prevUser, photoURL: base64Image }));
                    message.success("Cập nhật ảnh đại diện thành công!");
                } catch (error) {
                    console.error("Lỗi khi lưu ảnh vào Firestore:", error);
                    message.error("Đã xảy ra lỗi khi cập nhật ảnh đại diện.");
                }
            };

            reader.onerror = () => {
                console.error("Lỗi khi đọc tệp ảnh:", reader.error);
                message.error("Lỗi khi đọc tệp ảnh.");
            };

            reader.readAsDataURL(compressedFile); // Chuyển file nén sang Base64
        } catch (error) {
            console.error("Lỗi khi nén ảnh:", error);
            message.error("Đã xảy ra lỗi khi nén ảnh.");
        }
    };

    return (
        <HomeWrapper>
            <Title level={2} style={{ textAlign: "center", margin: "24px 0" }}>Thông Tin Cá Nhân</Title>
            <Row justify="center" align="middle">
                <Col>
                    <CardWrapper>
                        <AvatarWrapper>
                            <Avatar
                                src={photoURL}
                                size={128}
                                style={{
                                    // margin: "16px auto",
                                    backgroundColor: "#f56a00",
                                    borderRadius: "50%",
                                }}
                            />
                            <Upload
                                beforeUpload={(file) => {
                                    handleUpload(file);
                                    return false;
                                }}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />} type="primary">
                                    Thay Avatar
                                </Button>
                            </Upload>
                        </AvatarWrapper>
                        <Title level={4}>{displayName}</Title>
                        <Label>Email:</Label> <Text>{email}</Text>
                        <br />
                        <Label>ID:</Label> <Text>{uid}</Text>
                        <br />
                        <Label>Provider:</Label> <Text>{providerId}</Text>
                        <br />
                    </CardWrapper>
                </Col>
            </Row>
        </HomeWrapper>
    );
}
