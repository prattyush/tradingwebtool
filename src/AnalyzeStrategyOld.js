import { useState, useCallback, useRef } from "react";

import {
    strategyoptions,
    previousDayOptions,
    todayStartOptions,
    baroptions,
    windowtimeoptions
} from "./StrategyVariables";

const AnalyzeStrategyOld = () => {
    const [prevDayCondition, setPrevDayCondition] = useState("tradingrange")
    const [dayStartCondition, setDayStartCondition] = useState("normal")
    const [barOption, setBarOption] = useState("1")
    const [strategyOption, setStrategyOption] = useState("none")
    const [chartImageList, setChartImageList] = useState([]);
    const [ipAddress, setIpAddress] = useState("192.168.1.10");

    const handleAnalyzeStrategy = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/tools?name=labelstrategy&type=analyze&prevdaycondition='
            + prevDayCondition + "&daystartcondition=" + dayStartCondition + "&strategy=" + strategyOption + "&windowcount=" + barOption, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const chart_locations = data['response']
                const imageList = []
                for (let i = 0; i < chart_locations['name'].length; i++) {
                    const imageMap = new Map()
                    imageMap['name'] =  chart_locations['name'][i]
                    imageMap['id'] =  chart_locations['id'][i]

                    imageList.push(imageMap)
                }
                setChartImageList(imageList)
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    function importAll(r) {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    }
    const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/));

    return (
        <div>
            <div style={{float:"left", marginBottom:'1%', width:'90%', height:'90%'}}>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'20%', height:'5%'}}>
                    <label style={{float:"left", marginLeft:'1%'}}>Select Details And Submit Date:
                    </label>
                    <button type="button" id="analyzestrategy" onClick={handleAnalyzeStrategy} title="analyzeStrategy" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Submit</button>
                </div>
                <div style={{float:"left", marginBottom:'1%', width:'70%', height:'10%'}}>
                    <label style={{float:"left", marginTop:'1%', marginLeft:'1%'}}>Previous Day Conditions :: </label>
                    <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="PreviousDayState" id="previousDayState" defaultValue="tradingrange" onChange={(e) => setPrevDayCondition(e.target.value)}>
                        {previousDayOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <label style={{float:"left", marginTop:'1%', marginLeft:'1%'}}>Today's Start Conditions :: </label>
                    <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="DayStartConditions" id="dayStartConditions" defaultValue="normal" onChange={(e) => setDayStartCondition(e.target.value)}>
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
                        {strategyoptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'98%', height:'95%'}}>
                    {chartImageList.map((item) => (
                        <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'50%', height:'20%'}}>
                            <img style={{float:"left", width:'98%', height:'25%'}} src={images[item['name']]} alt={item['id']}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default AnalyzeStrategyOld;