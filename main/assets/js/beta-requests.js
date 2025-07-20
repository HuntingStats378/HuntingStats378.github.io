var averages = {};

function calcGain(arr, len) {
        if (len !== undefined) {
            if (arr.length > len) {
                return arr[arr.length - 1] - arr[((arr.length - 1) - len)];
            } else {
                return arr[arr.length - 1] - arr[0];
            }
        } else {
            return arr[arr.length - 1] - arr[0];
        }
    }

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
  let subCount = null;
  let totalViews = null;
  let apiViews = null;
  let apiSubCount = null;
  let videos = null;
  let channelLogo = null;
  let channelName = null;
  let studioData = null;
  let goalCount = null;

  const channelBanner = `https://banner.yt/${channelId}`;
  let sctoolsOK = false;

  // Try SCTools first
  try {
    const data = await fetch(`https://ests.sctools.org/api/get/${channelId}`);
    const response = await data.json();

    subCount = response.stats.estCount ?? null;
    totalViews = response.stats.viewCount ?? null;
    apiViews = response.stats.viewCount ?? null;
    apiSubCount = response.stats.apiCount ?? null;
    videos = response.stats.videoCount ?? null;
    channelLogo = response.info.avatar ?? null;
    channelName = response.info.name ?? null;
    goalCount = getGoal(subCount);
    sctoolsOK = true;
  } catch (error) {
    console.warn("SCTools API failed:", error);
  }

  // If SCTools failed, try fallback sources
  if (!sctoolsOK) {
    // Try NextCounts
    try {
      const dat2a = await fetch(`https://api-v2.nextcounts.com/api/youtube/channel/${channelId}`);
      const respons2e = await dat2a.json();

      if (respons2e.verifiedSubCount === true && respons2e.subcount != null) {
        studioData = respons2e.subcount;
        subCount = subCount ?? respons2e.subcount;
        goalCount = getGoal(subCount);
      }

      if (respons2e.name) channelName = channelName ?? respons2e.name;
      if (respons2e.avatar) channelLogo = channelLogo ?? respons2e.avatar;
      if (respons2e.viewcount != null) totalViews = totalViews ?? respons2e.viewcount;
    } catch (e) {
      console.warn("NextCounts API failed:", e);
    }

    // Special MrBeast case
    if (channelId === "UCX6OQ3DkcsbYNE6H8uQQuVA") {
      try {
        const dat3a = await fetch(`https://mrbeast.subscribercount.app/data`);
        const mrbeast = await dat3a.json();
        if (mrbeast?.mrbeast != null) {
          studioData = studioData ?? mrbeast.mrbeast;
        }
      } catch (e) {
        console.warn("MrBeast fallback fetch failed:", e);
      }
    }

    // Fallback to Mixerno
    try {
      const mixerno = await fetch(`https://mixerno.space/api/youtube-channel-counter/user/${channelId}`);
      const mixData = await mixerno.json();

      if ((mixData.counts[0].count != null) && (mixData.counts[0].count != 0)) {
        subCount = subCount ?? mixData.counts[0].count;
        goalCount = getGoal(subCount);
      }

      channelName = channelName ?? mixData.user[0].count;
      channelLogo = channelLogo ?? mixData.user[1].count;
    } catch (e) {
      console.warn("Mixerno fallback fetch failed:", e);
    }
  }

  const result = {
    t: new Date(),
    counts: [
      subCount,
      goalCount,
      apiSubCount,
      totalViews,
      apiViews,
      videos
    ],
    user: [
      channelName,
      channelLogo,
      channelBanner
    ],
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

    return { "t": new Date(), counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos], user: [channelName, channelLogo, channelBanner] };
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

    return { "t": new Date(), counts: [liveCount, goalCount, subCount, apiSubCount, totalViews, apiViews, videos], user: [channelName, channelLogo, channelBanner] };
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
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse.videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse.videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse.videoId}`)
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

    return { "t": new Date(), counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos], user: [channelName, channelLogo, channelBanner] };
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
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse.videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse.videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse.videoId}`)
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

    return { "t": new Date(), counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos], user: [channelName, channelLogo, channelBanner] };
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
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse.videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse.videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse.videoId}`)
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

    return { "t": new Date(), counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos], user: [channelName, channelLogo, channelBanner] };
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
      fetch(`https://mixerno.space/api/youtube-video-counter/user/${latestresponse.videoId}`),
      fetch(`https://mixerno.space/api/youtube-stream-counter/user/${latestresponse.videoId}`),
      fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${latestresponse.videoId}`)
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

    return { "t": new Date(), counts: [liveCount, goalCount, subCount, apiSubCount, totalViews, apiViews, videos], user: [channelName, channelLogo, channelBanner] };
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

    return { "t": new Date(), counts: [subCount, goalCount, apiSubCount, totalViews], user: [channelName, channelLogo, channelBanner] };
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

    return { "t": new Date(), counts: [subCount, goalCount, apiSubCount, totalViews, apiViews], user: [channelName, channelLogo, channelBanner] };
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

    return { "t": new Date(), counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos, extra], user: [channelName, channelLogo, channelBanner] };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch counts" };
  }
}

async function fetch50statesfundraiser(userId) {
  if (userId === "top") {
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

      return {
        t: new Date(),
        counts: [subCount, goalCount, apiSubCount, totalViews, apiViews, videos, extra],
        user: [channelName, channelLogo, channelBanner],
      };
    } catch (error) {
      console.error(error);
      return { error: "Failed to fetch counts" };
    }
  } else {
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

      return {
        t: new Date(),
        counts: [subCount, goalCount, totalViews, apiViews],
        user: [channelName, channelLogo, channelBanner],
      };
    } catch (error) {
      console.error(error);
      return { error: "Failed to fetch counts" };
    }
  }
}
