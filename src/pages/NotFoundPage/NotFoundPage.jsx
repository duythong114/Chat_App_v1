import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleComeBack = () => {
        navigate(-1)
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={handleComeBack}>
                    ComeBack
                </Button>
            }
        />
    );
}
