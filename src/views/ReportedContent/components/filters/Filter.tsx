import clsx from "clsx";
import { Icon, Text, Flex } from "brainly-style-guide";
import { useState } from "react";

import AdaptiveButton from "@styleguide/AdaptiveButton";
import Checkbox from "@styleguide/Checkbox";

const CLASS_NAME = "reported-content-filter";

export default function Filter(props: {
  title: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <div>
      <div
        className={clsx(
          CLASS_NAME, 
          { [`${CLASS_NAME}--active`]: active }
        )}
        onClick={_ => setActive(prevState => !prevState)}
      >
        <Text size="small" type="span">{props.title}</Text>
        <Icon color="icon-gray-70" size={16} type={active ? "arrow_up" : "arrow_down"} />
      </div>
      <div hidden={!active} className="filter-box">
        <Flex direction="column" className="filter-list">
          {Array.from({ length: 20 }).map((_, i) => 
            <Flex className="filter-list-item" key={i}>
              <Checkbox />
              <span>Не тот предмет</span>
            </Flex>
          )}
        </Flex>
        <Flex fullWidth>
          <AdaptiveButton type="solid">
            Применить
          </AdaptiveButton>
        </Flex>
      </div>
    </div>
  );
} 