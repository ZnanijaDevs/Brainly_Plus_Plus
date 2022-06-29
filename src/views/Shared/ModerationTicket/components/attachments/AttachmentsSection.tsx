import { Flex } from "brainly-style-guide";
import type { AttachmentDataInModerationTicket, ModelTypeID } from "@typings/";

import _API from "@lib/api/Brainly/Legacy";
import Flash from "@utils/flashes";

import Attachment from "./Attachment";

export default function AttachmentsSection(props: {
  modelTypeId: ModelTypeID;
  modelId: number;
  taskId: number;
  attachments: AttachmentDataInModerationTicket[];
}) {
  const deleteAttachment = (attachmentId: number) => {
    _API.DeleteAttachment({
      attachmentId: attachmentId,
      modelId: props.modelId,
      modelTypeId: props.modelTypeId,
      taskId: props.taskId || props.modelId
    })
      .catch(err => Flash("error", err));
  };

  return (
    <Flex>
      {props.attachments.map(attachment => 
        <Attachment onDelete={deleteAttachment} data={attachment} key={attachment.id} />
      )}
    </Flex>
  );
}