import { Col, Row } from "antd";
import Sidebar from './partials/Sidebar/Sidebar'
import ChatWindow from './partials/ChatWindow/ChatWindow'

export default function ChatRoom() {

    return (
        <Row>
            <Col span={6}><Sidebar /></Col>
            <Col span={18}><ChatWindow /></Col>
        </Row>
    )
}
