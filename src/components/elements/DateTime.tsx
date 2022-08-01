import Moment from "react-moment";
import "moment-timezone";
import "moment/locale/ru";

const DATE_FORMAT = "DD.MM.YYYY, HH:mm:ss";
const TIMEZONE = "Europe/Moscow";
const LOCALE = "ru";

export default function DateTime(props: {
  date: string;
  fromNow: boolean;
}) {
  return (
    <Moment 
      date={props.date} 
      fromNow={props.fromNow} 
      format={!props.fromNow ? DATE_FORMAT : undefined} 
      locale={LOCALE}
      tz={TIMEZONE}
      withTitle
      titleFormat={DATE_FORMAT}
    />
  );
}