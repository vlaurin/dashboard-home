import React from 'react';
import PropTypes from 'prop-types';

class OpenWeatherCurrent extends React.Component {

    constructor() {
        super();
        this.state = {
            weather: {},
            loading: false,
        };
    }

    componentDidMount() {
        this.loadWeather();

        const {
            refreshInterval,
        } = this.props;

        const refreshIntervalId  = setInterval(() => this.loadWeather(), refreshInterval);
        this.setState(Object.assign({}, this.state, { refreshIntervalId }));
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshIntervalId);
    }

    loadWeather () {
        if (this.state.loading) {
            return; // Skip
        }

        const {
            latitude,
            longitude,
            apiKey,
        } = this.props;

        this.setState(Object.assign({}, this.state, { loading: true }));

        fetch(`https://api.openweathermap.org/data/2.5/weather?APPID=${apiKey}&lat=${latitude}&lon=${longitude}&units=metric`)
            .then(res => res.ok ? res : Promise.reject(res.statusText))
            .then(res => res.json())
            .then(weather => {
                if (weather) {
                    this.setState({
                        weather,
                    });
                }
            })
            .catch(error => console.error(`Failed to retrieve current weather:`, error))
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    render() {
        if (!this.state.weather || !this.state.weather.main) {
            return null;
        }

        return (
            <div className="card-body text-center">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h3 className="display-3">
                            {formatTemp(this.state.weather.main.temp)}
                        </h3>
                    </div>
                    <div className="col-md">
                        Min {formatTemp(this.state.weather.main.temp_min)}
                        <br/>
                        Max {formatTemp(this.state.weather.main.temp_max)}
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md">
                        <h4>
                            {this.state.weather.weather[0].main}
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

OpenWeatherCurrent.propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    apiKey: PropTypes.string.isRequired,
    refreshInterval: PropTypes.number,
};

OpenWeatherCurrent.defaultProps = {
    refreshInterval: 10 * 60 * 1000,
};

const formatTemp = temp => (
    <span>
        {roundOneDecimal(temp)}
        <small className="text-muted">˚C</small>
    </span>
);

const roundOneDecimal = x => Math.round(x * 10) / 10;

export default OpenWeatherCurrent;
