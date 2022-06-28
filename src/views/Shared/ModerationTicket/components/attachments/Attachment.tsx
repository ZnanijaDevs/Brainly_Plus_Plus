import ext from "webextension-polyfill";

import type { AttachmentDataInModerationTicket } from "@typings/";
import AdaptiveButton from "../common/AdaptiveButton";

export default function Attachment(props: {
  onDelete: (attachmentId: number) => void;
  data: AttachmentDataInModerationTicket
}) {
  const attachment = props.data;

  return (
    <div className="moderation-ticket-node-attachment">
      <AdaptiveButton 
        type="solid-peach" 
        icon={{ type: "close", color: "icon-white" }}
        title="Удалить вложение"
        onClick={_ => props.onDelete(attachment.id)}
      />
      {attachment.type === "IMAGE" ? <img src={attachment.thumbnailUrl} /> :
        <div>
          <img src={ext.runtime.getURL(
            `icons/${attachment.type === "DOCUMENT" ? "document.ico" : "attachment.ico"}`
          )} />
        </div>
      }
    </div>
  );
}