declare module "react-dropdown" {
  import { Component } from "react";

  interface DropdownOption {
    value: string;
    label: string;
  }

  interface DropdownProps {
    options: DropdownOption[];
    onChange: (option: DropdownOption) => void;
    value?: string | DropdownOption;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    controlClassName?: string;
    menuClassName?: string;
    arrowClassName?: string;
    optionsClassName?: string;
  }

  export default class Dropdown extends Component<DropdownProps> {}
}
