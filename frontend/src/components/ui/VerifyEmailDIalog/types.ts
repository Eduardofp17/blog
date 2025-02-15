type ViewProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
};

type IProps = {} & ViewProps;

export type { ViewProps, IProps };
