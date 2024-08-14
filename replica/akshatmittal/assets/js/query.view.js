YT.query = {
    newSearch: function (e) {
        if (e.trim() == YT.live.channelID || e.trim() == "") {
            return;
        }
        YT.live.stop();
        $.getJSON("https://axern.space/api/search?platform=youtube&type=video&query=" + encodeURIComponent(e), function (e) {
            if (!e.data || e.data.length === 0) {
                alert("No results found!");
                return;
            }
            YT.updateManager.updateChannelID(e[0].id);
            YT.updateManager.updateCover(e[0].avatar);
            YT.updateManager.updateName(e[0].name);
            YT.updateManager.updateProfile(e[0].avatar);
            YT.urls.pushState(e[0].id);
            YT.live.start();
        });
    },
    search: function (e) {
        e.preventDefault();
        YT.query.newSearch($("#yt_searchvalue").val());
        $("#yt_searchvalue").val("")
    },
    bind: function () {
        $("#yt_search").on("submit", this.search);
        $("#yt_searchbutton").on("click", this.search);
    }
};
