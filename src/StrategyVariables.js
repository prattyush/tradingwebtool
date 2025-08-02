
export const strategyoptions = [
    { value: 'none', label: 'none' },
    { value: 'breakout', label: 'breakout' },
    { value: 'support', label: 'support' },
    { value: 'double-tb', label: 'double-tb' },
    { value: 'opening-tradingrange', label: 'open-tradingrange' },
    { value: 'tradingrange', label: 'tradingrange' },
    { value: 'opening-reversal', label: 'opening-reversal' },
    { value: 'resistance', label: 'resistance' },
    { value: 'trend-continuation', label: 'trend-continuation' },
    { value: 'exhaustionbar-reversal', label: 'exhaustionbar-reversal' },
    { value: 'surprise-bar-reversal', label: 'surprise-bar-reversal' },
    { value: 'towards-yesterday-close', label: 'towards-yesterday-close' },
    { value: 'stoploss-hit-reversal', label: 'stoploss-hit-reversal' },
    { value: 'wedge-reversal', label: 'wedge-reversal' },
    { value: 'EMALine', label: 'EMALine' },
    { value: '2ndLeg', label: '2ndLeg' },
    { value: 'all', label: 'all' },
];

export const baroptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
];

export const windowtimeoptions = [
    { value: '1', label: '09:30' },
    { value: '2', label: '09:45' },
    { value: '3', label: '10:00' },
    { value: '4', label: '10:15' },
    { value: '5', label: '10:30' },
    { value: '6', label: '10:45' },
    { value: '7', label: '11:00' },
    { value: 'any', label: 'any' },
];

export const optionstype = [
    { value: 'Call', label: 'Call' },
    { value: 'Put', label: 'Put' },
];

export const ordertype = [
    { value: 'R', label: 'R' },
    { value: 'RT', label: 'RT' },
    { value: 'RL', label: 'RL' },
];

export const getBarEndTimeOption = () => {
    const barEndTimeOption = []
    const chartTime = new Date(); // Gets current date and time
    chartTime.setHours(9); // Sets hour to 9 AM
    chartTime.setMinutes(15); // Sets minutes to 30
    chartTime.setSeconds(0); // Sets seconds to 0
    chartTime.setMilliseconds(0);

    for (let i = 0; i < 90; i++) {
        const entryMap = new Map();
        let hours = chartTime.getHours().toString();
        let minutes = chartTime.getMinutes().toString();
        if (chartTime.getHours() < 10) {
            hours = "0" + hours;
        }
        if (chartTime.getMinutes() < 10) {
            minutes = "0" + minutes;
        }

        entryMap['value'] = hours + ":" + minutes;
        entryMap['label'] = hours + ":" + minutes;

        chartTime.setMinutes(chartTime.getMinutes() + 3)
        barEndTimeOption.push(entryMap);
    }
    return barEndTimeOption;
}

export const barendimeoptions = [
    { value: '1', label: '09:30' },
    { value: '2', label: '09:45' },
    { value: '3', label: '10:00' },
    { value: '4', label: '10:15' },
    { value: '5', label: '10:30' },
    { value: '6', label: '10:45' },
    { value: '7', label: '11:00' },
    { value: 'any', label: 'any' },
];

export const tradeTypeOptions = [
    { value: 'none', label: 'none' },
    { value: 'buy', label: 'buy' },
    { value: 'sell', label: 'sell' }
];

export const previousDayOptions = [
    { value: 'any', label: 'any' },
    { value: 'tradingrange', label: 'tradingrange' },
    { value: 'strong-bull-trend', label: 'strong-bull-trend' },
    { value: 'strong-bear-trend', label: 'strong-bear-trend' },
    { value: 'weak-bull-trend', label: 'weak-bull-trend' },
    { value: 'weak-bear-trend', label: 'weak-bear-trend' },
    { value: 'gap-down-trend', label: 'gap-down-trend' },
    { value: 'gap-up-trend', label: 'gap-up-trend' },
    { value: 'gap-down-tradingrange', label: 'gap-down-tradingrange' },
    { value: 'gap-up-tradingrange', label: 'gap-up-tradingrange' },
    { value: 'bull-trend-tradingrange', label: 'bull-trend-tradingrange' },
    { value: 'bear-trend-tradingrange', label: 'bear-trend-tradingrange' },
    { value: 'tradingrange-bull-breakout', label: 'tradingrange-bull-breakout' },
    { value: 'tradingrange-bear-breakout', label: 'tradingrange-bear-breakout' }
];

export const todayStartOptions = [
    { value: 'any', label: 'any' },
    { value: 'big-gap-down', label: 'big-gap-down' },
    { value: 'big-gap-up', label: 'big-gap-up' },
    { value: 'minor-gap-down', label: 'minor-gap-down' },
    { value: 'minor-gap-up', label: 'minor-gap-up' },
    { value: 'within-prevday-range', label: 'within-prevday-range' },
    { value: 'normal', label: 'normal' }
];
