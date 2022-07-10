import { Box } from "brainly-style-guide";
import AdaptiveButton from "../common/AdaptiveButton";

const IFRAME_VIEW_MULTIPLIERS = {
  height: 0.7,
  width: 0.45
};

export default function AttachmentIframe(props: {
  url: string;
  onClose: () => void;
}) {
  return (
    <div className="attachment-preview-iframe-box">
      <Box shadow color="white" padding="s">
        <AdaptiveButton
          icon={{ type: "close", color: "icon-black", size: 24 }}
          size="m"
          onClick={props.onClose}
          type="solid-inverted"
        />
        <iframe 
          height={IFRAME_VIEW_MULTIPLIERS.height * window.innerHeight}
          width={IFRAME_VIEW_MULTIPLIERS.width * window.innerWidth}
          src={props.url}
        />
      </Box>
    </div>
  );
}