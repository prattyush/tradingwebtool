import {useRef, useState} from "react";
import { useNavigate } from 'react-router-dom';
import AnalyticsPage from "./AnalyticsPage";

const InputPage = () => {
    const [tradeDate, setTradeDate] = useState("19-03-2025")
    const [ceStrikeprice, setCEStrikePrice] = useState(0)
    const [peStrikeprice, setPEStrikePrice] = useState(0)
    const [replaySpeed, setReplaySpeed] = useState(".3")
    const [forwardMinutes, setForwardMinutes] = useState(0)
    const navigate = useNavigate();
    const tradingStyle = useRef("simtrading")
    const [ipAddress, setIpAddress] = useState("192.168.1.10");

    const handleSimulationInfoSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/simtrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=' + replaySpeed + '&forward=' + forwardMinutes + "&websocket=true", {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                tradingStyle.current = "simtrading"
                const option_info_data = data['response']
                navigate("/chart", {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:option_info_data['ce_strike_price'], peStrikePrice:option_info_data['pe_strike_price'], replaySpeed:replaySpeed}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }
    const handlePaperTradingInfoSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/papertrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=1&forward=0&websocket=true', {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                tradingStyle.current = "papertrading"
                const option_info_data = data['response']
                console.log(tradingStyle.current)
                navigate("/chart", {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:option_info_data['ce_strike_price'], peStrikePrice:option_info_data['pe_strike_price'], replaySpeed:1}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }

    const handlePaperTradingInfoOrderSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/papertrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=1&forward=0&websocket=false', {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                tradingStyle.current = "papertrading"
                const option_info_data = data['response']
                console.log(tradingStyle.current)
                navigate("/ordercmd", {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:option_info_data['ce_strike_price'], peStrikePrice:option_info_data['pe_strike_price'], replaySpeed:1}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleStrategyLabelSubmit = (event) => {
        event.preventDefault();
        navigate("/tools/labelstrategy", {state: {ipAddress:ipAddress}});
    }

    const handleAnalyzeStrategySubmit = (event) => {
        event.preventDefault();
        navigate("/tools/analyzestrategy", {state: {ipAddress:ipAddress}});
    }

    return (
        <div>
            <div style={{float:"left", marginBottom:'1%', width:'90%', height:'20%'}}>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'60%' }}>
                    <h4>TRADING DETAILS</h4>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter Trade Date:
                        <input type="text" value={tradeDate} style={{width:'30%'}} onChange={(e) => setTradeDate(e.target.value)}/>
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter CE StrikePrice :
                        <input type="text" value={ceStrikeprice} style={{width:'30%'}} onChange={(e) => setCEStrikePrice(e.target.value)}/>
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter PE StrikePrice :
                        <input type="text" value={peStrikeprice} style={{width:'30%'}} onChange={(e) => setPEStrikePrice(e.target.value)}/>
                    </label>
                    <label style={{clear:"both", float:"left", marginLeft:'1%'}}>Enter Replay Speed :
                        <input type="text" value={replaySpeed} style={{width:'15%'}} onChange={(e) => setReplaySpeed(e.target.value)}/>
                    </label><label style={{float:"left", marginLeft:'1%'}}>Enter Forward Minutes :
                    <input
                        type="text" value={forwardMinutes} style={{width:'15%'}} onChange={(e) => setForwardMinutes(e.target.value)}/>
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter IP Address:
                        <input type="text" value={ipAddress} style={{width:'30%'}} onChange={(e) => setIpAddress(e.target.value)}/>
                    </label>
                    <button type="button" onClick={handleSimulationInfoSubmit} title="simtrading" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>SIM TRADING</button>
                    <button type="button" onClick={handlePaperTradingInfoSubmit} title="papertrading" style={{float:"left", marginTop:"1%", marginLeft:'1%', marginBottom:'1%'}}>PAPER TRADING</button>
                    <button type="button" onClick={handlePaperTradingInfoOrderSubmit} title="papertradingorder" style={{float:"left", marginTop:"1%", marginLeft:'1%', marginBottom:'1%'}}>PAPER TRADING ORDER</button>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'30%' }}>
                    <button type="button" onClick={handleStrategyLabelSubmit} title="labelstrategy" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Label Strategy</button>
                    <button type="button" onClick={handleAnalyzeStrategySubmit} title="analyzestrategy" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Analyze Strategy</button>
                </div>
            </div>
            <div style={{float:"left", width:'98%', height:'75%'}}><AnalyticsPage ipAddress={ipAddress}/></div>
        </div>

    );
};

export default InputPage;
