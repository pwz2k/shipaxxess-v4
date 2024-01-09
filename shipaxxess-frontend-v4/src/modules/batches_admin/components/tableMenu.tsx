import { Button } from "@client/components/ui/button";
import { FileDown } from "lucide-react";

const TableMenu = () => {
	return (
		<div>
			<Button size="icon" variant="outline">
				<FileDown />
			</Button>
		</div>
	);
};

export default TableMenu;
