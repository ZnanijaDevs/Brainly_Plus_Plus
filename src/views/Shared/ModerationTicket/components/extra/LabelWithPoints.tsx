import { Text, Flex, Icon } from "brainly-style-guide";

export default function LabelWithPoints(props: { 
  text: string | number; 
}) {
  return (
    <div className="sg-counter sg-counter--with-icon">
      <Flex className="sg-counter__icon-container">
        <Icon color="icon-black" type="points" size={24} className="sg-counter__icon" />
      </Flex>
      <Flex alignItems="center">
        <Text type="span" size="small" weight="bold" className="sg-counter__text">
          {props.text} {MESSAGES.pts}
        </Text>
      </Flex>
    </div>
  );
}