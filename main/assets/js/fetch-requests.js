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
    const apiSubCount = response.counts[2].count;
    const videos = response.counts[5].count;
    const channelLogo = response.user[1].count;
    const channelName = response.user[0].count;
    const channelBanner = response.user[2].count;
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
      user: [channelName, channelLogo, channelBanner],
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

async function fetchinstagramuser(userId) {
  try {
    const data = await fetch(`https://api-v2.nextcounts.com/api/instagram/user/${userId}`);

    const response = await data.json();
    const subCount = response.followers;
    const totalViews = response.posts;
    const apiSubCount = response.following;
    const channelLogo = response.avatar;
    const channelName = response.nickname;
    const channelBanner = response.userBanner;
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
