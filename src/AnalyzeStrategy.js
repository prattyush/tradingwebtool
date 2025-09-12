import {useState, useCallback, useRef, useEffect} from "react";
import {useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    strategyoptions,
    previousDayOptions,
    todayStartOptions,
    baroptions,
    windowtimeoptions, tradestrategyoptions
} from "./StrategyVariables";
import {CandlestickSeries, createChart, createSeriesMarkers, LineSeries, LineStyle} from "lightweight-charts";

const AnalyzeStrategy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const ipAddress = location.state['ipAddress'];
    const [prevDayCondition, setPrevDayCondition] = useState("any")
    const [dayStartCondition, setDayStartCondition] = useState("any")
    const [barOption, setBarOption] = useState("1")
    const [strategyOption, setStrategyOption] = useState("none")

    const windowCount = 15;
    const elementIndexArray = useRef([])
    const stockChartIndexArray = useRef(new Set())
    const analyticsChartContainerStockList = useRef([]);
    const analyticsCandlestickSeriesNiftyList = useRef([]);
    const analyticsChartNiftyList = useRef([]);
    const analyticsNineEMALineChartNiftyList = useRef([])
    const analyticsTwentyOneEMALineChartNiftyList = useRef([])

    for (let i = 0; i < windowCount; i++) {
        elementIndexArray.current.push(i);
        stockChartIndexArray.current.add(parseInt((i/2).toString()))
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
            //analyticsChartNiftyList.current[i].current.resize(window.innerWidth * 0.4, window.innerHeight * 0.4)

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
                analyticsChartNiftyList.current[i].current.resize(window.innerWidth * 0.4, window.innerHeight * 0.4)
            });


            console.log("Created")
        }
        return () => {
            for (let i = 0; i < windowCount; i++) {
                analyticsChartNiftyList.current.at(i).current.remove();
            }
        }
    }, []);

    const handleAnalyzeStrategy = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/tools?name=analyzestrategy&type=analyze&prevdaycondition='
            + prevDayCondition + "&daystartcondition=" + dayStartCondition + "&strategy=" + strategyOption + "&windowcount=" + barOption, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const strategyDataMapResponse = data['response']

                let windowCount = -1
                for (const tradeDate of Object.keys(strategyDataMapResponse)) {
                    windowCount++;
                    const stockDataArray = strategyDataMapResponse[tradeDate]['price_action'];
                    const entriesArray = strategyDataMapResponse[tradeDate]['entries']
                    const exitsArray = strategyDataMapResponse[tradeDate]['exits']

                    const nineEMALine = []
                    const twentyOneEMALine = []
                    for (let i = 1; i < stockDataArray.length; i++) {
                        nineEMALine.push({time:stockDataArray[i]['time'], value: stockDataArray[i]['ema_9']})
                        twentyOneEMALine.push({time:stockDataArray[i]['time'], value: stockDataArray[i]['ema_21']})
                    }

                    const entryMarkerList = getMarkerObjectFromArray(entriesArray, 'entry')
                    const exitMarkerList = getMarkerObjectFromArray(exitsArray, 'exit')

                    analyticsCandlestickSeriesNiftyList.current[windowCount].current.setData(stockDataArray)
                    analyticsNineEMALineChartNiftyList.current[windowCount].current.setData(nineEMALine)
                    analyticsTwentyOneEMALineChartNiftyList.current[windowCount].current.setData(twentyOneEMALine)

                    createSeriesMarkers(analyticsCandlestickSeriesNiftyList.current[windowCount].current, entryMarkerList);
                    createSeriesMarkers(analyticsCandlestickSeriesNiftyList.current[windowCount].current, exitMarkerList);

                    analyticsChartNiftyList.current[windowCount].current.timeScale().fitContent();
                }
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const getMarkerObjectFromArray = (valueArray, type) => {
        let shape = 'arrowUp'
        let color = '#2196F3'
        let text = 'Buy'
        let stockText = 'Buy'
        let stockColor = '#2196F3'
        let position = 'belowBar'
        const markerSize = 0.1;

        let priceVariable = 'close_price';

        if (type === 'exit') {
            shape = 'arrowDown';
            color = '#e91e63'
            stockColor = '#e91e63'
            text = 'Sell'
            stockText = 'Sell'
            priceVariable = 'open_price';
            position = 'aboveBar';
        }
        const markersList = []

        for (let i = 0; i < valueArray.length; i++) {
            markersList.push({
                time: valueArray[i]['time'],
                price: valueArray[i][priceVariable],
                position: position,
                color: stockColor,
                size: markerSize,
                shape: shape,
                text: stockText
            })
        }

        return markersList;
    }

    const handleInputPageRedirection = (event) => {
        event.preventDefault();
        navigate("/");
    }

    return (
        <div>
            <div style={{float:"left", marginBottom:'1%', width:'99%', height:'99%' }}>
                <div style={{float:"left", marginBottom:'1%', width:'99%', height:'20%', border: '1px solid black',}}>
                    <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'20%', height:'5%', border: '1px solid black',}}>
                        <label style={{float:"left", marginLeft:'1%'}}>Select Details And Submit Date:
                        </label>
                        <button type="button" id="analyzestrategy" onClick={handleAnalyzeStrategy} title="analyzeStrategy" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Submit</button>
                        <button type="button" id="backToInput" onClick={handleInputPageRedirection} title="inputPage" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Back to Input</button>
                    </div>
                    <div style={{float:"left", marginBottom:'1%', width:'70%', height:'10%', border: '1px solid black',}}>
                        <label style={{float:"left", marginTop:'1%', marginLeft:'1%'}}>Previous Day Conditions :: </label>
                        <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="PreviousDayState" id="previousDayState" defaultValue="any" onChange={(e) => setPrevDayCondition(e.target.value)}>
                            {previousDayOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{float:"left", marginTop:'1%', marginLeft:'1%'}}>Today's Start Conditions :: </label>
                        <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="DayStartConditions" id="dayStartConditions" defaultValue="any" onChange={(e) => setDayStartCondition(e.target.value)}>
                            {todayStartOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{clear:"both", float:"left", marginTop:'1%', marginLeft:'1%'}}>Ending Time Window :: </label>
                        <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="BarOptions" id="barOptions" defaultValue="1" onChange={(e) => setBarOption(e.target.value)}>
                            {windowtimeoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <label style={{float:"left", marginTop:'1%', marginLeft:'1%'}}>Strategy :: </label>
                        <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="StrategyOptions" id="strategyOptions" defaultValue="1" onChange={(e) => setStrategyOption(e.target.value)}>
                            {tradestrategyoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'98%', height:'120%', border: '1px solid black'}}>
                    {elementIndexArray.current.map((indx) => (
                        <div style={{float:"left", marginTop:'1%', marginBottom:'1%', marginLeft:'1%', marginRight:'1%', border: '1px solid black',}} ref={analyticsChartContainerStockList.current[indx]}></div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default AnalyzeStrategy;