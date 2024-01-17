import AlertWrapper from "@client/components/common/alert";
import { Button } from "@client/components/ui/button";
import { useLoading } from "@client/hooks/useLoading";
import { api } from "@client/lib/api";
import { BatchsSelectModel } from "@db/batchs";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { BadgeDollarSign, FileDown, LifeBuoy } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const TableMenu = ({ row }: { row: Row<BatchsSelectModel> }) => {
	const queryClient = useQueryClient();

	const [refund, setRefund] = React.useState(false);
	const { button: RefundSubmitButton, setIsLoading } = useLoading({
		label: "Refund The Label",
		async click() {
			setIsLoading(true);

			const label = row.original.recipients[0];

			console.log(label);

			// const req = await api.url("/user/labels/refund").useAuth().post({ id: row.original.id });
			// const res = await req.json<{ success: boolean }>();

			// if (res.success) {
			// 	api.showSuccessToast();
			// 	setIsLoading(false);
			// 	setRefund(false);
			// 	queryClient.invalidateQueries({ queryKey: ["batches", row.original.uuid] });
			// 	return;
			// }

			// api.showErrorToast();
			// setIsLoading(false);
			// setRefund(false);
		},
	});

	return (
		<div className="flex items-center gap-2">
			{row.original.total_labels !== 1 && (
				<Link to={`/batch/${row.original.uuid}`}>
					<Button variant="outline">View</Button>
				</Link>
			)}

			{row.original.total_labels <= 1 && (
				<>
					<Button variant="outline" size="icon" disabled={row.original.is_downloaded === false}>
						<FileDown />
					</Button>

					{row.original.type === "usps" && (
						<AlertWrapper
							description="Are you sure you want to refund this label? This action cannot be undone."
							title="Are you sure you want to refund this label?"
							action={RefundSubmitButton}
							open={refund}
							setOpen={setRefund}
							trigger={
								<Button variant="outline" size="icon" disabled={row.original.status_refund === true}>
									<BadgeDollarSign />
								</Button>
							}
						/>
					)}

					<Link to={`/tickets/new?type=label&id=${row.original.uuid}`}>
						<Button variant="outline" size="icon">
							<LifeBuoy />
						</Button>
					</Link>
				</>
			)}
		</div>
	);
};

export default TableMenu;
