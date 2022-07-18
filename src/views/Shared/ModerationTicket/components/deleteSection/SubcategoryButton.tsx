import type { DeletionSubcategory } from "@typings/ServerReq";

export default function SubcategoryButton(props: {
  category: DeletionSubcategory;
  selected: boolean;
  onSelect: () => void;
}) {
  const { category, selected, onSelect } = props;

  let buttonClassName = `subcategory-button subcategory-button-${selected ? "" : "not"}-selected`;

  return (
    <button onClick={onSelect} className={buttonClassName}>
      {category.title}
    </button>
  );
}