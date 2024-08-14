YT.live = {
  channelID: "",
  update: function () {
    $.getJSON(
      "https://nia-statistics.com/api/get?platform=youtube&type=video&id=" + this.channelID,
      function (e) {
        if (e) {
          YT.updateManager.updateViews(e.estViewCount);
          YT.updateManager.updateLikes(e.apiLikeCount);
          YT.updateManager.updateComments(e.apiCommentCount);
        } else {
          YT.query.newSearch(YT.live.channelID);
        }
      }
    );
    $.getJSON(
      "https://returnyoutubedislikeapi.com/votes?videoId=" + this.channelID,
      function (e) {
        if (e) {
          YT.updateManager.updateDislikes(e.dislikes);
        } else {
          YT.query.newSearch(YT.live.channelID);
        }
      }
    );
  },
  timer: null,
  start: function () {
    this.stop();
    this.timer = setInterval(function (e) {
      YT.live.update();
    }, 2000);
    YT.live.update();
  },
  stop: function () {
    clearInterval(this.timer);
  },
};
