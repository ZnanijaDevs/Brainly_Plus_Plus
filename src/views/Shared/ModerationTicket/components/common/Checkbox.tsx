import { Icon, Text } from "brainly-style-guide";

export default function Checkbox(props: {
  checked?: boolean;
  text?: string;
}) {
  const checkboxId = `checkbox-${(Math.random() + 1).toString(36).substring(5)}`;

  return (
    <label className="sg-checkbox" htmlFor={checkboxId}>
      <input defaultChecked={props.checked} type="checkbox" className="sg-checkbox__element" id={checkboxId} />
      <div className="sg-checkbox__ghost" aria-hidden="true">
        <Icon color="adaptive" size={16} type="check" />
      </div>
      {props.text && 
        <Text weight="bold" size="small" type="span">{props.text}</Text>
      }
    </label>
  );
}