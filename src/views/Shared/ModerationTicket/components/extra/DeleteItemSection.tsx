import React, { useState } from "react";
import { Flex, Radio, Textarea } from "brainly-style-guide";

import type { ModelTypeID } from "@typings/";

import AdaptiveButton from "../common/AdaptiveButton";
import Checkbox from "../common/Checkbox";

const deletionReasons = {
  1: [{
    text: "все категории", 
    id: 1,
    subcategories: [{
      id: 41,
      text: "Ваш ответ дан в грубой форме. В нашем сообществе принято вежливое, дружеское общение. Пожалуйста, относитесь к другим пользователям с уважением!",
      title: "Культура :)"
    }]
  }],
  2: []
};

export default function DeleteItemSection(props: {
  modelId: number;
  modelTypeId: ModelTypeID;
}) {
  const modelId = props.modelId;
  const [activeReason, setActiveReason] = useState<number>(null);
  const [reasonText, setReasonText] = useState<string>("");

  const reasons = deletionReasons[props.modelTypeId];

  return (
    <Flex direction="column" className="delete-item-section">
      <Flex>
        {reasons.map(reason => 
          <Radio
            name={`deletionReason-${modelId}`} 
            key={reason} 
            onChange={e => setActiveReason(reason.id)}
          >{reason.text}</Radio>
        )}
      </Flex>
      {activeReason && <Flex>
        {reasons.find(reason => reason.id === activeReason).subcategories.map(category =>
          <Radio
            name={`subcategory-${modelId}`} 
            key={category.id}
            onChange={_ => setReasonText(category.text)}
          >{category.title}</Radio>
        )}
      </Flex>}
      <Textarea 
        fullWidth 
        defaultValue={reasonText} 
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setReasonText(e.currentTarget.value)
        }
      />
      <Flex alignItems="center" marginTop="xs">
        <AdaptiveButton type="solid-peach" disabled={activeReason === null}>{locales.delete}</AdaptiveButton>
        <Checkbox text="Снять баллы у ответивших" />
        <Checkbox text="Снять баллы у задающего" />
        <Checkbox text="Предупреждение" />
      </Flex>
    </Flex>
  );
}