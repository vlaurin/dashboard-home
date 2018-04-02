import React from 'react';
import PropTypes from 'prop-types';

class TflStopPointArrivals extends React.Component {

    constructor() {
        super();
        this.state = {
            arrivals: [],
            loading: false,
        };
    }

    componentDidMount() {
        const {
            lineIds,
            limit,
        } = this.props;

        this.filter = filterArrivals(lineIds);
        this.limit = limitArrivals(limit);

        this.loadArrivals();

        const {
            refreshInterval,
        } = this.props;

        const refreshIntervalId  = setInterval(() => this.loadArrivals(), refreshInterval);
        this.setState(Object.assign({}, this.state, { refreshIntervalId }));
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshIntervalId);
    }

    loadArrivals () {
        if (this.state.loading) {
            return; // Skip
        }

        const {
            stopPointId,
        } = this.props;

        this.setState(Object.assign({}, this.state, { loading: true }));

        fetch(`https://api.tfl.gov.uk/StopPoint/${stopPointId}/arrivals`)
            .then(res => res.ok ? res : Promise.reject(res.statusText))
            .then(res => res.json())
            .then(this.filter)
            .then(sortArrivals)
            .then(this.limit)
            .then(arrivals => {
                if (arrivals) {
                    this.setState({
                        arrivals,
                        loading: false,
                    });
                }
            })
            .catch(error => console.error(`Failed to retrieve arrivals for stop ${stopPointId}:`, error));
    }

    render() {
        return (
            <ul className="list-group list-group-flush">
                {this.state.arrivals.map((arrival, index) => (
                    <li key={arrival.id} className="list-group-item" style={!index ? nextArrivalStyle : null}>
                        <strong>{arrival.lineName}</strong>
                        {formatTimeToStation(arrival)}
                    </li>
                ))}
            </ul>
        );
    }
}

TflStopPointArrivals.propTypes = {
    stopPointId: PropTypes.string.isRequired,
    refreshInterval: PropTypes.number,
    lineIds: PropTypes.arrayOf(PropTypes.string),
    limit: PropTypes.number,
};

TflStopPointArrivals.defaultProps = {
    refreshInterval: 10000,
    lineIds: null,
    limit: 3
};

const nextArrivalStyle = {
    fontSize: '2rem',
    fontWeight: '500',
    lineHeight: '1.5',
};

const filterArrivals = lineIds => arrivals => arrivals.filter(arrival => !lineIds || lineIds.includes(arrival.lineId));

const sortArrivals = arrivals => arrivals.sort((a, b) => a.timeToStation - b.timeToStation);

const limitArrivals = limit => arrivals => arrivals.slice(0, limit);

const formatTimeToStation = arrival => {
    const minutesLeft = Math.round(arrival.timeToStation / 60);
    return (
        <span className="float-right">{displayTime(minutesLeft)}</span>
    );
};

const displayTime = minutesLeft => {
    switch (minutesLeft) {
        case 0:
            return 'Due';
        case 1:
            return '1 min';
        default:
            return `${minutesLeft} mins`
    }
};

export default TflStopPointArrivals;
