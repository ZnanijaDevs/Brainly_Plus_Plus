import { useState } from "react";
import { Flex, Radio } from "brainly-style-guide";

import _API from "@api/Brainly/Legacy";
import type { DeletionSubcategory } from "@typings/ServerReq";

import { useTicketNode } from "../../hooks";
import { Checkbox, AdaptiveButton } from "@components";
import ReasonTextarea from "./ReasonTextarea";
import SubcategoryButton from "./SubcategoryButton";

export default function DeleteItemSection() {
  const { node, updateNode } = useTicketNode();

  const reasons = System.deletionReasonsByModelId[node.modelTypeId];
  const modelId = node.id;

  const [activeReason, setActiveReason] = useState<number>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<DeletionSubcategory>(null);

  const deleteItem = async () => {
    let data = {
      id: node.id,
      takePoints: activeSubcategory.takePoints,
      reason: activeSubcategory.text,
      returnPoints: activeSubcategory.returnPoints,
      giveWarn: activeSubcategory.withWarn,
    };

    let attachmentUrls = node.attachments?.map(attachment => attachment.url);
    if (node.attachments?.length && node.isAnswer) data.reason += ` ${attachmentUrls.join(" ")}`;

    await _API[
      node.isAnswer ? "DeleteAnswer" : "DeleteQuestion"
    ](data);

    updateNode({ deleted: true });

    if (node.modelType === "question") {
      flash("default", locales.questionHasBeenDeletedInTicket, {
        sticky: true
      });

      setTimeout(() => document.getElementById("moderation-ticket-back").click(), 3000);
    }
  };

  const setSubcategory = (data: Partial<DeletionSubcategory>) => {
    setActiveSubcategory(category => 
      ({ ...category, ...data })
    );
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
          <SubcategoryButton 
            category={category}
            selected={category?.id === activeSubcategory?.id}
            onSelect={() => setSubcategory(category)} 
          />
        )}
      </Flex>}
      <ReasonTextarea 
        defaultReason={activeSubcategory?.text}
        onChange={value => setSubcategory({ text: value })}
      />
      <Flex alignItems="center" marginTop="xxs">
        <AdaptiveButton type="solid-peach" disabled={!activeSubcategory} onClick={deleteItem}>
          {locales.delete}
        </AdaptiveButton>
        <Checkbox 
          text={locales.takePtsFromAnswerers}
          checked={activeSubcategory?.takePoints}
          onChange={checked => setSubcategory({ takePoints: checked })}
        />
        {node.modelType === "question" && 
          <Checkbox 
            text={locales.takePtsFromAsker}
            checked={!activeSubcategory?.returnPoints} 
            onChange={checked => setSubcategory({ returnPoints: !checked })}
          />
        }
        <Checkbox 
          text={locales.warn}
          checked={activeSubcategory?.withWarn} 
          onChange={checked => setSubcategory({ withWarn: checked })}
        />
      </Flex>
    </Flex>
  );
}