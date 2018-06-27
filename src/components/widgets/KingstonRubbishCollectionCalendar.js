import React from 'react';

// TODO Use collection day prop for nextWeek?
// TODO Change color based on collection
// TODO Highlight when collection day is today

const refreshInterval = 60 * 60 * 1000;
const collections = {
    WHEELIE_BINS: {
        name: 'Wheelie bins',
        color: 'blue',
        description: 'Paper, cardboard, rubbish, garden and food waste',
    },
    CONTAINERS: {
        name: 'Containers',
        color: 'green',
        description: 'Tins, cans, glass, plastics and food waste'
    },
}
const weeks = {
    0: collections.CONTAINERS,
    1: collections.WHEELIE_BINS,
}

class KingstonRubbishCollectionCalendar extends React.Component {
    constructor() {
        super();
        this.state = {
            nextCollection: collections.WHEELIE_BINS,
            nextCollectionDate: null,
        };
    }

    componentDidMount() {
        this.update().then(() => {
            const refreshIntervalId  = setInterval(() => this.update(), refreshInterval);
            this.setState(Object.assign({}, this.state, { refreshIntervalId }));
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.refreshIntervalId);
    }

    update() {
        return new Promise(resolve => {
            let weekNumber = getWeekNumber(new Date());
            let nextCollection = weeks[weekNumber % 2];

            this.setState(Object.assign({}, this.state, {
                nextCollection,
                nextCollectionDate: null,
            }), resolve);
        });
    }

    render() {
        if (!this.state.nextCollection) {
            return null;
        }

        return (
            <div className="card-body text-center">
                <div className="row align-items-center">
                    <div className="col">
                        <h3 className="display-3">
                            {this.state.nextCollection.name}
                        </h3>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md">
                        <h5>
                            {this.state.nextCollection.description}
                        </h5>
                    </div>
                </div>
            </div>
        );
    }
}

const getWeekNumber = date => {
    // Copy date so don't modify original
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    let nextWeek = date.getUTCDay() >= 4;
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7) + 3);
    if (nextWeek) {
        date.setUTCDate(date.getUTCDate() + 7);
    }
    // Get first day of year
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    let weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);

    return weekNo;
}

export default KingstonRubbishCollectionCalendar;
