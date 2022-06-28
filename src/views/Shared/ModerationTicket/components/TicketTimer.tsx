import { useTimer } from "react-timer-hook";
import { Flex, Text, Button, Icon } from "brainly-style-guide";

const addZero = (n: number) => String(n).length < 2 ? `0${n}` : n;

export default function TicketTimer(props: {
  expiryTimestamp: Date;
}) {
  const {
    seconds,
    minutes
  } = useTimer({ 
    autoStart: true,
    expiryTimestamp: props.expiryTimestamp, 
    onExpire: () => console.debug("expired")
  });

  return (
    <Flex alignItems="center" className="prolong-moderation-ticket-section">
      <Text size="small" weight="bold" color={(minutes === 0 && seconds < 10) ? "text-red-60" : "text-black"}>
        {addZero(minutes)}:{addZero(seconds)}
      </Text>
      <Button 
        iconOnly 
        icon={<Icon size={16} type="plus" color="icon-indigo-50" />} 
        type="outline-indigo"
        title="Продлить билет"
      />
    </Flex>
  );
}