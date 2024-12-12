import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Collapse, Typography } from "antd";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import paths from "../../../../constant/paths"
import { useApp } from "../../../wrapper/AppProvider";

const StyledCollapse = styled(Collapse)`
    &&& {
        .ant-collapse-header {
            color: white;
        }

        .ant-collapse-content-box {
            padding: 0 40px;
        }

        .add-room {
            color: white;
            padding: 0;
        }
    }
`;

const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;
    color: white;
`;

export default function RoomList() {
    const { rooms, setIsOpenModal, setSelectedRoomId } = useApp()
    const navigate = useNavigate()

    const handleAddRoom = () => {
        setIsOpenModal(true)
    }

    const handleSelectRoom = (roomId) => {
        if (roomId) {
            setSelectedRoomId(roomId)
            navigate(paths.chatroom)
        }
    }

    const items = [
        {
            key: '1',
            label: 'Danh sách các phòng',
            children: (
                <>
                    {
                        rooms.map(room => (
                            <LinkStyled
                                onClick={() => handleSelectRoom(room.id)}
                                key={room.id}>
                                {room.name}
                            </LinkStyled>))
                    }
                    <Button
                        type="text"
                        icon={<PlusSquareOutlined />}
                        className="add-room"
                        onClick={handleAddRoom}
                    >
                        Thêm phòng
                    </Button>
                </>
            ),
        },
    ];

    return <StyledCollapse ghost defaultActiveKey={['1']} items={items} />;
}
