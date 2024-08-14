const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "kIPiqwwJYYc";
document.getElementById("imageLink").href = `https://youtube.com/watch?v=${id}`;
document.getElementById(
  "subscribeBtn"
).href = `https://youtube.com/watch?v=${id}`;

setInterval(() => {
  fetch(`https://axern.space/api/get?platform=youtube&type=video&id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("name").textContent = data.snippet.title;

      const image = document.getElementById("image");
      image.src =
        data.snippet.thumbnails.high.url ||
        data.snippet.thumbnails.medium.url ||
        data.snippet.thumbnails.default.url;
      image.alt = data.snippet.title;
      document.getElementById("subscribers").innerHTML = data.estViewCount;
      document.getElementById("goal").innerHTML = data.apiLikeCount;
    });
}, 2000);

function toggleLightMode() {
  document.body.classList.toggle("light");

  const localTheme = localStorage.getItem("theme");
  if (!localTheme || localTheme === "dark")
    localStorage.setItem("theme", "light");
  else localStorage.setItem("theme", "dark");
}

window.onload = () => {
  const localTheme = localStorage.getItem("theme");
  if (!localTheme) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      localStorage.setItem("theme", "dark");
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.body.classList.toggle("light");
      localStorage.setItem("theme", "light");
    }
  }
  if (localTheme === "light") document.body.classList.toggle("light");
};

function search() {
  const prompt = window.prompt("Enter channel name, ID, or URL.");
  if (prompt)
    fetch(
      `https://axern.space/api/search?platform=youtube&type=channel&query=${prompt}`
    )
      .then((res) => res.json())
      .then((data) => {
        window.location.href = "?id=" + data[0].id;
      });
}
