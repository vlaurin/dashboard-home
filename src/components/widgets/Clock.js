import React from 'react';
import fecha from 'fecha';

const refreshInterval = 1000;

class Clock extends React.Component {
    constructor() {
        super();
        this.state = {
            now: new Date(),
        };
    }

    componentDidMount() {
        this.updateNow();

        const refreshIntervalId  = setInterval(() => this.updateNow(), refreshInterval);
        this.setState(Object.assign({}, this.state, { refreshIntervalId }));
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshIntervalId);
    }

    updateNow() {
        this.setState({
            now: new Date(),
        });
    }

    render() {
        return (
            <div className="card-body text-center">
                <div className="row align-items-center">
                    <div className="col">
                        <h3 className="display-3">
                            {fecha.format(this.state.now, 'hh:mm')}
                            <small className="text-muted">
                                {fecha.format(this.state.now, 'a')}
                            </small>
                        </h3>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md">
                        <h4>
                            {fecha.format(this.state.now, 'dddd MMMM Do, YYYY')}
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default Clock;
