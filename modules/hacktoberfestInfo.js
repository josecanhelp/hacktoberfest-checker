var github = require('./githubAuth');
var _ = require('lodash');
var q = require('q');

var hacktoberfestInfo = {
    totalIssues: 0,
    octoberOpenIssues: [],

    resetToDefault: function() {
        hacktoberfestInfo.totalIssues = 0;
        hacktoberfestInfo.octoberOpenIssues = [];
        return;
    },

    populateOpenIssues: function() {
        var deferred = q.defer();

        var options = {
            q : 'type:issue+label:hacktoberfest+state:open',
            sort : 'created',
            order : 'desc'
        };

        github.search.issues(options, function(err, res) {
            if (err) {
                deferred.reject();
                return;
            }

            hacktoberfestInfo.totalIssues = res.total_count;

            _.each(res.items, function(issue) {
                returnedIssue = hacktoberfestInfo.formatIssue(issue);
                hacktoberfestInfo.octoberOpenIssues.push(returnedIssue);
            });

            deferred.resolve();
        });

        return deferred.promise;

    },

    formatIssue: function(issue) {
        var repo_url = issue.html_url.replace(/\/(issues)\/\d+/, "");
        var lastSlash = repo_url.lastIndexOf("/");
        var description = issue.body;
        if (description.length > 500) {
            description = description.substring(0, 120) + "...";
        }

        return {
            repo_url: repo_url,
            repo_name: repo_url.substring(repo_url.lastIndexOf("/", lastSlash - 1) + 1),
            title: issue.title,
            url: issue.html_url,
            labels: issue.labels,
            description: description,
            created: issue.created_at,
            avatar: issue.user.avatar_url
        }
    }
}

module.exports = hacktoberfestInfo;
