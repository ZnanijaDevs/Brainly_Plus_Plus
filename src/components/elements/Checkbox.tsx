import { useState, useEffect } from "react";
import { Checkbox as DefaultCheckbox } from "brainly-style-guide";

export default function Checkbox(props: {
  checked?: boolean;
  text?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(props.checked);
  
  useEffect(() => setChecked(props.checked), [props.checked]);
  useEffect(() => {
    if (checked !== props.checked) props.onChange?.(checked);
  }, [checked]);

  return (
    <DefaultCheckbox 
      name={props.name} 
      onChange={e => setChecked(e.currentTarget.checked)} 
      checked={checked}
    >
      {props.text}
    </DefaultCheckbox>
  );
}