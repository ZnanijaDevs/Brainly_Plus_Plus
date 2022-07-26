import { useState } from "react";
import { Flex, Select } from "brainly-style-guide";
import type { UserDataInProfileType } from "@api/Brainly/GetUserProfile";

import AdaptiveButton from "@styleguide/AdaptiveButton";

import _API from "@api/Brainly/Legacy";
import BanUser, { BanType, BAN_TYPES } from "@api/BrainlyForms/BanUser";

import sendToSlack from "@lib/sendToSlack";
import makeBanMessage from "@utils/makeBanMessage";
import createProfileLink from "@utils/createProfileLink";

import type { BanMessageReason } from "@typings/";

type BanOptions = {
  activeReason: BanMessageReason;
  banType: BanType;
}

export default function BanSection(props: {
  user: UserDataInProfileType;
  onBanned: (banType: string) => void;
}) {
  const { user, onBanned } = props;

  const reasons = System.banMessage.reasons;
  const defaultReason = reasons.find(reason => reason.title === "Спам");

  const [banOptions, setBanOptions] = useState<BanOptions>({
    activeReason: defaultReason,
    banType: 3
  });

  const updateBanOptions = (data: Partial<BanOptions>) => {
    setBanOptions(prevState => ({ ...prevState, ...data }));
  };

  const banUser = async () => {
    let { banType, activeReason } = banOptions;

    if (activeReason.violator) {
      sendToSlack(
        `${System.marketBaseUrl}${createProfileLink(user.id, user.nick)} ${activeReason.title}`,
        "to-delete"
      );
    }

    await BanUser({
      userId: user.id,
      type: banType
    }, user.banTokens);

    await _API.SendMessage(
      user.id,
      makeBanMessage({
        banType,
        deleteAccount: activeReason.violator,
        reason: activeReason.title,
        reasonText: activeReason.text
      })
    );
    
    onBanned(BAN_TYPES[banType].title);
  };

  return (
    <Flex direction="column" className="ban-section">
      <Flex className="gap-s">
        {Object.keys(BAN_TYPES).map(banId => {
          let banData: {
            time?: number;
            title: string;
            shortenedTitle: string;
          } = BAN_TYPES[banId];

          return <AdaptiveButton 
            title={banData.title}
            key={banId} 
            type={banOptions.banType === +banId ? "solid" : "outline"}
            onClick={_ => updateBanOptions({ banType: +banId as BanType })}
          >{banData.shortenedTitle}</AdaptiveButton>;
        })}
      </Flex>
      <Flex alignItems="center" marginTop="xxs">
        <Select 
          options={reasons.map(reason => ({ value: reason.text, text: reason.title }))}
          value={banOptions.activeReason.text}
          onChange={e => {
            let thisReason = reasons.find(reason => reason.text === e.currentTarget.value);
            if (!thisReason) return;

            let updatedData = { activeReason: thisReason };
            if (thisReason.violator) updatedData["banType"] = 6;

            updateBanOptions(updatedData);
          }}
        />
        <AdaptiveButton 
          type="solid-green"
          onClick={banUser}
          title={`${locales.ban}!`}
          icon={{ type: "check", color: "icon-white" }}
        />
      </Flex>
    </Flex>
  );
}