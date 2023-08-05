import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { messageCountList, channels } from './data';

const getFilteredChannels = (messageCountList, channels) => {
    return channels.filter((channel) => {
        const dates = messageCountList
            .filter((msg) => msg.channelId === channel.value)
            .map((msg) => msg.timeBucket);
        return new Set(dates).size > 1;
    });
};

const getSeriesData = (filteredChannels, messageCountList) => {
    return filteredChannels.map((channel) => {
        return {
            name: channel.name,
            data: messageCountList
                .filter((msg) => msg.channelId === channel.value)
                .map((msg) => [
                    Date.parse(msg.timeBucket),
                    parseInt(msg.count, 10),
                ]),
        };
    });
};

const EngagementMessagesOverTime = () => {
    const filteredChannels = getFilteredChannels(messageCountList, channels);

    const seriesData = getSeriesData(filteredChannels, messageCountList);

    const options = {
        chart: {
            type: 'line',
        },
        title: {
            text: 'Engagement Messages Over Time',
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date',
            },
        },
        yAxis: {
            title: {
                text: 'Message Count',
            },
        },
        tooltip: {
            formatter: function () {
                const date = Highcharts.dateFormat('%e %b', new Date(this.x));
                return `<b>${this.series.name}</b><br />${this.y} messages on ${date}`;
            },
        },
        series: seriesData,
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default React.memo(EngagementMessagesOverTime);
