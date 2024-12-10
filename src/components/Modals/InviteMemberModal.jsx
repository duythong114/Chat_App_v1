import { Form, Select, message, Modal, Spin, Avatar } from "antd";
import { useApp } from "../wrapper/AppProvider";
import { useMemo, useState } from "react";
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

// eslint-disable-next-line react/prop-types
function DebounceSelect({ fetchOptions, debounceTimeout = 300, currentMembers, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, currentMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, currentMembers]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
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

const fetchUserList = async (search, currentMembers) => {
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

        return results.filter((opt) => !currentMembers.includes(opt.value));
    } catch (error) {
        console.error("Error fetching user list:", error.message);
        return [];
    }
};

export default function InviteMemberModal() {
    const {
        isInviteVisible,
        setIsInviteVisible,
        selectedRoomId,
        selectedRoom } = useApp();
    const [value, setValue] = useState([]);
    const [form] = Form.useForm();

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

    return (
        <Modal
            title="Mời thêm thành viên"
            open={isInviteVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
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
            </Form>
        </Modal>
    );
}
