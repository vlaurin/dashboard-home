import React, { Component } from 'react';
import DazzleDashboard from 'react-dazzle';
import HelloWorld from './widgets/HelloWorld';
import Container from './Container';
import CardFrame from './frames/CardFrame';
import TflStopPointArrivals from './widgets/TflStopPointArrivals';
import OpenWeatherCurrent from './widgets/OpenWeatherCurrent';

class Dashboard extends Component {

    constructor() {
        super();

        this.state = {
            widgets: {
                HelloWorld: {
                    type: HelloWorld,
                    title: 'Test widget',
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
                                widgets: [{key: 'TflStopPointArrivals'}],
                            },
                            {
                                className: 'col-md',
                                widgets: [{key: 'OpenWeatherCurrent'}],
                            },
                            {
                                className: 'col-md',
                                widgets: [{key: 'HelloWorld'}],
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
