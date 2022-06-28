import Moment from "react-moment";
import "moment-timezone";

export default function DateTime(props: {
  date: string;
  fromNow: boolean;
}) {
  return (
    <Moment 
      date={props.date} 
      fromNow={props.fromNow} 
      format={!props.fromNow ? "DD.MM.YYYY" : undefined} 
      locale="ru" 
      tz="Europe/Moscow" 
    />
  );
}