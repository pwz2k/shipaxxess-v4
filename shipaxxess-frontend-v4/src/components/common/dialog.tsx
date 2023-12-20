import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter,
} from "@client/components/ui/dialog";
import { cn } from "@client/lib/utils";
import { FieldValues } from "react-hook-form";
import { Form } from "@client/components/ui/form";
import { Button } from "@client/components/ui/button";
import { DialogWrapperWithFormProps } from "@client/types/dialog";

export const DialogWrapperWithForm = <T extends FieldValues>({
	trigger,
	title,
	description,
	children,
	open,
	setOpen,
	className,
	form,
	submit,
	action,
}: DialogWrapperWithFormProps<T>) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className={cn("max-w-lg", className)}>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="space-y-4" autoComplete="off">
						<DialogHeader>
							<DialogTitle>{title}</DialogTitle>
							{description && <DialogDescription>{description}</DialogDescription>}
						</DialogHeader>
						{children}
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							{action}
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
