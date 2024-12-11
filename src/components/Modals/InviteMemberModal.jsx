import { Form, Select, message, Modal, Spin, Avatar, Typography } from "antd";
import { useApp } from "../wrapper/AppProvider";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { db } from "../../firebase/config";
import {
    collection,
    getDocs,
    limit,
    query,
    where,
    orderBy,
    doc,
    updateDoc,
} from "firebase/firestore";
import styled from "styled-components";

const ModalWrapper = styled(Modal)`
    .ant-modal-body{
        height: 100px;
    }
}
`
// eslint-disable-next-line react/prop-types
function DebounceSelect({ fetchOptions, debounceTimeout = 300, currentMembers, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const {
        isInviteVisible,
    } = useApp();

    useEffect(() => {
        if (isInviteVisible) {
            setSearchValue("")
        }
    }, [isInviteVisible])

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, currentMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
                setSearchValue(value)
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, currentMembers]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={
                fetching ? (
                    <Spin size="small" />
                ) : (searchValue && options.length === 0 && (
                    <Typography.Text>
                        Không tìm thấy kết quả phù hợp
                    </Typography.Text>
                ))
            }
            dropdownRender={(menu) => (
                <div style={{ maxHeight: 65, overflow: 'auto' }}>
                    {menu}
                </div>
            )}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value}>
                    <Avatar size="small" src={opt.photoURL}>
                        {opt.photoURL ? "" : opt.label?.charAt(0).toUpperCase()}
                    </Avatar>
                    {`${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

export default function InviteMemberModal() {
    const {
        isInviteVisible,
        setIsInviteVisible,
        selectedRoomId,
        selectedRoom } = useApp();
    const [value, setValue] = useState([]);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    const handleOk = async () => {
        try {
            if (!value || value.length === 0) {
                message.warning("Vui lòng chọn ít nhất một thành viên.");
                return;
            }

            // Get a reference to the specific room document
            const roomRef = doc(db, "rooms", selectedRoomId);

            // Update the members array
            await updateDoc(roomRef, {
                members: [...selectedRoom.members, ...value.map(val => val.value)],
            });

            message.success("Thành viên đã được mời thành công!");

            setValue([]);
            setIsInviteVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error inviting members:", error);
            message.error("Có lỗi xảy ra khi mời thành viên.");
        }
    };

    const handleCancel = () => {
        setValue([]);
        setIsInviteVisible(false);
        form.resetFields();
    };

    const fetchUserList = async (search, currentMembers) => {
        setIsLoading(true)
        try {
            const userCollection = collection(db, "users"); // Reference the collection

            // Define the query constraints
            const constraints = [
                where("keywords", "array-contains", search),
                orderBy("displayName"),
                limit(20),
            ];

            // Build the query
            const userQuery = query(userCollection, ...constraints);

            // Execute the query
            const snapshot = await getDocs(userQuery);

            // Map the results to an array of options
            const results = snapshot.docs.map((doc) => ({
                label: doc.data().displayName,
                value: doc.data().uid,
                photoURL: doc.data().photoURL,
            }))

            if (!results) {
                return
            }

            return results.filter((opt) => !currentMembers.includes(opt.value));
        } catch (error) {
            console.error("Error fetching user list:", error.message);
            return [];
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <ModalWrapper
            title="Mời thêm thành viên"
            open={isInviteVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
                <Spin spinning={isLoading}>
                    <DebounceSelect
                        mode="multiple"
                        label="Tên các thành viên"
                        value={value}
                        placeholder="Nhập tên thành viên"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: "100%" }}
                        currentMembers={selectedRoom.members}
                    />
                </Spin>
            </Form>
        </ModalWrapper>
    );
}
