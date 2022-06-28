import { Flex, Button, Icon } from "brainly-style-guide";
import type { AttachmentDataInModerationTicket, ModelTypeID } from "@typings/";

import _API from "@lib/api/Brainly/Legacy";
import Flash from "@utils/Flashes";

import Attachment from "./Attachment";

export default function AttachmentsSection(props: {
  modelTypeId: ModelTypeID;
  modelId: number;
  taskId: number;
  attachments: AttachmentDataInModerationTicket[];
}) {

  return (
    <Flex>
      {props.attachments.map(attachment => 
        <Attachment onDelete={id => {
          _API.DeleteAttachment({
            attachmentId: id,
            modelId: props.modelId,
            modelTypeId: props.modelTypeId,
            taskId: props.taskId
          })
            .catch(err => Flash("error", err));
        }} data={attachment} key={attachment.id} />
      )}
    </Flex>
  );
}