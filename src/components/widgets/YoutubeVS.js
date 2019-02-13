import React from 'react';
import PropTypes from 'prop-types';

class YoutubeVS extends React.Component {

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
            contender1,
            contender2,
            apiKey,
        } = this.props;

        this.setState(Object.assign({}, this.state, { loading: true }));

        fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${contender1.channelId}%2C${contender2.channelId}&key=${apiKey}`)
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
            contender1,
            contender2,
        } = this.props;

        const contender1Views = body.items.find(i => contender1.channelId === i.id).statistics.subscriberCount;
        const contender2Views = body.items.find(i => contender2.channelId === i.id).statistics.subscriberCount;

        return {
            contender1: {
                displayName: contender1.displayName,
                viewCount: contender1Views,
            },
            contender2: {
                displayName: contender2.displayName,
                viewCount: contender2Views,
            },
            diff: contender1Views - contender2Views,
        };
    }

    render() {
        if (!this.state.stats) {
            return null;
        }

        return (
            <div className="card-body text-center">
                <div className="row align-items-center">
                    <div className="col-md">
                        <h3 className="display-5">
                            {this.state.stats.contender1.displayName}
                        </h3>
                        {formatNumber(this.state.stats.contender1.viewCount)}
                    </div>
                    <div className="col-md">
                        <h3 className="display-5">
                            {this.state.stats.contender2.displayName}
                        </h3>
                        {formatNumber(this.state.stats.contender2.viewCount)}
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

YoutubeVS.propTypes = {
    contender1: PropTypes.shape({
        channelId: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
    }).isRequired,
    contender2: PropTypes.shape({
        channelId: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
    }).isRequired,
    refreshInterval: PropTypes.number,
};

YoutubeVS.defaultProps = {
    refreshInterval: 10000,
};

const formatNumber = x => {
    if ('number' === typeof x) {
        x = x.toString();
    }

    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default YoutubeVS;
