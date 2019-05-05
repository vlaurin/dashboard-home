import React from 'react';
import PropTypes from 'prop-types';

class YoutubeSubCountDown extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
        const {
            refreshInterval,
        } = this.props;

        this.loadStats();

        const refreshIntervalId  = setInterval(() => this.loadStats(), refreshInterval);
        this.setState(Object.assign({}, this.state, { refreshIntervalId }));
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshIntervalId);
    }

    loadStats () {
        if (this.state.loading) {
            return; // Skip
        }

        const {
            channelId,
            apiKey,
        } = this.props;

        this.setState(Object.assign({}, this.state, { loading: true }));

        fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`)
            .then(res => res.ok ? res : Promise.reject(res.statusText))
            .then(res => res.json())
            .then(body => this.extractStats(body))
            .then(stats => {
                if (stats) {
                    this.setState({
                        lastUpdate: new Date(),
                        stats,
                    });
                }
            })
            .catch(error => console.error(`Failed to retrieve stats from Youtube:`, error))
            .then(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    extractStats(body) {
        const {
            targetSubCount
        } = this.props;

        const subCount = body.items[0].statistics.subscriberCount;

        return {
            subCount,
            diff: targetSubCount - subCount,
        };
    }

    render() {
        if (!this.state.stats) {
            return null;
        }

        const {
            displayName,
            message
        } = this.props;

        return (
            <div className="card-body text-center">
                <div className="row align-items-center">
                    <div className="col-md">
                        <h3 className="display-5">
                            {displayName}
                        </h3>
                        {formatNumber(this.state.stats.subCount)}
                    </div>
                    <div className="col-md">
                        <h4 className="display-5">
                            {message}
                        </h4>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md">
                        <span className="display-3">
                            {formatNumber(this.state.stats.diff)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

YoutubeSubCountDown.propTypes = {
    channelId: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    targetSubCount: PropTypes.number.isRequired,
    message: PropTypes.string,
    refreshInterval: PropTypes.number,
};

YoutubeSubCountDown.defaultProps = {
    message: '',
    refreshInterval: 60000,
};

const formatNumber = x => {
    if ('number' === typeof x) {
        x = x.toString();
    }

    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default YoutubeSubCountDown;
