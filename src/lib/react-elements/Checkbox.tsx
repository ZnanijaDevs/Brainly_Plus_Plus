import type { ChangeEvent } from "react";
import {
  Checkbox as DefaultCheckbox
} from "brainly-style-guide";

export default function Checkbox(props: {
  checked?: boolean;
  text?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e.target.checked);
  };

  return (
    <DefaultCheckbox
      name={props.name}
      onChange={handleChange}
      defaultChecked={props.checked}
    >
      {props.text}
    </DefaultCheckbox>
  );
}