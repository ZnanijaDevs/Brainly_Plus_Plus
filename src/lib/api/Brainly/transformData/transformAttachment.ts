import type { AttachmentDataInModerationTicket } from "@typings/";
import type { Attachment } from "@typings/Brainly";

const FILES_EXTENSIONS = [
  "txt",
  "doc",
  "docx",
  "odt",
  "pdf",
  "pages",
  "xps",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "dfx",
  "eps",
  "psd",
  "ps",
  "svg",
  "cpp"
];
const IMAGES_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp"];
const DOC_EXTENSIONS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];


export default function transformAttachment(attachment: Attachment): AttachmentDataInModerationTicket {
  let attachmentType: AttachmentDataInModerationTicket["type"] = "UNKNOWN";
  let viewUrl;

  let extension = attachment.full.split(".").pop();

  if (IMAGES_EXTENSIONS.includes(extension)) {
    attachmentType = "IMAGE";
  } else if (DOC_EXTENSIONS.includes(extension)) {
    attachmentType = "DOCUMENT";
    viewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${attachment.full}`;
  } else if (FILES_EXTENSIONS.includes(extension)) {
    attachmentType = "FILE";
    viewUrl = `https://docs.google.com/gview?url=${attachment.full}&a=pagenumber=1&embedded=true`;
  }

  return {
    url: attachment.full,
    thumbnailUrl: attachment.thumbnail,
    extension,
    viewUrl,
    type: attachmentType,
    id: attachment.id
  };
}