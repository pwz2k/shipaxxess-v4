import { FieldValues, UseFormReturn } from "react-hook-form";

export interface DialogWrapperWithFormProps<T extends FieldValues> {
	trigger: React.JSX.Element;
	children?: React.JSX.Element | never[];
	title: string;
	description?: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	className?: string;
	form: UseFormReturn<T>;
	submit: (values: T) => void;
	action: React.JSX.Element;
}
