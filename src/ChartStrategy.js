import { useState, useEffect, useRef } from "react";
import AnalyticsPage from "./AnalyticsPage";

const ChartStrategy = () => {
    const [tradeDate, setTradeDate] = useState("19-03-2025")
    const [chartImageList, setChartImageList] = useState([]);
    const [ipAddress, setIpAddress] = useState("192.168.1.8");

    const handleChartImage = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/tools?name=labelstrategy&tradedate=' + tradeDate, {
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

                const chart_locations = data['response']
                console.log(chart_locations)
                setChartImageList(chart_locations);
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }

    return (
        <div>
            <div style={{float:"left", marginBottom:'1%', width:'90%', height:'90%'}}>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'5%'}}>
                    <label style={{float:"left", marginLeft:'1%'}}>Enter Trade Date:
                        <input type="text" value={tradeDate} style={{width:'30%'}} onChange={(e) => setTradeDate(e.target.value)}/>
                    </label>
                    <button type="button" onClick={handleChartImage} title="simtrading" style={{float:"left", clear:"both", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Get Charts</button>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'20%'}}>
                    <img src={chartImageList[0]} alt="Image-1"/>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'20%'}}>
                    <img src={chartImageList[1]} alt="Image-2"/>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'20%'}}>
                    <img src={chartImageList[2]} alt="Image-3"/>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'20%'}}>
                    <img src={chartImageList[3]} alt="Image-4"/>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'20%'}}>
                    <img src={chartImageList[4]} alt="Image-5"/>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'20%'}}>
                    <img src={chartImageList[5]} alt="Image-6"/>
                </div>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', width:'84%', height:'20%'}}>
                    <img src={chartImageList[6]} alt="Image-7"/>
                </div>
            </div>
        </div>

    );
};

export default ChartStrategy;