import { Button } from "@client/components/ui/button";
import { api } from "@client/lib/api";
import { RefundsSelectModel } from "@db/refunds";
import { Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import React from "react";

const TableMenu = ({ row }: { row: Row<RefundsSelectModel> }) => {
	const [recycleLoading, setRecycleLoading] = React.useState(false);
	const [refundLoading, setRefundLoading] = React.useState(false);

	const recycle = async () => {
		setRecycleLoading(true);

		const req = await api.url(`/admin/refunds/recycle/${row.original.batch_uuid}`).useAuth().get();
		const res = await req.json<{ success: boolean; message: string }>();

		if (res.success) {
			setRecycleLoading(false);
			return api.showSuccessToast();
		}

		api.showErrorToast();
		setRecycleLoading(false);
	};

	const refund = async () => {
		setRefundLoading(true);
	};

	return (
		<div className="flex items-center gap-3">
			<Button
				onClick={refund}
				variant={"outline"}
				disabled={refundLoading ? true : row.original.is_refunded || false}
				className="gap-2">
				{refundLoading && <Loader2 className="animate-spin" size={16} />}
				Refund Fund
			</Button>
			<Button
				onClick={recycle}
				variant={"outline"}
				className="gap-2"
				disabled={recycleLoading ? true : row.original.is_recycled || false}>
				{recycleLoading && <Loader2 className="animate-spin" size={16} />}
				Recycle
			</Button>
		</div>
	);
};

export default TableMenu;
