import { UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, message, Tooltip } from "antd";
import styled from "styled-components";
import Message from "./partials/Message";
import { useMemo, useState } from "react";
import { createMessageService } from "../../firebase/service/message.service";
import useFirestore from "../../hooks/useFirestore"
import { useApp } from "../../components/wrapper/AppProvider";
import { useAuth } from "../../components/wrapper/AuthProvider";

const WrapperStyled = styled.div`
  height: 100vh;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 11px;
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

const FromStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

export default function ChatPage() {
  const { selectedRoom, members, setIsInviteVisible, selectedRoomId } = useApp();
  const { user: { uid, photoURL, displayName } } = useAuth()
  const [inputValue, setInputValue] = useState(null)
  const [form] = Form.useForm()

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleOnSubmit = () => {
    if (!inputValue) {
      message.warning("Please enter a message.");
      return;
    }

    const data = {
      text: inputValue,
      uid,
      photoURL,
      displayName,
      roomId: selectedRoomId,
    }

    createMessageService(data, 'messages')

    setInputValue(null)

    form.resetFields(["message"])
  }

  const messagesCondition = useMemo(() => {
    return {
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoomId
    };
  }, [selectedRoomId]);

  const messages = useFirestore('messages', messagesCondition);

  return (
    <WrapperStyled>
      <HeaderStyled>
        <div className="header__info">
          <p className="header__title">{selectedRoom?.name}</p>
          <span className="header__description">
            {selectedRoom?.description}
          </span>
        </div>
        <ButtonGroupStyled>
          <Button
            icon={<UserAddOutlined />}
            type="text"
            onClick={() => setIsInviteVisible(true)}
          >
            Mời
          </Button>
          <Avatar.Group size="small" max={{ count: 2 }}>
            {members.length > 0
              ? members.map((member) => (
                <Tooltip title={member.displayName} key={member.id}>
                  <Avatar src={member.photoURL}>
                    {member.photoURL
                      ? ""
                      : member.displayName?.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))
              : null}
          </Avatar.Group>
        </ButtonGroupStyled>
      </HeaderStyled>
      <ContentStyled>
        <MessageListStyled>
          {
            messages.map((mes) =>
              <Message
                key={mes.id}
                text={mes.text}
                photoURL={mes?.photoURL}
                displayName={mes.displayName}
                createdAt={mes.createdAt}
              />)
          }

        </MessageListStyled>
        <FromStyled form={form}>
          <Form.Item name="message">
            <Input
              onChange={handleInputChange}
              onPressEnter={handleOnSubmit}
              variant="borderless"
              autoComplete="off"
              placeholder="Nhập tin nhắn..."
            />
          </Form.Item>
          <Button type="primary" onClick={handleOnSubmit}>Gửi</Button>
        </FromStyled>
      </ContentStyled>
    </WrapperStyled>
  );
}
