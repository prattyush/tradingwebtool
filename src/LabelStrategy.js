import {useState, useCallback, useRef, useEffect} from "react";
import 'react-medium-image-zoom/dist/styles.css'
import { useNavigate } from 'react-router-dom';
import {
    strategyoptions,
    previousDayOptions,
    todayStartOptions,
    getBarEndTimeOption,
    tradeTypeOptions,
    tradestrategyoptions
} from "./StrategyVariables";
import {CandlestickSeries, createChart, LineStyle, createSeriesMarkers, LineSeries} from "lightweight-charts";

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
    const barEntryStrategyMap = useRef(new Map())
    const barExitStrategyMap = useRef(new Map())
    const falseBarEntryStrategyMap = useRef(new Map())
    const falseBarExitStrategyMap = useRef(new Map())
    const tradeTypeEntryStrategyMap = useRef(new Map())
    const tradeTypeExitStrategyMap = useRef(new Map())
    const falseTradeTypeEntryStrategyMap = useRef(new Map())
    const falseTradeTypeExitStrategyMap = useRef(new Map())


    const exitStrategyMap = useRef(new Map())
    const falseEntryStrategyMap = useRef(new Map())
    const falseExitStrategyMap = useRef(new Map())
    const [prevDayConditions, setPrevDayConditions] = useState("tradingrange")
    const [todaysDayConditions, setTodayDayConditions] = useState("tradingrange")
    const [dayStartConditions, setDayStartConditions] = useState("normal")
    const [imageIndexList, setImageIndexList] = useState([])
    const [stockPriceActionArray, setStockPriceActionArray] = useState([])

    const windowCount = 7;
    const elementIndexArray = useRef([])

    const analyticsChartContainerStockList = useRef([]);
    const analyticsCandlestickSeriesNiftyList = useRef([]);
    const analyticsChartNiftyList = useRef([]);
    const analyticsNineEMALineChartNiftyList = useRef([])
    const analyticsTwentyOneEMALineChartNiftyList = useRef([])

    for (let i = 0; i < windowCount; i++) {
        elementIndexArray.current.push(i);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        analyticsNineEMALineChartNiftyList.current.push(useRef(null))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        analyticsTwentyOneEMALineChartNiftyList.current.push(useRef(null))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        analyticsCandlestickSeriesNiftyList.current.push(useRef(null))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        analyticsChartNiftyList.current.push(useRef(null))
        // eslint-disable-next-line react-hooks/rules-of-hooks
        analyticsChartContainerStockList.current.push(useRef(null))
    }


    const entryOptionsIndexList = [{'id':1},{'id':2},{'id':3}];
    const chartPropertiesNifty = {
        layout: {
            textColor: "white",
            background: { type: "solid", color: "black" }
        },
        autosize: true,
    };

    useEffect( () => {
        for (let i = 0; i < windowCount; i++) {
            analyticsChartNiftyList.current[i].current = createChart(analyticsChartContainerStockList.current[i].current, chartPropertiesNifty);
            analyticsChartNiftyList.current[i].current.resize(window.innerWidth * 0.63, window.innerHeight * 0.4)

            analyticsCandlestickSeriesNiftyList.current[i].current = analyticsChartNiftyList.current[i].current.addSeries(CandlestickSeries,
                {
                    upColor: '#26a69a',
                    downColor: '#ef5350',
                    borderVisible: false,
                    wickUpColor: '#26a69a',
                    wickDownColor: '#ef5350'
                });

            analyticsNineEMALineChartNiftyList.current[i].current = analyticsChartNiftyList.current[i].current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
            analyticsTwentyOneEMALineChartNiftyList.current[i].current = analyticsChartNiftyList.current[i].current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

            const chartOptions = {
                timeScale: {
                    timeVisible: true,
                },
                grid: {
                    vertLines: {
                        style: LineStyle.SparseDotted,
                        visible: true,
                    },
                    horzLines: {
                        style: LineStyle.SparseDotted,
                        visible: true,
                    },
                },
            }

            analyticsChartNiftyList.current[i].current.applyOptions(chartOptions);
            analyticsChartNiftyList.current[i].current.timeScale().fitContent();

            window.addEventListener("load", () => {
                analyticsChartNiftyList.current[i].current.resize(window.innerWidth * 0.63, window.innerHeight * 0.7)
            });


            console.log("Created")
        }
        return () => {
            for (let i = 0; i < windowCount; i++) {
                analyticsChartNiftyList.current.at(i).current.remove();
            }
        }
    }, []);

    const handleZoomChange = useCallback(shouldZoom => {
        setIsZoomed(shouldZoom)
    }, [])

    const handleChartData = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/tools?name=labelstrategy&type=chartdata&tradedate=' + tradeDate, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const stockDataArray = data['response']['price_action'];

                const tempImageIndexList = []
                for(let i = 0; i < windowCount; i++) {
                    tempImageIndexList.push(tradeDate + "_" + i)
                }
                setChartImageIdList(tempImageIndexList);

                const nineEMALine = []
                const twentyOneEMALine = []
                for (let i = 1; i < stockDataArray.length; i++) {
                    nineEMALine.push({time:stockDataArray[i]['time'], value: stockDataArray[i]['ema_9']})
                    twentyOneEMALine.push({time:stockDataArray[i]['time'], value: stockDataArray[i]['ema_21']})
                }

                for(let i = 0; i < windowCount; i++) {
                    let sliceIndexValue = stockDataArray.length-(7-i-1)*5
                    const slicedPriceActionArray = stockDataArray.slice(0, sliceIndexValue)
                    const slicedNineEMALine = nineEMALine.slice(0, sliceIndexValue)
                    const slicedTwentyOneEMALine = twentyOneEMALine.slice(0, sliceIndexValue)

                    analyticsCandlestickSeriesNiftyList.current[i].current.setData(slicedPriceActionArray)
                    analyticsChartNiftyList.current[i].current.timeScale().fitContent();
                    analyticsNineEMALineChartNiftyList.current[i].current.setData(slicedNineEMALine)
                    analyticsTwentyOneEMALineChartNiftyList.current[i].current.setData(slicedTwentyOneEMALine)
                }

            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

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
                const tempImageIndexList = []
                for(let i = 0; i < chart_locations['name'].length; i++) {
                    tempImageIndexList.push(i)
                }
                setImageIndexList(tempImageIndexList);
                setChartImageIdList(chart_locations['id']);
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleChartStrategyDataSubmit = (event) => {
        event.preventDefault();
        const dataToSend = {
            'entryStrategyMap': entryStrategyMap.current,
            'exitStrategyMap': exitStrategyMap.current,
            'falseEntryStrategyMap': falseEntryStrategyMap.current,
            'falseExitStrategyMap': falseExitStrategyMap.current,

            'barEntryStrategyMap': barEntryStrategyMap.current,
            'barExitStrategyMap': barExitStrategyMap.current,
            'falseBarEntryStrategyMap': falseBarEntryStrategyMap.current,
            'falseBarExitStrategyMap': falseBarEntryStrategyMap.current,

            'tradeTypeEntryStrategyMap': tradeTypeEntryStrategyMap.current,
            'tradeTypeExitStrategyMap': tradeTypeExitStrategyMap.current,
            'falseTradeTypeEntryStrategyMap': falseTradeTypeEntryStrategyMap.current,
            'falseTradeTypeExitStrategyMap': falseTradeTypeEntryStrategyMap.current,

            'prevdaycondition': prevDayConditions,
            'daystartcondition': dayStartConditions,
            'todaydaycondition': todaysDayConditions
        };

        const jsonString = JSON.stringify(dataToSend);
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

    const handleTradeTypeEntryStrategy = (event, imageId, stratCount) => {
        if (!tradeTypeEntryStrategyMap.current.has(imageId)) {
            tradeTypeEntryStrategyMap.current[imageId] = new Map();
        }
        tradeTypeEntryStrategyMap.current[imageId][stratCount] = event.target.value;
    }
    const handleTradeTypeExitStrategy = (event, imageId, stratCount) => {
        if (!tradeTypeExitStrategyMap.current.has(imageId)) {
            tradeTypeExitStrategyMap.current[imageId] = new Map();
        }
        tradeTypeExitStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleFalseTradeTypeEntryStrategy = (event, imageId, stratCount) => {
        if (!falseTradeTypeEntryStrategyMap.current.has(imageId)) {
            falseTradeTypeEntryStrategyMap.current[imageId] = new Map();
        }
        falseTradeTypeEntryStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleFalseTradeTypeExitStrategy = (event, imageId, stratCount) => {
        if (!falseTradeTypeExitStrategyMap.current.has(imageId)) {
            falseTradeTypeExitStrategyMap.current[imageId] = new Map();
        }
        falseTradeTypeExitStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleBarEntryStrategy = (event, imageId, stratCount) => {
        if (!barEntryStrategyMap.current.has(imageId)) {
            barEntryStrategyMap.current[imageId] = new Map();
        }
        barEntryStrategyMap.current[imageId][stratCount] = event.target.value;
    }
    const handleBarExitStrategy = (event, imageId, stratCount) => {
        if (!barExitStrategyMap.current.has(imageId)) {
            barExitStrategyMap.current[imageId] = new Map();
        }
        barExitStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleFalseBarEntryStrategy = (event, imageId, stratCount) => {
        if (!falseBarEntryStrategyMap.current.has(imageId)) {
            falseBarEntryStrategyMap.current[imageId] = new Map();
        }
        falseBarEntryStrategyMap.current[imageId][stratCount] = event.target.value;
    }

    const handleFalseBarExitStrategy = (event, imageId, stratCount) => {
        if (!falseBarExitStrategyMap.current.has(imageId)) {
            falseBarExitStrategyMap.current[imageId] = new Map();
        }
        falseBarExitStrategyMap.current[imageId][stratCount] = event.target.value;
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

    const getOptionsInput = (index) => {
        return (
            <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'24%', height:'20%'}}>
                <h5>True Cases</h5>
                {entryOptionsIndexList.map((item, idx) => (
                    <div>
                        <label style={{float:"left", marginTop:'1%'}}>Entry Strat:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id={Math.random()} defaultValue="none" onChange={(e) => handleEntryStrategy(e, chartImageIdList[index], item.id)}>
                            {tradestrategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="BarEntryStrategy" id="barEntryStrategy1" defaultValue="none" onChange={(e) => handleBarEntryStrategy(e, chartImageIdList[index], item.id)}>
                            {getBarEndTimeOption().map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="TradeTypeEntryStrategy" id={'tradeTypeEntryStrategy1'} defaultValue="none" onChange={(e) => handleTradeTypeEntryStrategy(e, chartImageIdList[index], item.id)}>
                            {tradeTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%'}}>Exit Strat:: </label>
                        <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy1" defaultValue="none" onChange={(e) => handleExitStrategy(e, chartImageIdList[index], item.id)}>
                            {tradestrategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="BarExitStrategy" id={'barExitStrategy1'} defaultValue="none" onChange={(e) => handleBarExitStrategy(e, chartImageIdList[index], item.id)}>
                            {getBarEndTimeOption().map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="TradeTypeExitStrategy" id={'tradeTypeExitStrategy1'} defaultValue="none" onChange={(e) => handleTradeTypeExitStrategy(e, chartImageIdList[index], item.id)}>
                        {tradeTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                        </select>
                    </div>
                ))}
                <h5 style={{clear:"both", float:"left", marginTop:'5%'}}>FALSE TRAP Cases</h5>
                <label style={{clear:"both", float:"left", marginTop:'1%'}}>Entry Strat:: </label>
                <select style={{float:"left", marginTop:'1%'}} name="EntryStrategy" id="entryStrategy3" defaultValue="none" onChange={(e) => handleFalseEntryStrategy(e, chartImageIdList[index], 1)}>
                    {tradestrategyoptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="BarExitStrategy" id={'barExitStrategy1'} defaultValue="none" onChange={(e) => handleFalseBarEntryStrategy(e, chartImageIdList[index], 1)}>
                    {getBarEndTimeOption().map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="FalseTradeTypeEntryStrategy" id={'falseTradeTypeEntryStrategy1'} defaultValue="none" onChange={(e) => handleFalseTradeTypeEntryStrategy(e, chartImageIdList[index], 1)}>
                    {tradeTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <label style={{clear:"both", float:"left", marginTop:'1%'}}>Exit Strat:: </label>
                <select style={{float:"left", marginTop:'1%'}} name="ExitStrategy" id="exitStrategy3" defaultValue="none" onChange={(e) => handleFalseExitStrategy(e, chartImageIdList[index], 1)}>
                    {tradestrategyoptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="BarExitStrategy" id={'barExitStrategy1'} defaultValue="none" onChange={(e) => handleFalseBarExitStrategy(e, chartImageIdList[index], 1)}>
                    {getBarEndTimeOption().map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="FalseTradeTypeExitStrategy" id={'falseTradeTypeExitStrategy1'} defaultValue="none" onChange={(e) => handleFalseTradeTypeExitStrategy(e, chartImageIdList[index], 1)}>
                    {tradeTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        )
    }

    return (
        <div>
            <div style={{float:"left", marginBottom:'1%', width:'90%', height:'90%'}}>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'30%', height:'5%'}}>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter Trade Date:
                        <input type="text" value={tradeDate} style={{width:'30%'}} onChange={(e) => setTradeDate(e.target.value)}/>
                    </label>
                    <button type="button" id="getChartData" onClick={handleChartData} title="simtrading" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Get Charts</button>
                    <button type="button" id="getChartData" onClick={handleInputPageRedirection} title="inputPage" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Back to Input</button>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'30%', height:'5%'}} >
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
                    <label style={{clear:"both", float:"left", marginLeft:'1%'}}>Today's Day Condition :: </label>
                    <select style={{ float:"left", marginTop:'1%'}} name="TodaysDayState" id="todaysDayState" defaultValue="tradingrange" onChange={(e) => setTodayDayConditions(e.target.value)}>
                        {previousDayOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button type="button" id="dataSubmit" onClick={handleChartStrategyDataSubmit} title="datasubmit" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Submit CHART Strategies </button>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'95%', height:'90%'}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'25%'}} ref={analyticsChartContainerStockList.current[0]}>
                    </div>
                    {getOptionsInput(0)}
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'25%'}} ref={analyticsChartContainerStockList.current[1]}>
                    </div>
                    {getOptionsInput(1)}
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'25%'}} ref={analyticsChartContainerStockList.current[2]}>
                    </div>
                    {getOptionsInput(2)}
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'25%'}} ref={analyticsChartContainerStockList.current[3]}>
                    </div>
                    {getOptionsInput(3)}
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'25%'}} ref={analyticsChartContainerStockList.current[4]}>
                    </div>
                    {getOptionsInput(4)}
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'25%'}} ref={analyticsChartContainerStockList.current[5]}>
                    </div>
                    {getOptionsInput(5)}
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'75%', height:'25%'}} ref={analyticsChartContainerStockList.current[6]}>
                    </div>
                    {getOptionsInput(6)}

                </div>
            </div>
        </div>

    );
};

export default LabelStrategy;