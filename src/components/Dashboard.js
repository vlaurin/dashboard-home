import React, { Component } from 'react';
import DazzleDashboard from 'react-dazzle';
import Container from './Container';
import CardFrame from './frames/CardFrame';
import Clock from './widgets/Clock';
import TflStopPointArrivals from './widgets/TflStopPointArrivals';
import OpenWeatherCurrent from './widgets/OpenWeatherCurrent';

class Dashboard extends Component {

    constructor() {
        super();

        this.state = {
            widgets: {
                Clock: {
                    type: Clock,
                    title: 'Clock',
                },
                TflStopPointArrivals: {
                    type: TflStopPointArrivals,
                    title: 'Next bus',
                    props: {
                        stopPointId: '490011348E',
                        lineIds: [
                            '131',
                            '152',
                        ],
                    }
                },
                OpenWeatherCurrent: {
                    type: OpenWeatherCurrent,
                    title: 'Current weather',
                    props: {
                        latitude: parseFloat(process.env.REACT_APP_OPEN_WEATHER_LAT),
                        longitude: parseFloat(process.env.REACT_APP_OPEN_WEATHER_LON),
                        apiKey: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
                    }
                },
            },
            layout: {
                rows: [
                    {
                        columns: [
                            {
                                className: 'col-md',
                                widgets: [{key: 'Clock'}],
                            },
                            {
                                className: 'col-md',
                                widgets: [{key: 'OpenWeatherCurrent'}],
                            },
                            {
                                className: 'col-md',
                                widgets: [{key: 'TflStopPointArrivals'}],
                            },
                        ],
                    },
                ],
            }
        };
    }

    render() {
        return (
            <Container>
                <DazzleDashboard
                    frameComponent={CardFrame}
                    widgets={this.state.widgets}
                    layout={this.state.layout}
                />
            </Container>
        );
    }
}

export default Dashboard;
