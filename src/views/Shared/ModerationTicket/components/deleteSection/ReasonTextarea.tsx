import { Textarea, Label, Flex } from "brainly-style-guide";

import { useTicketNode } from "../../hooks";

export default function ReasonTextarea(props: {
  onChange: (reason: string) => void;
  defaultReason: string;
}) {
  const { node } = useTicketNode();

  const attachmentsLength = node.attachments?.length;

  return (<>
    <Textarea 
      color={node.isReported ? "white" : "default"}
      fullWidth
      value={props.defaultReason}
      placeholder={locales.deletionReason}
      onChange={e => props.onChange(e.currentTarget.value)}
    />
    {(node.isAnswer && attachmentsLength > 0) &&
      <Flex title={locales.attachmentsWillBeAddedAutomatically} className="attachments-label">
        <Label color="gray" iconType="attachment" type="default">
          {attachmentsLength}
        </Label>
      </Flex>
    }
  </>);
}