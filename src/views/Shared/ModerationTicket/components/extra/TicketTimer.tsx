import { useState } from "react";
import { useTimer } from "react-timer-hook";
import { Flex, Text, Select } from "brainly-style-guide";

import _API from "@lib/api/Brainly/Legacy";

import AdaptiveButton from "@styleguide/AdaptiveButton";

const addZero = (n: number) => String(n).length < 2 ? `0${n}` : n;
const PROLONG_TICKET_MINUTES = [5, 10, 15];

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

  const [selectedTime, setSelectedTime] = useState<5 | 10 | 15>(5);

  return (
    <Flex alignItems="center" className="prolong-moderation-ticket-section">
      <Text size="small" weight="bold" color={(minutes === 0 && seconds < 10) ? "text-red-60" : "text-black"}>
        {addZero(minutes)}:{addZero(seconds)}
      </Text>
      <Select 
        value={selectedTime.toString()} 
        options={PROLONG_TICKET_MINUTES.map(minute => 
          ({ value: minute.toString(), text: `${minute} ${locales.minutes}` })
        )} 
        onChange={
          e => setSelectedTime(+e.currentTarget.value as 5 | 10 | 15)
        }
      />
      <AdaptiveButton
        icon={{ type: "plus", color: "icon-indigo-50", size: 16 }}
        type="outline-indigo"
        title={locales.prolongTicket}
        onClick={async _ => {
          const prolongedTicket = await _API.ProlongTicket({
            taskId: props.taskId,
            ticketId: props.ticketId,
            minutes: selectedTime
          });

          const time = new Date();
          time.setSeconds(prolongedTicket.data.time_left + time.getSeconds());

          restart(time);
        }}
      />
    </Flex>
  );
}