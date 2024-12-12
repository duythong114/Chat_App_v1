import { Col, Row } from "antd"
import { useApp } from "../wrapper/AppProvider";
import Sidebar from "./Sidebar/Sidebar";

export default function AppLayout(props) {
    // eslint-disable-next-line react/prop-types
    const { children } = props
    const { collapsed } = useApp();

    return (
        <Row style={{ height: '100vh' }}>
            <Col span={collapsed ? 1 : 6}><Sidebar /></Col>
            <Col span={collapsed ? 23 : 18}>{children}</Col>
        </Row>
    )
}
