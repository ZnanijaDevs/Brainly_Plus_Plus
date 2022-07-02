import { Flex, Icon, Text, IconPropsType } from "brainly-style-guide";

export default function ReportIconWithText(props: {
  text: string | number;
  iconColor: IconPropsType["color"];
  title: string;
}) {
  return (
    <Flex title={props.title} alignItems="center" marginLeft="xxs">
      <Icon color={props.iconColor} type="report_flag" />
      <Text weight="bold" size="small">
        {props.text}
      </Text>
    </Flex>
  );
}