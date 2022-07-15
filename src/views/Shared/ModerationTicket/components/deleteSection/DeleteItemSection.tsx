import { useState, useEffect } from "react";
import { Flex, Radio } from "brainly-style-guide";

import _API from "@lib/api/Brainly/Legacy";
import type { DeletionSubcategory } from "@typings/ServerReq";
import flash from "@utils/flashes";

import { useTicketNode } from "../../hooks";
import AdaptiveButton from "@styleguide/AdaptiveButton";
import Checkbox from "@styleguide/Checkbox";
import ReasonTextarea from "./ReasonTextarea";

type DeletionOptionsType = {
  giveWarn: boolean;
  reason: string;
  returnPoints?: boolean;
  takePoints: boolean;
};

export default function DeleteItemSection() {
  const { node, updateNode } = useTicketNode();

  const reasons = System.deletionReasonsByModelId[node.modelTypeId];
  const modelId = node.id;

  const [activeReason, setActiveReason] = useState<number>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<DeletionSubcategory>(null);

  const [deleteOptions, setDeleteOptions] = useState<DeletionOptionsType>();

  const updateDeleteOptions = (options: Partial<DeletionOptionsType>) => {
    setDeleteOptions(prevState => 
      ({ ...prevState, ...options })
    );
  };

  useEffect(() => {
    if (!activeSubcategory) return;

    setDeleteOptions({
      giveWarn: activeSubcategory.withWarn,
      takePoints: activeSubcategory.takePoints,
      returnPoints: activeSubcategory.returnPoints,
      reason: activeSubcategory.text
    });
  }, [activeSubcategory]);

  const deleteItem = async () => {
    let data = { ...deleteOptions };

    let attachmentUrls = node.attachments?.map(attachment => attachment.url);
    if (node.attachments?.length && node.isAnswer) 
      data.reason += ` (${attachmentUrls.join(", ")})`;

    await _API[
      node.isAnswer ? "DeleteAnswer" : "DeleteQuestion"
    ]({ ...data, id: node.id });

    updateNode({ deleted: true });

    if (node.modelType === "question") {
      flash("default", locales.questionHasBeenDeletedInTicket, {
        sticky: true
      });

      setTimeout(() => document.getElementById("moderation-ticket-back").click(), 3000);
    }
  };

  return (
    <Flex direction="column" marginTop="xs" className="delete-item-section">
      <Flex>
        {reasons.map(reason => 
          <Radio
            name={`deletionReason-${modelId}`} 
            key={reason.id} 
            onChange={_ => setActiveReason(reason.id)}
          >{reason.text}</Radio>
        )}
      </Flex>
      {activeReason && <Flex marginTop="xxs">
        {reasons.find(reason => reason.id === activeReason).subcategories.map(category =>
          <Radio
            name={`subcategory-${modelId}`} 
            key={category.id}
            onChange={_ => setActiveSubcategory(category)}
          >{category.title}</Radio>
        )}
      </Flex>}
      <ReasonTextarea 
        defaultReason={deleteOptions?.reason}
        onChange={value => updateDeleteOptions({ reason: value })}
      />
      <Flex alignItems="center" marginTop="xxs">
        <AdaptiveButton type="solid-peach" disabled={activeReason === null} onClick={deleteItem}>
          {locales.delete}
        </AdaptiveButton>
        <Checkbox 
          text={locales.takePtsFromAnswerers}
          checked={activeSubcategory?.takePoints}
          onChange={checked => updateDeleteOptions({ takePoints: checked })}
        />
        {node.modelType === "question" && 
          <Checkbox 
            text={locales.takePtsFromAsker}
            checked={!activeSubcategory?.returnPoints} 
            onChange={checked => updateDeleteOptions({ returnPoints: !checked })}
          />
        }
        <Checkbox 
          text={locales.warn}
          checked={activeSubcategory?.withWarn} 
          onChange={checked => updateDeleteOptions({ giveWarn: checked })}
        />
      </Flex>
    </Flex>
  );
}