var GoalScorer = React.createClass({
    render: function () {
        return (
            <div className="goalScorerItem">
                <span className="goalTime">{this.props.goalTime}</span>
                <span className="goalScorerName">{this.props.goalScorer}</span>
            </div>
        );
    }
});

var ScoreData = React.createClass({
    render: function () {
        var scoreDataNodes = this.props.data.map(function (data) {
            return (<GoalScorer goalTime={data.goalTime} goalScorer={data.goalScorer} />)
        });

        return (
            <div className="scoreData">
                {scoreDataNodes}
            </div>
        )
    }
});

var ScoreBoard = React.createClass({
    getInitialState: function () {
        return { homeTeam: '', homeScore: '', awayTeam: '', awayScore: '', matchTime: '', scoreData: [] }
    },
    componentWillMount: function () {
        console.log('componentWillMount');
        var liveFeed;
        if (liveFeed) { liveFeed.close(); }
        liveFeed = new EventSource('/live/feed');
        liveFeed.addEventListener('message', this.handleUpdateFromFeed, false);
    },
    handleUpdateFromFeed: function (e) {
        var data = JSON.parse(e.data);
        console.log(data);
        var newState = this.state;
        newState.homeTeam = data.homeTeam || this.state.homeTeam;
        newState.homeScore = data.homeScore !== null ? data.homeScore : this.state.homeScore;
        newState.awayTeam = data.awayTeam || this.state.awayTeam;
        newState.awayScore = data.awayScore !== null ? data.awayScore : this.state.awayScore;
        newState.matchTime = data.matchTime || this.state.matchTime;

        this.setState(newState);
    },
    render: function () {
        return (
            <div className="scoreBoard panel panel-default">
                <div className="panel-body">
                    <div className="home col-xs-5">
                        <span className="homeTeam">{this.state.homeTeam}</span>
                        <span className="homeScore">{this.state.homeScore}</span>
                    </div>
                    <div className="away col-xs-5">
                        <span className="awayTeam">{this.state.awayTeam}</span>
                        <span className="awayScore">{this.state.awayScore}</span>
                    </div>
                    <div className="matchTime col-xs-2">
                        {this.state.matchTime}
                    </div>
                </div>
                <ScoreData data={this.state.scoreData} />
            </div>
        );
    }
});

React.render(
    <ScoreBoard />,
    document.getElementById('live-score')
);

