import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@client/components/ui/dropdown-menu";
import { cn } from "@client/lib/utils";
import React, { ReactNode } from "react";

export const DropdownWrapper = ({
	items,
	className,
	children,
}: {
	items: ReactNode[];
	className?: string;
	children: React.JSX.Element;
}) => {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent className={cn("relative", className)}>
					{items.map((nod) => (
						<DropdownMenuItem>{nod}</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
