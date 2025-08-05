function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function getGoal(count2) {
      var count = parseFloat(count2);
      var t = parseFloat(count2);
      if (count == null) return 0;
      if (10 > t) return 10 - t;
      var e = "" + t;
      return Math.abs(
        t -
          (e.length > 6
            ? 1e6 * (Math.floor(t / 1e6) + 1)
            : (parseInt(e.charAt(0)) + 1) * Math.pow(10, e.length - 1))
      );
    }

function getGoalText(count2) {
      var count = parseFloat(count2);
      var t = parseFloat(count2);
      if (count == null) return 0;
      if (10 > t) return 10;
      var e = "" + t;
      return e.length > 6
        ? 1e6 * (Math.floor(t / 1e6) + 1)
        : (parseInt(e.charAt(0)) + 1) * Math.pow(10, e.length - 1);
    }

function abbreviateNumber(num) {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B';
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K';
    } else {
        return num.toString();
    }
}

async function fetchyoutubechannel(channelId) {
  try {
    // Fetch from Mixerno API
    const data = await fetch(
      `https://mixerno.space/api/youtube-channel-counter/user/${channelId}`
    );
    const response = await data.json();

    // Default values for nextcounts
    let studioData = null;
    let nextcountsOK = false;

    try {
      // Attempt fetch from nextcounts
      const dat2a = await fetch(
        `https://api-v2.nextcounts.com/api/youtube/channel/${channelId}`
      );
      const respons2e = await dat2a.json();

      if (respons2e.verifiedSubCount === true) {
        studioData = respons2e.subcount;
        nextcountsOK = true;
      }
    } catch (e) {
      console.warn("nextcounts API failed:", e);
    }

    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = response.counts[4].count;
    const apiSubCount = response.counts[1].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = `https://banner.yt/${channelId}`;
    const goalCount = getGoal(subCount);

    // Special case for MrBeast fallback
    if (!nextcountsOK && channelId === "UCX6OQ3DkcsbYNE6H8uQQuVA") {
      try {
        const dat3a = await fetch(`https://mrbeast.subscribercount.app/data`);
        const mrbeast = await dat3a.json();
        studioData = mrbeast.mrbeast;
      } catch (e) {
        console.warn("MrBeast fallback fetch failed:", e);
      }
    }

    // Return object with or without studio data
    const result = {
      t: new Date(),
      counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos],
      user: [channelName, channelLogo, channelBanner, channelId, channelId],
      value: [
        ["Subscribers", "Subscribers (EST)"],
        ["Goal", `Subscribers to ${abbreviateNumber(getGoalText(subCount))}`],
        ["Subscribers", "Subscribers (API)"],
        ["Views", "Views (EST)"],
        ["Views", "Views (API)"],
        ["Videos", "Videos (API)"]
      ]
    };

    if (studioData !== null) {
      result.studio = studioData;
    }

    return result;

  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch counts");
  }
}

async function fetchyoutubevideo(videoId) {
  try {
    const [data, dat2a, dat3a] = await Promise.all([
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
    ]);

    const response = await data.json();
    const respons2e = await dat2a.json();
    const respons3e = await dat3a.json();
    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = respons3e.dislikes;
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos],
            user: [channelName, channelLogo, channelBanner, videoId, dat3a.dateCreated],
            value: [["Views", "Views (EST)"],["Goal", `Views to ${abbreviateNumber(getGoalText(subCount))}`],["Views", "Views (API)"],["Likes", "Likes (API)"],["Dislikes", "Dislikes (API)"],["Comments", "Commments (API)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchyoutubestream(videoId) {
  try {
    const [data, dat2a, dat3a] = await Promise.all([
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
    ]);

    const response = await data.json();
    const respons2e = await dat2a.json();
    const respons3e = await dat3a.json();
    const liveCount = respons2e.counts[0].count;
    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = respons3e.dislikes;
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [liveCount, goalCount, subCount, apiSubCount, totalViews, apiViews, videos],
            user: [channelName, channelLogo, channelBanner, videoId, dat3a.dateCreated],
            value: [["Watching", "Watching (API)"],["Goal", `Views to ${abbreviateNumber(getGoalText(subCount))}`],["Views", "Views (EST)"],["Views", "Views (API)"],["Likes", "Likes (API)"],["Dislikes", "Dislikes (API)"],["Comments", "Commments (API)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchyoutubelatest(channelId) {
  try {
    const latestdata = await fetch(`https://latestvid.stats100.xyz/get/${channelId}?type=any&maxresults=1`);
    const latestresponse = await latestdata.json();
    const [data, dat2a, dat3a] = await Promise.all([
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse[0].videoId}`)
    ]);

    const response = await data.json();
    const respons2e = await dat2a.json();
    const respons3e = await dat3a.json();
    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = respons3e.dislikes;
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos],
            user: [channelName, channelLogo, channelBanner, latestresponse[0].videoId, dat3a.dateCreated],
            value: [["Views", "Views (EST)"],["Goal", `Views to ${abbreviateNumber(getGoalText(subCount))}`],["Views", "Views (API)"],["Likes", "Likes (API)"],["Dislikes", "Dislikes (API)"],["Comments", "Commments (API)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchyoutubelatestlong(channelId) {
  try {
    const latestdata = await fetch(`https://latestvid.stats100.xyz/get/${channelId}?type=long&maxresults=1`);
    const latestresponse = await latestdata.json();
    const [data, dat2a, dat3a] = await Promise.all([
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse[0].videoId}`)
    ]);

    const response = await data.json();
    const respons2e = await dat2a.json();
    const respons3e = await dat3a.json();
    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = respons3e.dislikes;
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos],
            user: [channelName, channelLogo, channelBanner, latestresponse[0].videoId, dat3a.dateCreated],
            value: [["Views", "Views (EST)"],["Goal", `Views to ${abbreviateNumber(getGoalText(subCount))}`],["Views", "Views (API)"],["Likes", "Likes (API)"],["Dislikes", "Dislikes (API)"],["Comments", "Commments (API)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchyoutubelatestshort(channelId) {
  try {
    const latestdata = await fetch(`https://latestvid.stats100.xyz/get/${channelId}?type=short&maxresults=1`);
    const latestresponse = await latestdata.json();
    const [data, dat2a, dat3a] = await Promise.all([
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse[0].videoId}`)
    ]);

    const response = await data.json();
    const respons2e = await dat2a.json();
    const respons3e = await dat3a.json();
    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = respons3e.dislikes;
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos],
            user: [channelName, channelLogo, channelBanner, latestresponse[0].videoId, dat3a.dateCreated],
            value: [["Views", "Views (EST)"],["Goal", `Views to ${abbreviateNumber(getGoalText(subCount))}`],["Views", "Views (API)"],["Likes", "Likes (API)"],["Dislikes", "Dislikes (API)"],["Comments", "Commments (API)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchyoutubelatestlive(channelId) {
  try {
    const latestdata = await fetch(`https://latestvid.stats100.xyz/get/${channelId}?type=live&maxresults=1`);
    const latestresponse = await latestdata.json();
    const [data, dat2a, dat3a] = await Promise.all([
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse[0].videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse[0].videoId}`)
    ]);

    const response = await data.json();
    const respons2e = await dat2a.json();
    const respons3e = await dat3a.json();
    const liveCount = respons2e.counts[0].count;
    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = respons3e.dislikes;
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [liveCount, goalCount, subCount, apiSubCount, totalViews, apiViews, videos],
            user: [channelName, channelLogo, channelBanner, latestresponse[0].videoId, dat3a.dateCreated],
            value: [["Watching", "Watching (API)"],["Goal", `Views to ${abbreviateNumber(getGoalText(subCount))}`],["Views", "Views (EST)"],["Views", "Views (API)"],["Likes", "Likes (API)"],["Dislikes", "Dislikes (API)"],["Comments", "Commments (API)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchinstagramuser(userId) {
  try {
    const [data, dat2a] = await Promise.all([
      fetch(`https://livecounts.xyz/api/instagram-live-follower-count/live/${userId}`),
      fetch(`https://api-v2.nextcounts.com/api/instagram/user/${userId}`)
    ]);

    const response = await data.json();
    const response2 = await dat2a.json();
    const subCount = response.counts[0];
    const totalViews = response.counts[2];
    const apiSubCount = response.counts[1];
    const channelLogo = response2.avatar || null;
    const channelName = response2.nickname || null;
    const channelBanner = response2.userBanner || null;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, apiSubCount, totalViews],
            user: [channelName, channelLogo, channelBanner, userId, userId],
            value: [["Followers", "Followers (Instagram)"],["Goal", `Followers to ${abbreviateNumber(getGoalText(subCount))}`],["Following", "Following (Instagram)"],["Posts", "Posts (Instagram)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchtiktokuser(userId) {
  try {
    const data = await fetch(`https://mixerno.space/api/tiktok-user-counter/user/${userId}`);

    const response = await data.json();
    const subCount = response.counts[0].count;
    const totalViews = response.counts[4].count;
    const apiViews = response.counts[3].count;
    const apiSubCount = response.counts[2].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, apiSubCount, totalViews, apiViews],
            user: [channelName, channelLogo, channelBanner, userId, userId],
            value: [["Followers", "Followers (TikTok)"],["Goal", `Followers to ${abbreviateNumber(getGoalText(subCount))}`],["Following", "Following (TikTok)"],["Videos", "Videos (TikTok)"],["Hearts","Hearts (TikTok)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchtwitteruser(userId) {
  try {
    const data = await fetch(`https://mixerno.space/api/twitter-user-counter/user/${userId}`);

    const response = await data.json();
    const subCount = response.counts[0].count;
    const totalViews = response.counts[3].count;
    const apiViews = response.counts[4].count;
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const extra = response.counts[6].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos, extra],
            user: [channelName, channelLogo, channelBanner, userId, userId],
            value: [["Followers", "Followers (Twitter)"],["Goal", `Followers to ${abbreviateNumber(getGoalText(subCount))}`],["Following", "Following (Twitter)"],["Likes","Likes (Twitter)"],["Lists","Lists (Twitter)"],["Media", "Media (Twitter)"],["Tweets","Tweets (Twitter)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetch50statesfundraiser(userId) {
  try {
    const data = await fetch(`https://corsproxy.io/?https://gshso0nx9d.execute-api.us-east-1.amazonaws.com/api/public/campaigns/13135e7f-7d66-422e-ac00-0197067d5c8a`);
    const response = await data.json();

    const subCount = response.data.amount_raised.value;
    const totalViews = response.data.goal.value;
    const apiViews = response.data.original_goal.value;
    const channelLogo = response.data.avatar.src;
    const channelName = response.data.name;
    const channelBanner = response.data.id;
    const goalCount = getGoal(subCount);

    return { "t": new Date(),
            counts: [subCount, goalCount, totalViews, apiViews],
            user: [channelName, channelLogo, channelBanner, userId, userId],
            value: [["Dollars", "Dollars (USD)"], ["Goal", `Dollars to ${abbreviateNumber(getGoalText(subCount))}`], ["Aim", "Aim (Of Fundraiser)"], ["Original Aim", "Original Aim (Of Fundraiser)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetchteamwaterfundraiser(userId) {
  try {
    const userId = "UCXGITFpSIGWPTr8ekn9qjMw";
    const data = await fetch(`https://api.communitrics.com/teamwater`);
    const response = await data.json();
    const subCount = response.count;
    const channelLogo = "https://yt3.googleusercontent.com/QO0KsIb3UjlnBrqnCCC1dn3KwKVLMZQgCJBKFu2v0pFiNDdLQTUh-iEavOXkQhlOaLTBrVvY=s1080-c-k-c0x00ffffff-no-rj";
    const channelName = "#TeamWater";
    const channelBanner = `https://banner.yt/${userId}`;
    const goalCount = getGoal(subCount);
    const progressCount = 40000000 - subCount;

    return { "t": new Date(),
            counts: [subCount, goalCount, progressCount],
            user: [channelName, channelLogo, channelBanner, userId, userId],
            value: [["Dollars", "Dollars (USD)"], ["Goal", `Dollars to ${abbreviateNumber(getGoalText(subCount))}`], ["Progress", "Progress (To $40M)"]]
           };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

