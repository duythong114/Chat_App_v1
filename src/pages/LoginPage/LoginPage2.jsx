import {
    LockOutlined,
    MobileOutlined,
    UserOutlined,
    GoogleCircleFilled,
    FacebookFilled,
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProConfigProvider,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import { Divider, Form, message, Space, Spin, Tabs, theme } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/wrapper/AuthProvider';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, facebookProvider } from '../../firebase/config';
import { authService, generateKeywords } from '../../firebase/service/user.service';
import paths from '../../constant/paths';

const BackgroundWrapper = styled.div`
  align-items: center;
  background-color: white;
  height: 100vh;

  .ant-pro-form-login-page-notice {
    flex: 0;
  }
`;

const CustomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const LoginOption = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 40px;
  width: 40px;
  border: 1px solid ${(props) => props.theme.colorPrimaryBorder};
  border-radius: 50%;
`;

const ActionsDivider = styled.span`
  color: ${(props) => props.theme.colorTextPlaceholder};
  font-weight: normal;
  font-size: 14px;
`;

const Page = () => {
    const [authType, setAuthType] = useState('login');
    const { token } = theme.useToken();
    const navigate = useNavigate()
    const { setUser } = useAuth()
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm()

    const iconStyles = {
        color: 'rgba(0, 0, 0, 0.2)',
        fontSize: '28px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const { email, password } = values;
            const response = await signInWithEmailAndPassword(auth, email, password);
            const userData = response?.user
            if (userData) {
                const { displayName, email, uid, photoURL, providerId } = userData
                setUser({ displayName, email, uid, photoURL, providerId })
                form.resetFields()
                navigate(paths.chatroom);
                message.success('Đăng nhập thành công');
            }
        } catch (error) {
            message.error('Tài khoản hoặc mật khẩu sai');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const { name, email, password } = values;
            const providerId = "firebase"
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user

            await updateProfile(user, {
                displayName: name
            });

            onAuthStateChanged(auth, async (user) => {
                if (user && providerId === "firebase") {
                    const { email, uid, photoURL } = user

                    const data = { displayName: name, email, uid, photoURL, providerId, keywords: generateKeywords(name) }
                    await authService(data, "users")

                    message.success(`Đăng ký tài khoản thành công`);
                    form.resetFields()
                    setAuthType('login')
                }
            });
        } catch (error) {
            message.error("Đăng ký thất bại");
            console.error("Registration error:", error);
        } finally {
            setLoading(false)
        }
    };

    const handleFacebookLogin = async () => {
        setLoading(true);
        try {
            const data = await signInWithPopup(auth, facebookProvider);
            const providerId = data?.providerId

            onAuthStateChanged(auth, async (user) => {
                if (user && providerId === "facebook.com") {
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
        setLoading(false)
    }

    return (
        <BackgroundWrapper>
            <LoginFormPage
                disabled={loading}
                onFinish={authType === 'login' ? handleLogin : handleRegister}
                backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                logo="https://w7.pngwing.com/pngs/257/869/png-transparent-iphone-x-imessage-multimedia-messaging-service-sms-messages-miscellaneous-multimedia-messaging-service-grass-thumbnail.png"
                backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                title="SUKO CHAT"
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0,0.65)',
                    backdropFilter: 'blur(4px)',
                }}
                subTitle="Phần mềm nhắn tin vui vẻ"
                submitter={{
                    searchConfig: {
                        submitText: authType === 'login' ? 'Đăng nhập' : 'Đăng ký',
                    },
                }}
                actions={
                    <CustomContainer>
                        <Spin spinning={loading}>
                        </Spin>
                        <Divider plain>
                            <ActionsDivider>Các loại đăng nhập khác</ActionsDivider>
                        </Divider>
                        <Space size={24}>
                            <LoginOption disabled={loading}>
                                <GoogleCircleFilled
                                    onClick={handleGoogleLogin}
                                    style={{ ...iconStyles, color: '#1677FF' }} />
                            </LoginOption>
                            <LoginOption disabled={loading}>
                                <FacebookFilled
                                    onClick={handleFacebookLogin}
                                    style={{ ...iconStyles, color: '#FF6A10' }} />
                            </LoginOption>
                        </Space>
                    </CustomContainer>
                }
                form={form}
            >
                <Tabs
                    centered
                    activeKey={authType}
                    onChange={(activeKey) => setAuthType(activeKey)}
                >
                    <Tabs.TabPane key="login" tab="Đăng nhập" />
                    <Tabs.TabPane key="register" tab="Đăng ký" />
                </Tabs>
                {authType === 'login' && (
                    <>
                        <ProFormText
                            name="email"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined style={{ color: token.colorText }} />,
                            }}
                            placeholder="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng điền email của bạn!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined style={{ color: token.colorText }} />,
                            }}
                            placeholder="Mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu của bạn!',
                                },
                            ]}
                        />
                    </>
                )}
                {authType === 'register' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined style={{ color: token.colorText }} />,
                            }}
                            name="name"
                            placeholder="Full Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng điền tên của bạn!',
                                },
                            ]}
                        />
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <MobileOutlined style={{ color: token.colorText }} />,
                            }}
                            name="email"
                            placeholder="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email này không phù hợp!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined style={{ color: token.colorText }} />,
                            }}
                            name="password"
                            placeholder="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                                },
                            ]}
                        />
                    </>
                )}
                {
                    authType === 'login' &&
                    <div style={{ marginBlockEnd: 24 }}>
                        <ProFormCheckbox noStyle name="autoLogin">
                            Ghi nhớ
                        </ProFormCheckbox>
                        <a style={{ float: 'right' }}>Quên mật khẩu</a>
                    </div>
                }
            </LoginFormPage>
        </BackgroundWrapper>
    );
};

const LoginPage2 = () => {
    return (
        <ConfigProvider locale={viVN}>
            <ProConfigProvider dark>
                <Page />
            </ProConfigProvider>
        </ConfigProvider>
    )
}

export default LoginPage2


