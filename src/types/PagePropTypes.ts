export type SignProps = {
  swap: () => void;
};

export type HeaderProps = { title?: string; project?: string };

export type MyTextProp = {
  focus: boolean
}

export type MyButtonProps = {
  index: number;
  open: boolean;
  selected: boolean;
  handleSelected: (index: number) => {}
}

