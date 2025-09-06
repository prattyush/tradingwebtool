import {useRef, useState} from "react";
import { useNavigate } from 'react-router-dom';
import AnalyticsPage from "./AnalyticsPage";

const InputPage = () => {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 as months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;

    const [tradeDate, setTradeDate] = useState(formattedDate)
    const [ceStrikeprice, setCEStrikePrice] = useState(0)
    const [peStrikeprice, setPEStrikePrice] = useState(0)
    const [replaySpeed, setReplaySpeed] = useState(".9")
    const [forwardMinutes, setForwardMinutes] = useState(0)
    const [tradeQuantity, setTradeQuantity] = useState(0)
    const [priceRange, setPriceRange] = useState("vlow")
    const [chartType, setChartType] = useState("stockCEPE")
    const navigate = useNavigate();
    const tradingStyle = useRef("simtrading")
    const [ipAddress, setIpAddress] = useState("192.168.1.5");

    const priceIntervalRangeMap = new Map();
    priceIntervalRangeMap.set("ulow", [21,45]);
    priceIntervalRangeMap.set("vlow", [30,60]);
    priceIntervalRangeMap.set("low", [60,90]);
    priceIntervalRangeMap.set("mid", [90,135]);
    priceIntervalRangeMap.set("high", [135,195]);
    priceIntervalRangeMap.set("vhigh", [174,240]);

    const handleSimulationInfoSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/simtrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=' + replaySpeed + '&forward=' + forwardMinutes + '&websocket=true&quantity=' + tradeQuantity
            + "&rlow=" + priceIntervalRangeMap.get(priceRange)[0] + "&rhigh=" + priceIntervalRangeMap.get(priceRange)[1], {
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
                const response_data = data['response']
                navigate(getNavigateChartType(), {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:response_data['ce_strike_price'], peStrikePrice:response_data['pe_strike_price'], port:response_data['port'], replaySpeed:replaySpeed, tradeDate:tradeDate, rangeHigh:priceIntervalRangeMap.get(priceRange)[1], rangeLow:priceIntervalRangeMap.get(priceRange)[0]}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }
    const handlePaperTradingInfoSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/papertrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=1&forward=0&websocket=true&quantity='+tradeQuantity
            + "&rlow=" + priceIntervalRangeMap.get(priceRange)[0] + "&rhigh=" + priceIntervalRangeMap.get(priceRange)[1], {
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
                const response_data = data['response']
                console.log(tradingStyle.current)
                navigate(getNavigateChartType(), {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:response_data['ce_strike_price'], peStrikePrice:response_data['pe_strike_price'], port:response_data['port'], replaySpeed:1, tradeDate:tradeDate, rangeHigh: priceIntervalRangeMap.get(priceRange)[1], rangeLow: priceIntervalRangeMap.get(priceRange)[0]}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }
    const handleRealTradingInfoSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/realtrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=1&forward=0&websocket=true&quantity=' + tradeQuantity
            + "&rlow=" + priceIntervalRangeMap.get(priceRange)[0] + "&rhigh=" + priceIntervalRangeMap.get(priceRange)[1], {
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
                tradingStyle.current = "realtrading"
                const response_data = data['response']
                console.log(tradingStyle.current)
                navigate(getNavigateChartType(), {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:response_data['ce_strike_price'], peStrikePrice:response_data['pe_strike_price'], port:response_data['port'], replaySpeed:1, tradeDate:tradeDate, rangeHigh: priceIntervalRangeMap.get(priceRange)[1], rangeLow: priceIntervalRangeMap.get(priceRange)[0]}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    function getNavigateChartType() {
        if (chartType === "stockCEPE") {
            return "/chart"
        }  else if (chartType === "Options") {
            return "/optionschart"
        }

        return "/chart"
    }

    const handlePaperTradingInfoOrderSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/papertrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=1&forward=0&websocket=false&quantity='+tradeQuantity
            + "&rlow=" + priceIntervalRangeMap.get(priceRange)[0] + "&rhigh=" + priceIntervalRangeMap.get(priceRange)[1], {
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
                const response_data = data['response']
                console.log(tradingStyle.current)
                navigate("/ordercmd", {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:response_data['ce_strike_price'], peStrikePrice:response_data['pe_strike_price'], port:response_data['port'], replaySpeed:1, tradeDate:tradeDate, rangeHigh: priceIntervalRangeMap.get(priceRange)[1], rangeLow: priceIntervalRangeMap.get(priceRange)[0]}});
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleRealTradingInfoOrderSubmit = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/realtrading/initiate?tradedate=' + tradeDate + '&ce=' + ceStrikeprice
            + '&pe=' + peStrikeprice +'&speed=1&forward=0&websocket=false&quantity=' + tradeQuantity
            + "&rlow=" + priceIntervalRangeMap.get(priceRange)[0] + "&rhigh=" + priceIntervalRangeMap.get(priceRange)[1], {
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
                tradingStyle.current = "realtrading"
                const response_data = data['response']
                console.log(tradingStyle.current)
                navigate("/ordercmd", {state: {tradingStyle:tradingStyle.current, ipAddress:ipAddress, ceStrikePrice:response_data['ce_strike_price'], peStrikePrice:response_data['pe_strike_price'], port:response_data['port'], replaySpeed:1, tradeDate:tradeDate, rangeHigh: priceIntervalRangeMap.get(priceRange)[1], rangeLow: priceIntervalRangeMap.get(priceRange)[0]}});
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

    const handleTradeReplaySubmit = (event) => {
        event.preventDefault();
        navigate("/tools/tradereplay", {state: {ipAddress:ipAddress}});
    }

    const handleTradeLabelTool = (event) => {
        event.preventDefault();
        navigate("/tools/tradelabelstrategy", {state: {ipAddress:ipAddress}});
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
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter Forward Minutes :
                    <input
                        type="text" value={forwardMinutes} style={{width:'15%'}} onChange={(e) => setForwardMinutes(e.target.value)}/>
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter Quantity :
                        <input
                            type="text" value={tradeQuantity} style={{width:'15%'}} onChange={(e) => setTradeQuantity(e.target.value)}/>
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter IP Address:
                        <input type="text" value={ipAddress} style={{width:'30%'}} onChange={(e) => setIpAddress(e.target.value)}/>
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Price Interval
                        <select name="PriceRange" id="optionType" defaultValue={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                            <option>ulow</option>
                            <option>vlow</option>
                            <option>low</option>
                            <option>mid</option>
                            <option>high</option>
                            <option>vhigh</option>
                        </select>
                    </label>
                    <label style={{float:"left", marginLeft:'1%'}}>Chart Type
                    <select name="ChartType" id="chartType" defaultValue={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option>stockCEPE</option>
                        <option>Options</option>
                        <option>Stock</option>
                    </select>
                </label>
                    <button type="button" onClick={handleSimulationInfoSubmit} title="simtrading" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>SIM TRADING</button>
                    <button type="button" onClick={handlePaperTradingInfoSubmit} title="papertrading" style={{float:"left", marginTop:"1%", marginLeft:'1%', marginBottom:'1%'}}>PAPER TRADING</button>
                    <button type="button" onClick={handleRealTradingInfoSubmit} title="realtrading" style={{float:"left", marginTop:"1%", marginLeft:'1%', marginBottom:'1%'}}>REAL TRADING</button>
                    <button type="button" onClick={handlePaperTradingInfoOrderSubmit} title="papertradingorder" style={{float:"left", marginTop:"1%", marginLeft:'1%', marginBottom:'1%'}}>PAPER TRADING ORDER</button>
                    <button type="button" onClick={handleRealTradingInfoOrderSubmit} title="realtradingorder" style={{float:"left", marginTop:"1%", marginLeft:'1%', marginBottom:'1%'}}>REAL TRADING ORDER</button>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'30%' }}>
                    <button type="button" onClick={handleStrategyLabelSubmit} title="labelstrategy" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Label Strategy</button>
                    <button type="button" onClick={handleAnalyzeStrategySubmit} title="analyzestrategy" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Analyze Strategy</button>
                    <button type="button" onClick={handleTradeReplaySubmit} title="tradereplay" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Trade Replayer</button>
                    <button type="button" onClick={handleTradeLabelTool} title="tradelabel" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Trade Label</button>
                </div>
            </div>
            <div style={{float:"left", width:'98%', height:'75%'}}><AnalyticsPage ipAddress={ipAddress}/></div>
        </div>

    );
};

export default InputPage;
