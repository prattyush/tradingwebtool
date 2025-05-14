import Chart from "./Chart";
import { useNavigate } from 'react-router-dom';


const WaitPage = () => {
    const navigate = useNavigate();



    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/chart');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input style={{clear:"both", float:"left"}} type="submit" />
        </form>
    );
};

export default WaitPage;