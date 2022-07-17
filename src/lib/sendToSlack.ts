import storage from "@lib/storage";

const SLACK_ENDPOINT_URL = "https://slack.com/api/chat.postMessage";

export default async function sendToSlack(
  message: string,
  channel: string
) {
  const slackToken = await storage.get<string>("slackToken");

  const data = {
    channel,
    token: slackToken,
    text: message,
  };

  const res = await fetch(
    `${SLACK_ENDPOINT_URL}?${new URLSearchParams(data)}`,
    { method: "POST" }
  ).then(r => r.json());
}