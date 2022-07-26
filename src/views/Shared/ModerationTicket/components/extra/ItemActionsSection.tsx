import { useState } from "react";
import { Flex } from "brainly-style-guide";

import _API from "@api/Brainly/Legacy";
import { useTicketNode } from "../../hooks";
import AdaptiveButton from "@styleguide/AdaptiveButton";

import DeleteItemSection from "../deleteSection/DeleteItemSection";
import CorrectItemSection from "../correction/CorrectItemSection";

type SectionDataType = "correction" | "delete";

export default function ItemActionsSection() {
  const { node, updateNode } = useTicketNode();
  const viewer = System.viewer;

  const [visibleSection, setVisibleSection] = useState<SectionDataType>(null);
  const setSection = (section: SectionDataType) =>
    setVisibleSection(
      visibleSection === section ? null : section
    );

  if (node.deleted) return null;

  const acceptItem = async () => {
    await _API.AcceptContent(node.id, node.modelTypeId);

    updateNode({
      isReported: false,
      report: null,
      correction: null
    });
  };

  const deleteItemAsSpam = async () => {
    if (!confirm(locales.doYouWantToDeleteThisAnswerAsSpam)) return;

    let deletionReason = `${locales.spamAnswerDeletionReason}`;
    node.attachments.forEach(attachment => {
      deletionReason += ` ${attachment.url}`;
    });

    await _API.DeleteAnswer({ id: node.id, giveWarn: true, reason: deletionReason });
    updateNode({ deleted: true });
  };

  const approveItem = async () => {
    await _API.ApproveAnswer(node.id);
    updateNode({ isApproved: true, correction: null });
  };

  const unapproveItem = async () => {
    await _API.UnapproveAnswer(node.id);
    updateNode({ isApproved: false });
  };

  return (<>
    <Flex className="gap-s" marginTop="s" alignItems="center">
      {node.isApproved ? (
        viewer.canUnapprove && 
          <AdaptiveButton icon={{ type: "verified", color: "icon-white" }} onClick={unapproveItem}>
            {locales.unapprove}
          </AdaptiveButton>
      ) : <>
        <AdaptiveButton 
          size="m" 
          type="outline-peach"
          icon={{ type: "trash", size: 24 }}
          title={locales.delete}
          onClick={_ => setSection("delete")}
        />
        {((node.isReported || !!node.correction) && viewer.canAccept) && 
          <AdaptiveButton
            title={locales.accept}
            size="m"
            type="solid-green"
            icon={{ type: "check", size: 24 }}
            onClick={acceptItem}
          />
        }
        {node.isAnswer && <>
          {!node.author.isModerator && <AdaptiveButton 
            title={locales.deleteAsSpamWithWarn}
            size="m" 
            type="solid-orange"
            icon={{ type: "close", size: 24 }} 
            onClick={deleteItemAsSpam}
          />}
          {(node.correction == null && viewer.canSendAnswersForCorrection) && <AdaptiveButton 
            title={locales.sendForCorrection}
            size="m" 
            type="outline-indigo"
            icon={{ type: "pencil", color: "icon-indigo-50", size: 24 }} 
            onClick={_ => setSection("correction")}
          />}
          {(!node.isApproved && viewer.canApprove) && 
            <AdaptiveButton 
              size="m" 
              icon={{ type: "verified", color: "icon-white", size: 24 }}
              title={locales.approve}
              type="solid-green"
              onClick={approveItem}
            />
          }
        </>}
      </>}
    </Flex>
    {visibleSection === "delete" && <DeleteItemSection />}
    {(visibleSection === "correction" && node.correction == null) && <CorrectItemSection />}
  </>);
}