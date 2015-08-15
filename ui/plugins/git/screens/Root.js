var React = require('react');
var RecentCommits = require('components/RecentCommits');
var Leaderboard = require('components/Leaderboard');
var config = require('config');
var Trollface = require("../css/images/Trollface.svg");
var Root = React.createClass({

  render: function() {
    return (
      <div className="git-root">
        <h2>Recent Activity</h2>

        <RecentCommits
          commits={config.stats.recentCommits}
          activeCommitId={this.props.query.commit}
        />

        <h2>Leaderboard</h2>

        <p className="git-root__troll">
          A rundown of exactly how much work every team member does.
          {' '}
          <b className="type-attention">Really!</b>
          <img className="git-root__troll-head" src={Trollface} width="128" />
        </p>


        <Leaderboard
          committers={config.stats.commitHistory}
        />

      </div>
    );
  }
});

module.exports = Root;