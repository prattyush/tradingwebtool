import { useState, useCallback, useRef } from "react";
import Zoom from 'react-medium-image-zoom'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { useNavigate } from 'react-router-dom';
import InnerImageZoom from 'react-inner-image-zoom';
import ImageZoom from "react-image-zooom";
import {strategyoptions, previousDayOptions, todayStartOptions, baroptions} from "./StrategyVariables";

import {useLocation} from 'react-router-dom';

const LabelStrategy = () => {
    const location = useLocation();
    const ipAddress = location.state['ipAddress'];
    const navigate = useNavigate();
    const [tradeDate, setTradeDate] = useState("07-07-2025")
    const [chartImageNameList, setChartImageNameList] = useState([]);
    const [chartImageIdList, setChartImageIdList] = useState([]);
    const [isZoomed, setIsZoomed] = useState(false)
    const entryStrategyMap = useRef(new Map())
    const exitStrategyMap = useRef(new Map())
    const falseEntryStrategyMap = useRef(new Map())
    const falseExitStrategyMap = useRef(new Map())
    const [prevDayConditions, setPrevDayConditions] = useState("tradingrange")
    const [dayStartConditions, setDayStartConditions] = useState("normal")

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])

    const handleChartImage = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/tools?name=labelstrategy&type=label&tradedate=' + tradeDate, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {

                const chart_locations = data['response']
                console.log(data)
                setChartImageNameList(chart_locations['name']);
                setChartImageIdList(chart_locations['id']);
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleChartStrategyDataSubmit = (event) => {
        event.preventDefault();
        console.log(entryStrategyMap.current);
        console.log(exitStrategyMap.current);
        console.log(falseEntryStrategyMap.current);
        console.log(falseExitStrategyMap.current);
        console.log(prevDayConditions);
        console.log(dayStartConditions);
        const dataToSend = {
            'entryStrategyMap': entryStrategyMap.current,
            'exitStrategyMap': exitStrategyMap.current,
            'falseEntryStrategyMap': falseEntryStrategyMap.current,
            'falseExitStrategyMap': falseExitStrategyMap.current,
            'prevdaycondition': prevDayConditions,
            'daystartcondition': dayStartConditions
        };
        const jsonString = JSON.stringify(dataToSend);

        // Encode the JSON string to UTF-8 bytes to determine the Content-Length
        const encoder = new TextEncoder();
        const utf8Bytes = encoder.encode(jsonString);
        const contentLength = utf8Bytes.length;

        fetch('http://' + ipAddress + ':9060/tools?name=labelstrategy&tradedate=' + tradeDate, {
            method: 'POST',
            body: jsonString,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'false',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }

    const handleEntryStrategy = (event, imageId, stratCount) => {
        if (!entryStrategyMap.current.has(imageId)) {
            entryStrategyMap.current[imageId] = new Map();
        }
        entryStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleExitStrategy = (event, imageId, stratCount) => {
        if (!exitStrategyMap.current.has(imageId)) {
            exitStrategyMap.current[imageId] = new Map();
        }
        exitStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleFalseEntryStrategy = (event, imageId, stratCount) => {
        if (!falseEntryStrategyMap.current.has(imageId)) {
            falseEntryStrategyMap.current[imageId] = new Map();
        }
        falseEntryStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleFalseExitStrategy = (event, imageId, stratCount) => {
        if (!falseExitStrategyMap.current.has(imageId)) {
            falseExitStrategyMap.current[imageId] = new Map();
        }
        falseExitStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleInputPageRedirection = (event) => {
        event.preventDefault();
        navigate("/");
    }

    function importAll(r) {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    }
    const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

    return (
        <div>
            <div style={{float:"left", marginBottom:'1%', width:'90%', height:'90%'}}>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'30%', height:'5%'}}>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter Trade Date:
                        <input type="text" value={tradeDate} style={{width:'30%'}} onChange={(e) => setTradeDate(e.target.value)}/>
                    </label>
                    <button type="button" id="getChartData" onClick={handleChartImage} title="simtrading" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Get Charts</button>
                    <button type="button" id="getChartData" onClick={handleInputPageRedirection} title="inputPage" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Back to Input</button>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'30%', height:'5%'}}>
                    <label style={{float:"left", marginLeft:'1%'}}>Previous Day Against Today Start Conditions</label>
                    <select style={{clear:"both", float:"left", marginTop:'1%'}} name="PreviousDayState" id="previousDayState" defaultValue="tradingrange" onChange={(e) => setPrevDayConditions(e.target.value)}>
                        {previousDayOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="DayStartConditions" id="dayStartConditions" defaultValue="normal" onChange={(e) => setDayStartConditions(e.target.value)}>
                        {todayStartOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button type="button" id="dataSubmit" onClick={handleChartStrategyDataSubmit} title="datasubmit" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Submit CHART Strategies </button>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'90%', height:'20%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'20%'}}>
                        <img style={{float:"left", width:'98%', height:'25%'}} src={images[chartImageNameList[0]]} alt={chartImageIdList[0]}/>
                    </div>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                        <h5>True Cases</h5>
                        <label style={{float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy1" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[0], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[0], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{ float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy2" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[0], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy2" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[0], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[0], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[0], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[0], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[0], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'90%', height:'20%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'20%'}}>
                        <img style={{float:"left", width:'98%', height:'25%'}} src={images[chartImageNameList[1]]} alt={chartImageIdList[1]}/>
                    </div>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                        <h5>True Cases</h5>
                        <label style={{float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy1" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[1], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[1], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{ float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy2" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[1], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy2" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[1], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[1], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[1], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[1], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[1], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'90%', height:'20%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'20%'}}>
                        <img style={{float:"left", width:'98%', height:'25%'}} src={images[chartImageNameList[2]]} alt={chartImageIdList[2]}/>
                    </div>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                        <h5>True Cases</h5>
                        <label style={{float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy1" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[2], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[2], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{ float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy2" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[2], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy2" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[2], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[2], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[2], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[2], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[2], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'90%', height:'20%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'20%'}}>
                        <img style={{float:"left", width:'98%', height:'25%'}} src={images[chartImageNameList[3]]} alt={chartImageIdList[3]}/>
                    </div>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                        <h5>True Cases</h5>
                        <label style={{float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy1" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[3], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[3], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{ float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy2" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[3], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy2" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[3], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[3], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[3], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[3], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[3], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'90%', height:'20%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'20%'}}>
                        <img style={{float:"left", width:'98%', height:'25%'}} src={images[chartImageNameList[4]]} alt={chartImageIdList[4]}/>
                    </div>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                        <h5>True Cases</h5>
                        <label style={{float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy1" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[4], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[4], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{ float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy2" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[4], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy2" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[4], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[4], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[4], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[4], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[4], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'90%', height:'20%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'20%'}}>
                        <img style={{float:"left", width:'98%', height:'25%'}} src={images[chartImageNameList[5]]} alt={chartImageIdList[5]}/>
                    </div>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                        <h5>True Cases</h5>
                        <label style={{float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy1" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[5], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[5], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{ float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy2" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[5], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy2" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[5], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[5], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[5], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[5], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[5], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'90%', height:'20%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'20%'}}>
                        <img style={{float:"left", width:'98%', height:'25%'}} src={images[chartImageNameList[6]]} alt={chartImageIdList[6]}/>
                    </div>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                        <h5>True Cases</h5>
                        <label style={{float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy1" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[6], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[6], 1)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{ float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy2" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[6], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy2" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[6], 2)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'5%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'5%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[6], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[6], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Entry Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[6], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Choose Exit Strategy:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[6], 3)}>
                            {strategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default LabelStrategy;