import { useTimer } from "react-timer-hook";
import { Flex, Text } from "brainly-style-guide";

import _API from "@lib/api/Brainly/Legacy";
import Flash from "@utils/flashes";

import AdaptiveButton from "../common/AdaptiveButton";

const addZero = (n: number) => String(n).length < 2 ? `0${n}` : n;

export default function TicketTimer(props: {
  ticketId: number;
  taskId: number;
  expiryTimestamp: Date;
  onExpire: () => void;
}) {
  const {
    seconds,
    minutes,
    restart
  } = useTimer({ 
    autoStart: true,
    expiryTimestamp: props.expiryTimestamp, 
    onExpire: props.onExpire
  });

  const prolongTicket = () => {
    _API.ProlongTicket(props.taskId, props.ticketId)
      .then(data => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + data.data.time_left);
        restart(time);
      })
      .catch(err => Flash("error", err));
  };

  return (
    <Flex alignItems="center" className="prolong-moderation-ticket-section">
      <Text size="small" weight="bold" color={(minutes === 0 && seconds < 10) ? "text-red-60" : "text-black"}>
        {addZero(minutes)}:{addZero(seconds)}
      </Text>
      <AdaptiveButton
        icon={{ type: "plus", color: "icon-indigo-50", size: 16 }}
        type="outline-indigo"
        title={MESSAGES.prolongTicket}
        onClick={prolongTicket}
      />
    </Flex>
  );
}