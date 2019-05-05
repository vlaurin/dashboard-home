import React, { Component } from 'react';
import DazzleDashboard from 'react-dazzle';
import Container from './Container';
import SmashingFrame from './frames/SmashingFrame';
import faBus from '@fortawesome/fontawesome-free-solid/faBus';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faSun from '@fortawesome/fontawesome-free-solid/faSun';
import faRecycle from '@fortawesome/fontawesome-free-solid/faRecycle';
import faYoutube from '@fortawesome/fontawesome-free-brands/faYoutube';
import Clock from './widgets/Clock';
import TflStopPointArrivals from './widgets/TflStopPointArrivals';
import OpenWeatherCurrent from './widgets/OpenWeatherCurrent';
import KingstonRubbishCollectionCalendar from './widgets/KingstonRubbishCollectionCalendar';
import YoutubeSubCountDown from './widgets/YoutubeSubCountDown';

class Dashboard extends Component {

    constructor() {
        super();

        this.state = {
            widgets: {
                Clock: {
                    type: Clock,
                    title: 'Clock',
                    frameSettings: {
                        icon: faClock,
                        colour: 'blue',
                    },
                },
                RubbishCollection: {
                    type: KingstonRubbishCollectionCalendar,
                    title: 'Rubbish collection',
                    frameSettings: {
                        icon: faRecycle,
                        colour: 'green',
                    },
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
                    },
                    frameSettings: {
                        icon: faBus,
                        colour: 'red',
                    },
                },
                Pewds100M: {
                    type: YoutubeSubCountDown,
                    title: 'Pewds 100M countdown',
                    props: {
                        channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
                        displayName: 'Pewds',
                        targetSubCount: 100000000,
                        message: 'To 100M:',
                        apiKey: process.env.REACT_APP_YOUTUBE_API_KEY,
                    },
                    frameSettings: {
                        icon: faYoutube,
                        colour: 'red',
                    },
                },
                OpenWeatherCurrent: {
                    type: OpenWeatherCurrent,
                    title: 'Current weather',
                    props: {
                        latitude: parseFloat(process.env.REACT_APP_OPEN_WEATHER_LAT),
                        longitude: parseFloat(process.env.REACT_APP_OPEN_WEATHER_LON),
                        apiKey: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
                    },
                    frameSettings: {
                        icon: faSun,
                        colour: 'orange',
                    },
                },
            },
            layout: {
                rows: [
                    {
                        columns: [
                            {
                                className: 'col-md',
                                widgets: [{key: 'Clock'}, {key: 'RubbishCollection'}],
                            },
                            {
                                className: 'col-md',
                                widgets: [{key: 'OpenWeatherCurrent'}, {key: 'Pewds100M'}],
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
                    frameComponent={SmashingFrame}
                    widgets={this.state.widgets}
                    layout={this.state.layout}
                />
            </Container>
        );
    }
}

export default Dashboard;
