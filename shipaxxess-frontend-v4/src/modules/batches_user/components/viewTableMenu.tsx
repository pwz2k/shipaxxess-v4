import AlertWrapper from "@client/components/common/alert";
import { Button } from "@client/components/ui/button";
import { useLoading } from "@client/hooks/useLoading";
import { LabelsSelectModel } from "@db/labels";
import { Row } from "@tanstack/react-table";
import { BadgeDollarSign, FileDown, LifeBuoy } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ViewTableMenu = ({ row }: { row: Row<LabelsSelectModel> }) => {
	const [refund, setRefund] = React.useState(false);
	const { button: RefundSubmitButton } = useLoading({ label: "Refund The Label" });

	return (
		<div className="flex items-center gap-2">
			<Button variant="outline" size="icon">
				<FileDown />
			</Button>
			<AlertWrapper
				description="Are you sure you want to refund this label? This action cannot be undone."
				title="Are you sure you want to refund this label?"
				action={RefundSubmitButton}
				open={refund}
				setOpen={setRefund}
				trigger={
					<Button variant="outline" size="icon">
						<BadgeDollarSign />
					</Button>
				}
			/>

			<Link to={`/tickets/new?type=label&id=${row.original.id}`}>
				<Button variant="outline" size="icon">
					<LifeBuoy />
				</Button>
			</Link>
		</div>
	);
};

export default ViewTableMenu;
