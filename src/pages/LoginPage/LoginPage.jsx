import { Row, Col, Typography, Button, message, Spin } from 'antd';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, facebookProvider } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import paths from '../../constant/paths'
import { useAuth } from '../../components/wrapper/AuthProvider';
import { useState } from 'react';
import { authService, generateKeywords } from '../../firebase/service/user.service';
import styled from 'styled-components';

const { Title } = Typography;

const LoginCard = styled.div`
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 576px) {
    padding: 20px;
  }
`;

const ButtonWrapper = styled(Button)`
 &.ant-btn {
    background: #1877f2;
    color: #fff;
    border: none;
    width: 100%;
    height: 45px;
    font-size: 16px;
    margin-top: 10px;

    &&&:hover {
      background: #145db2;
    }
  }
`;

export default function Login() {
    const navigate = useNavigate()
    const { setUser } = useAuth()
    const [loading, setLoading] = useState(false);

    const handleFacebookLogin = async () => {
        setLoading(true);
        try {
            const data = await signInWithPopup(auth, facebookProvider);
            const providerId = data?.providerId

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const { displayName, email, uid, photoURL } = user

                    const data = { displayName, email, uid, photoURL, providerId, keywords: generateKeywords(displayName) }
                    const response = await authService(data, "users")

                    if (response) {
                        message.info(`Welcome, ${displayName}!`);
                    } else {
                        message.info(`Welcome back, ${displayName}!`);
                    }

                    setUser({ displayName, email, uid, photoURL, providerId })
                    navigate(paths.chatroom)
                    return;
                }
            });
        } catch (error) {
            message.error(`Login failed`);
            console.error("Facebook Login Failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        message.info("Chức năng này hiện chưa có")
        setTimeout(() => {

        }, 3000)
        setLoading(false)
    }

    return (
        <Row justify="center" align="middle" style={{ height: '100vh', background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' }}>
            <Col xs={22} sm={16} md={12} lg={8}>
                <LoginCard>
                    <Title level={3} style={{ color: '#4c4c6d' }}>Fun Chat</Title>
                    <Spin spinning={loading}>
                        <ButtonWrapper onClick={handleGoogleLogin} disabled={loading}>
                            Login with Google
                        </ButtonWrapper>
                        <ButtonWrapper onClick={handleFacebookLogin} disabled={loading}>
                            Login with Facebook
                        </ButtonWrapper>
                    </Spin>
                </LoginCard>
            </Col>
        </Row>
    );
}
