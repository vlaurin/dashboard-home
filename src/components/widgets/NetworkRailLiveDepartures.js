import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faArrowsAltH from '@fortawesome/fontawesome-free-solid/faArrowsAltH';

class NetworkRailLiveDepartures extends React.Component {
    constructor() {
        super();
        this.state = {
            services: [],
            loading: false,
        };
    }

    componentDidMount() {
        this.loadDepartures();

        const {
            refreshInterval,
        } = this.props;

        const refreshIntervalId  = setInterval(() => this.loadDepartures(), refreshInterval);
        this.setState(Object.assign({}, this.state, { refreshIntervalId }));
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshIntervalId);
    }

    loadDepartures() {
        if (this.state.loading) {
            return;
        }

        const {
            stationCrs,
            limit,
            platforms,
            apiKey,
        } = this.props;

        this.setState(Object.assign({}, this.state, { loading: true }));

        fetch(`https://api.departureboard.io/api/v2.0/getDeparturesByCRS/${stationCrs}?apiKey=${apiKey}&numServices=${limit}`)
            .then(res => {
                // DEBUG
                this.setState(Object.assign({}, this.state, {res, at: new Date()}));
                console.log(res);
                return res;
            })
            .then(res => res.ok ? res : Promise.reject(res.statusText))
            .then(res => res.json())
            .then(departures => Array.isArray(departures.trainServices) ? departures.trainServices : [])
            .then(filterServices(platforms))
            .then(services => {
                this.setState(Object.assign({}, this.state, {
                    lastUpdate: new Date(),
                    services,
                    loading: false,
                }));
            })
            .catch(error => {
                console.error(`Failed to retrieve departues for station ${stationCrs}:`, error);
                this.setState(Object.assign({}, this.state, {
                    loading: false,
                    error: (error instanceof Error ? error.toString() : JSON.stringify(error)),
                }));
            });
    }

    render() {
        return (
            <Fragment>
                <ul className="list-group list-group-flush">
                    {this.state.services.map((service) => (
                        <li key={service.serviceID}
                            className="list-group-item"
                            style={style.departure}>
                            <span style={style.eta}>{eta(service)}</span>
                            <strong style={style.destination}>{service.destination[0].locationName}</strong>
                            <br/>
                            <small><FontAwesomeIcon icon={faArrowsAltH}/> {service.length} | <FontAwesomeIcon icon={faClock}/> {service.std}</small>
                        </li>
                    ))}
                </ul>
                {this.renderDebug()}
            </Fragment>
        );
    }

    renderDebug() {
        return (
            <table>
                <tbody>
                    <tr>
                        <th>Status</th>
                        <td>{this.state.res ? this.state.res.status : ''}</td>
                    </tr>
                    <tr>
                        <th>At</th>
                        <td>{this.state.at ? this.state.at.toISOString() : ''}</td>
                    </tr>
                    <tr>
                        <th>Last error</th>
                        <td>{this.state.error}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

NetworkRailLiveDepartures.propTypes = {
    stationCrs: PropTypes.string.isRequired,
    refreshInterval: PropTypes.number,
    limit: PropTypes.number,
    filterPlatforms: PropTypes.arrayOf(PropTypes.string)
};

NetworkRailLiveDepartures.defaultProps = {
    refreshInterval: 15000,
    limit: 5,
    filterPlatforms: null,
};

const style = {
    departure: {
        fontSize: '1rem',
        fontWeight: '200',
        lineHeight: '1',
    },
    destination: {
        fontSize: '1.6rem',
        fontWeight: '500',
    },
    eta: {
        fontSize: '2.6rem',
        fontWeight: '500',
        float: 'right',
        fontFamily: 'Monaco',
    }
};

const filterServices = (platforms) => (services) => services.filter(service => !platforms || platforms.includes(service.platform));

const eta = (service) => "ON TIME" === service.etd.toUpperCase() ? service.std : service.etd;

export default NetworkRailLiveDepartures;
