import { Col, Row } from "antd";
import UserInfor from "./partials/UserInfor";
import RoomList from "./partials/RoomList";
import styled from "styled-components";

const SidebarStyled = styled.div`
    background: #3f0e40;
    color: white;
    height: 100vh;
`

export default function Sidebar() {
    return (
        <SidebarStyled>
            <Row>
                <Col span={24}><UserInfor /></Col>
                <Col span={24}><RoomList /></Col>
            </Row>
        </SidebarStyled>
    )
}
