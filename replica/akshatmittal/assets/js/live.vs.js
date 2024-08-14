YT.live = {
  vs1: "",
  vs2: "",
  update: function () {
    $.getJSON(
      "https://nia-statistics.com/api/get?platform=youtube&type=channel&id=" +
        YT.live.vs1,
      function (f) {
        $.getJSON(
          "https://nia-statistics.com/api/get?platform=youtube&type=channel&id=" +
            YT.live.vs2,
          function (g) {
            YT.updateManager.updateSubscribers(f.estSubCount, g.estSubCount);
          }
        );
      }
    );
  },
  timer: null,
  setVS: function (e, f) {
    this.vs1 = e;
    this.vs2 = f;
    this.start();
  },
  start: function () {
    this.stop();
    YT.query.begin();
    this.timer = setInterval(function (e) {
      YT.live.update();
    }, 2000);
    YT.live.update();
  },
  stop: function () {
    clearInterval(this.timer);
  },
};
