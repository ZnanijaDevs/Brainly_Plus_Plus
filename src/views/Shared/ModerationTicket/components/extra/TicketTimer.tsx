import { useTimer } from "react-timer-hook";
import { Flex, Text } from "brainly-style-guide";

import _API from "@lib/api/Brainly/Legacy";

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

  return (
    <Flex alignItems="center" className="prolong-moderation-ticket-section">
      <Text size="small" weight="bold" color={(minutes === 0 && seconds < 10) ? "text-red-60" : "text-black"}>
        {addZero(minutes)}:{addZero(seconds)}
      </Text>
      <AdaptiveButton
        icon={{ type: "plus", color: "icon-indigo-50", size: 16 }}
        type="outline-indigo"
        title={locales.prolongTicket}
        onClick={async _ => {
          const prolongedTicket = await _API.ProlongTicket({
            taskId: props.taskId,
            ticketId: props.ticketId,
            minutes: 15
          });

          const time = new Date();
          time.setSeconds(time.getSeconds() + prolongedTicket.data.time_left);
          restart(time);
        }}
      />
    </Flex>
  );
}