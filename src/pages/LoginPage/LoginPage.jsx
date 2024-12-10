import { Row, Col, Typography, Button, message, Spin } from 'antd';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, facebookProvider } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import paths from '../../constant/paths'
import { useAuth } from '../../components/wrapper/AuthProvider';
import { useState } from 'react';
import { authService, generateKeywords } from '../../firebase/service/user.service';

const { Title } = Typography;

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

    return (
        <>
            <Row justify={'center'} style={{ height: 800 }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>
                        Fun Chat
                    </Title>
                    <Button style={{ width: '100%', marginBottom: 5 }}>
                        Login with Google
                    </Button>
                    <Spin spinning={loading}>
                        <Button
                            onClick={handleFacebookLogin}
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            Login with Facebook
                        </Button>
                    </Spin>
                </Col>
            </Row>
        </>
    )
}
