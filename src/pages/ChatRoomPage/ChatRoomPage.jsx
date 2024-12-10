import { Col, Row } from "antd";
import Sidebar from './partials/Sidebar/Sidebar'
import ChatWindow from './partials/ChatWindow/ChatWindow'
import { useApp } from "../../components/wrapper/AppProvider";

export default function ChatRoom() {
    const { collapsed } = useApp();

    return (
        <Row style={{ height: '100vh' }}>
            <Col span={collapsed ? 1 : 6}><Sidebar /></Col>
            <Col span={collapsed ? 23 : 18}><ChatWindow /></Col>
        </Row>
    )
}
