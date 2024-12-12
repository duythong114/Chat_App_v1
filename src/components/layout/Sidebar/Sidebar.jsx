import { Col, Row, Button } from "antd";
import UserInfor from "./partials/UserInfor";
import RoomList from "./partials/RoomList";
import styled from "styled-components";
import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import { useApp } from "../../wrapper/AppProvider";

const SidebarStyled = styled.div`
    position: relative;
    background: #3f0e40;
    color: white;
    height: 100vh;
    transition: width 0.2s;
    z-index: 1000;

    .icon-btn {
        position: absolute;
        top: 60px; 
        right: 10px; 
        z-index: 1001; 
    }
`;

const CollapsedSidebarStyled = styled(SidebarStyled)`
    width: 100%; 

    .icon-btn {
        position: absolute;
        top: 60px; 
        right: -18px; 
        z-index: 1001; 
    }
`;

export default function Sidebar() {
    const { collapsed, setCollapsed } = useApp();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div style={{ display: 'flex' }}>
            {collapsed ? (
                <CollapsedSidebarStyled>
                    <Button className="icon-btn" onClick={toggleSidebar} icon={<CaretRightOutlined />} />
                </CollapsedSidebarStyled>
            ) : (
                <SidebarStyled>
                    <Button className="icon-btn" onClick={toggleSidebar} icon={<CaretLeftOutlined />} />
                    <Row>
                        <Col span={24}><UserInfor /></Col>
                        <Col span={24}><RoomList /></Col>
                    </Row>
                </SidebarStyled>
            )}
        </div>
    );
}
