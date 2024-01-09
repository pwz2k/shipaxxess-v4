import { Button } from "@client/components/ui/button";
import { LabelsSelectModel } from "@db/labels";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

const ViewTableMenu = ({ row }: { row: Row<LabelsSelectModel> }) => {
	console.log(row.index);
	return (
		<>
			<Button size="icon" variant="outline">
				<MoreHorizontal size={18} />
			</Button>
		</>
	);
};

export default ViewTableMenu;
