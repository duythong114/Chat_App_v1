import { Button, Avatar, Typography, message } from "antd";
import styled from "styled-components";
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import paths from "../../../../constant/paths"
import { auth } from "../../../../firebase/config";
import { useAuth } from "../../../wrapper/AuthProvider";

const WrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82, 38, 83);

    .username {
        color: white;
        margin-left: 5px;
    }

    @media (max-width: 1028px) {
        flex-direction: column; 
        align-items: flex-start;
        gap: 5px;
        padding: 8px; 
    }
`

const UserInfoStyled = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`

export default function UserInfor() {
    const { user: { displayName, photoURL }, setUser } = useAuth();
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            message.success("You have been logged out.");
            navigate(paths.login);
        } catch (error) {
            console.error("SignOut Error:", error);
            message.error("Logout failed. Please try again.");
        }
    };

    const handleNavigate = () => {
        navigate(paths.home)
    }

    return (
        <WrapperStyled>
            <UserInfoStyled onClick={handleNavigate}>
                <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0).toUpperCase()}</Avatar >
                <Typography.Text className="username">{displayName}</Typography.Text>
            </UserInfoStyled>
            <Button ghost onClick={handleLogout}>Đăng xuất</Button>
        </WrapperStyled>
    )
}
