import { useRef, useState } from "react";
import Chart from "./Chart";
import { useNavigate } from 'react-router-dom';

const InputPage = () => {
    const [tradeDate, setTradeDate] = useState("")
    const [ceStrikeprice, setCEStrikePrice] = useState("")
    const [peStrikeprice, setPEStrikePrice] = useState("")
    const [replaySpeed, setReplaySpeed] = useState("")
    const [buttonState, setButtonState] = useState(true)
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://192.168.1.9:9060/simtrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=' + replaySpeed, {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                response.json();
                setButtonState(false)
            })
            .then((data) => {
                console.log(data);
                setButtonState(false)
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
                setButtonState(false)
            });

    }
    const gotoChart = (event) => {
        event.preventDefault();
        navigate('/chart');
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{float:"left"}}>
                <label style={{float:"left"}}>Enter Trade Date:
                    <input
                        type="text"
                        value={tradeDate}
                        onChange={(e) => setTradeDate(e.target.value)}
                    />
                </label>
                <label style={{clear:"both", float:"left"}}>Enter CE StrikePrice :
                    <input
                        type="text"
                        value={ceStrikeprice}
                        onChange={(e) => setCEStrikePrice(e.target.value)}
                    />
                </label>
                <label style={{clear:"both", float:"left"}}>Enter PE StrikePrice :
                    <input
                        type="text"
                        value={peStrikeprice}
                        onChange={(e) => setPEStrikePrice(e.target.value)}
                    />
                </label>
                <label style={{clear:"both", float:"left"}}>Enter Replay Speed :
                    <input
                        type="text"
                        value={replaySpeed}
                        onChange={(e) => setReplaySpeed(e.target.value)}
                    />
                </label>
                <input style={{clear:"both", float:"left"}} type="submit" />
            </form>
            <button type="button" disabled={buttonState} onClick={gotoChart} title="Return" style={{float:"left", clear:"both", marginTop:"1%"}}>Goto Chart</button>
        </div>

    );
};

export default InputPage;