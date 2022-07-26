import { Flex } from "brainly-style-guide";
import Filter from "./Filter";

export default function FiltersSection() {
  return (
    <Flex className="gap-s">
      <Filter title="Тип" />
      <Filter title="Приоритет" />
      <Filter title="Предмет" />
    </Flex>
  );
}