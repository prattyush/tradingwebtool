import { useRef, useState } from "react";
import Chart from "./Chart";
import { useNavigate } from 'react-router-dom';

const InputPage = () => {
    const [tradeDate, setTradeDate] = useState("")
    const [ceStrikeprice, setCEStrikePrice] = useState(0)
    const [peStrikeprice, setPEStrikePrice] = useState(0)
    const [replaySpeed, setReplaySpeed] = useState("")
    const [forwardMinutes, setForwardMinutes] = useState(0)
    const [buttonState, setButtonState] = useState(true)
    const navigate = useNavigate();
    const [tradingStyle, setTradingStyle] = useState("simtrading");
    const [ipAddress, setIpAddress] = useState("localhost");

    const handleSimulationInfoSubmit = (event) => {
        event.preventDefault();
        setButtonState(true)
        setTradingStyle("simtrading")
        fetch('http://' + ipAddress + ':9060/simtrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=' + replaySpeed + '&forward=' + forwardMinutes, {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => {
                response.json();
                setButtonState(false)
                navigate("/chart", {state: {tradingStyle:tradingStyle, ipAddress:ipAddress, ceStrikePrice:ceStrikeprice, peStrikePrice:peStrikeprice}});
            })
            .then((data) => {
                console.log(data);
                setButtonState(false)
                //setCEStrikePrice(data['response']['ce_strike_price']);
                //setPEStrikePrice(data['response']['pe_strike_price']);
                console.log(data['response']);
                navigate("/chart", {state: {tradingStyle:tradingStyle, ipAddress:ipAddress, ceStrikePrice:ceStrikeprice, peStrikePrice:peStrikeprice}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }
    const handlePaperTradingInfoSubmit = (event) => {
        event.preventDefault();
        setButtonState(true)
        setTradingStyle("papertrading")
        fetch('http://' + ipAddress + ':9060/papertrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=1&forward=0', {
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
                navigate("/chart", {state: {tradingStyle:tradingStyle, ipAddress:ipAddress, ceStrikePrice:ceStrikeprice, peStrikePrice:peStrikeprice}});
            })
            .then((data) => {
                console.log(data);
                setButtonState(false)
                //setCEStrikePrice(data['ce_strike_price']);
                //setPEStrikePrice(data['pe_strike_price']);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }

    const gotoChart = (event) => {
        event.preventDefault();
        navigate("/chart", {state: {tradingStyle:tradingStyle, ipAddress:ipAddress, ceStrikePrice:ceStrikeprice, peStrikePrice:peStrikeprice}});
    }

    return (
        <div>
            <div style={{float:"left", marginTop:'1%', marginBottom:'1%'}}>
                <h3>SIMULATION TRADING</h3>
                <form name="simulationtrading" onSubmit={handleSimulationInfoSubmit} style={{float:"left"}}>
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
                    </label><label style={{clear:"both", float:"left"}}>Enter Forward Minutes :
                    <input
                        type="text"
                        value={forwardMinutes}
                        onChange={(e) => setForwardMinutes(e.target.value)}
                    />
                </label>
                    <input style={{clear:"both", float:"left"}} type="submit"/>
                </form>
            </div>
            <div style={{clear:"both", float:"left", marginTop:'1%'}}>
                <h3>PAPER TRADING</h3>
                <form name="papertrading" onSubmit={handlePaperTradingInfoSubmit} style={{float:"left"}}>
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
                    <input style={{clear:"both", float:"left"}} type="submit"/>
                </form>
            </div>
            <div  style={{clear:"both", float:"left", marginTop:'1%'}}>
                <label style={{float:"left"}}>Enter IP Address:
                    <input
                        type="text"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                    />
                </label>
                <button type="button" disabled={buttonState} onClick={gotoChart} title="Return" style={{float:"left", clear:"both", marginTop:"1%"}}>Goto Chart</button>
            </div>
        </div>

    );
};

export default InputPage;