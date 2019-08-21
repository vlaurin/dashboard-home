import React from 'react';
import PropTypes from 'prop-types';

class CountDownDays extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.refreshCount();

        const {
            refreshInterval,
        } = this.props;

        const refreshIntervalId  = setInterval(() => this.refreshCount(), refreshInterval);
        this.setState(Object.assign({}, this.state, { refreshIntervalId }));
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshIntervalId);
    }

    refreshCount () {
        const {
            until,
        } = this.props;

        const now = Date.now();

        const remainingMs = until - now;
        const remainingDays = Math.max(0, Math.floor(remainingMs/(1000 * 60 * 60 * 24)));

        this.setState(Object.assign({}, this.state, { remainingDays }));
    }

    render() {
        const days = this.state.remainingDays;
        return (
            <div className="card-body text-center">
                <div className="row align-items-center">
                    <div className="col-md">
                        <span className="display-2">
                            {`${days} ${1 >= days ? 'day' : 'days'}`}
                        </span>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md">
                        <h3 className="display-5">
                            <small>until</small> {this.props.title}
                        </h3>
                    </div>
                </div>
            </div>
        );
    }
}

CountDownDays.propTypes = {
    title: PropTypes.string.isRequired,
    until: PropTypes.instanceOf(Date).isRequired,
    refreshInterval: PropTypes.number,
};

CountDownDays.defaultProps = {
    refreshInterval: 10000,
};

export default CountDownDays;
