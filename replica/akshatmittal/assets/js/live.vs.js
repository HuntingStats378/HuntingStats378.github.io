YT.live = {
  vs1: "",
  vs2: "",
  update: function () {
    $.getJSON(
      "https://ests.sctools.org/api/get/" +
        YT.live.vs1,
      function (f) {
        $.getJSON(
          "https://ests.sctools.org/api/get/" +
            YT.live.vs2,
          function (g) {
            YT.updateManager.updateSubscribers(f.stats.estCount, g.stats.estCount);
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
