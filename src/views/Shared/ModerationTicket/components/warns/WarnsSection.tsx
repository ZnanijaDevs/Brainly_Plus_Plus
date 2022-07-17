import { useState, useEffect } from "react";
import { Flex, Headline, Spinner, Accordion, Link } from "brainly-style-guide";

import type { Warn } from "@typings/";
import GetWarns from "@lib/api/Brainly/GetWarns";

import WarnEntry from "./WarnEntry";

export default function WarnsSection(props: {
  userId: number;
}) {
  const [warns, setWarns] = useState<Warn[]>(null);

  useEffect(() => {
    GetWarns(props.userId).then(warns => setWarns(warns));
  }, []);

  if (!warns) return <Spinner size="xsmall" />;

  if (!warns?.length) return (
    <Headline style={{ alignSelf: "baseline" }} size="small" color="text-red-60">
      {locales.nothingHere}
    </Headline>
  );

  return (
    <Flex direction="column">
      <Headline extraBold size="small">
        <Link target="_blank" href={`/users/view_user_warns/${props.userId}`} inherited>
          {locales.warnsV2} ({warns.filter(warn => warn.active).length})
        </Link>
      </Headline>
      <Accordion spacing="none" allowMultiple className="author-warns">
        {warns.map((warn, i) => <WarnEntry warn={warn} key={i} />)}
      </Accordion>
    </Flex>
  );
}