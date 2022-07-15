import { Textarea } from "brainly-style-guide";

import { useTicketNode } from "../../hooks";

export default function ReasonTextarea(props: {
  onChange: (reason: string) => void;
  defaultReason: string;
}) {
  const { node } = useTicketNode();

  return (
    <Textarea 
      color={node.isReported ? "white" : "default"}
      fullWidth 
      value={props.defaultReason}
      placeholder={locales.deletionReason}
      onChange={e => props.onChange(e.currentTarget.value)}
    />
  );
}