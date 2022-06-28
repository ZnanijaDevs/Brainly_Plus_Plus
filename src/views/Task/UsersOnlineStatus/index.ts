import GetUserProfile from "@lib/api/Brainly/GetUserProfile";

let questionData = JSON.parse(
  $(".js-main-question").attr("data-z")
);

let responses = questionData.responses;

for (let response of responses) {
  let authorId: number = response.userId;

  GetUserProfile(authorId)
    .then(user => {
      const userLinks = $(".js-react-answers .sg-text--link[data-testid*=author]");

      for (let link of userLinks) {
        if (link.querySelector("span").textContent !== user.nick) continue;

        link.insertAdjacentHTML("afterend", `
          <span class="user-online-status user-online-status--${user.isOnline ? "online" : "offline"}">
            ${user.onlineStatus}
          </span>
        `);
      }
    });
}