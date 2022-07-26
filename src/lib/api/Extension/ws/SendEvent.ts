import LiveAction from ".";

type UserGeneratedEvent = {
  ticket_opened: {
    question_id: number;
  };
};

export default async <T extends keyof UserGeneratedEvent>(
  event: T,
  payload: UserGeneratedEvent[T]
) => {
  const data = { event, payload };

  navigator.sendBeacon(
    `${LiveAction.serverHost}/event`,
    JSON.stringify(data)
  );
};