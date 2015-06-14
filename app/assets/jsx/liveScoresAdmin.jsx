var ScoreBoard = React.createClass({
    getInitialState: function () {
        return { homeTeam: 'Newcastle', homeScore: 0, awayTeam: 'Sunderland', awayScore: 0, matchTime: '15:00' }
    },
    handleUpdateScore: function (team, newScore) {
        var $this = this;
        var postData = {
            homeTeam: this.state.homeTeam,
            awayTeam: this.state.awayTeam,
            homeScore: team == 'home' ? newScore : this.state.homeScore,
            awayScore: team == 'away' ? newScore : this.state.awayScore,
            matchTime: this.state.matchTime
        };

        $.ajax({
            url: '/live/update',
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(postData),
            success: function(data) {
                console.log(data);
                $this.setState(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div className="scoreBoard panel panel-default">
                <div className="panel-body">
                    <div className="home col-xs-5">
                        <button type="button" className="btn btn-primary" onClick={this.handleUpdateScore.bind(this, 'home', this.state.homeScore + 1)}>+</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleUpdateScore.bind(this, 'home', this.state.homeScore - 1)}>-</button>
                        <span className="homeTeam">{this.state.homeTeam}</span>
                        <span className="homeScore">{this.state.homeScore}</span>
                    </div>
                    <div className="away col-xs-5">
                        <button type="button" className="btn btn-primary" onClick={this.handleUpdateScore.bind(this, 'away', this.state.awayScore + 1)}>+</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleUpdateScore.bind(this, 'away', this.state.awayScore - 1)}>-</button>
                        <span className="awayTeam">{this.state.awayTeam}</span>
                        <span className="awayScore">{this.state.awayScore}</span>
                    </div>
                    <div className="matchTime col-xs-2">
                        {this.state.matchTime}
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <ScoreBoard />,
    document.getElementById('live-score-admin')
);

