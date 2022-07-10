import { useState } from "react";
import { Flex } from "brainly-style-guide";
import Viewer from "react-viewer";

import type { AttachmentDataInModerationTicket, ModelTypeID } from "@typings/";
import _API from "@lib/api/Brainly/Legacy";

import Attachment from "./Attachment";
import AttachmentIframe from "./AttachmentIframe";

export default function AttachmentsSection(props: {
  modelTypeId: ModelTypeID;
  modelId: number;
  taskId: number;
  attachments: AttachmentDataInModerationTicket[];
}) {
  const [attachments, setAttachments] = useState(props.attachments);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number>(null);
  const [attachmentIframeUrl, setAttachmentIframeUrl] = useState<string>(null);

  const deleteAttachment = async (attachmentId: number) => {
    await _API.DeleteAttachment({
      attachmentId: attachmentId,
      modelId: props.modelId,
      modelTypeId: props.modelTypeId,
      taskId: props.taskId || props.modelId
    });

    setAttachments(
      prevState => prevState.filter(attachment => attachment.id !== attachmentId)
    );
  };

  return (
    <Flex>
      <Viewer 
        visible={selectedAttachmentIndex !== null}
        images={attachments
          .filter(x => x.type === "IMAGE")
          .map(attachment => ({ src: attachment.url }))
        }
        onClose={() => setSelectedAttachmentIndex(null)}
        activeIndex={selectedAttachmentIndex}
        showTotal={false}
      />
      {attachmentIframeUrl && 
        <AttachmentIframe url={attachmentIframeUrl} onClose={() => setAttachmentIframeUrl(null)} />}
      {attachments.map(attachment => 
        <Attachment 
          onDelete={deleteAttachment} 
          data={attachment} 
          key={attachment.id} 
          onOpen={selectedAttachment => {
            if (selectedAttachment.type === "UNKNOWN") {
              window.open(selectedAttachment.url);
            } else if (selectedAttachment.viewUrl) {
              setAttachmentIframeUrl(selectedAttachment.viewUrl);
            } else {
              setSelectedAttachmentIndex(attachments.findIndex(x => x.id === selectedAttachment.id));
            }
          }}
        />
      )}
    </Flex>
  );
}