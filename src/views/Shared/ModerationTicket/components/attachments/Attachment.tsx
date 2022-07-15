import ext from "webextension-polyfill";

import type { AttachmentDataInModerationTicket } from "@typings/";
import AdaptiveButton from "@styleguide/AdaptiveButton";

export default function Attachment(props: {
  onOpen: (attachment: AttachmentDataInModerationTicket) => void;
  onDelete: (attachmentId: number) => void;
  data: AttachmentDataInModerationTicket;
}) {
  const attachment = props.data;

  return (
    <div data-is-image={attachment.type === "IMAGE"} className="moderation-ticket-node-attachment">
      <AdaptiveButton 
        type="solid-peach" 
        icon={{ type: "close", color: "icon-white" }}
        title={locales.deleteAttachment}
        onClick={_ => props.onDelete(attachment.id)}
      />
      {attachment.type === "IMAGE" ? 
        <img src={attachment.thumbnailUrl} onClick={_ => props.onOpen(attachment)} /> :
        <div onClick={_ => props.onOpen(attachment)}>
          <img src={ext.runtime.getURL(
            `icons/${attachment.type === "DOCUMENT" ? "document.ico" : "attachment.ico"}`
          )} />
        </div>
      }
    </div>
  );
}