import AlertWrapper from "@client/components/common/alert";
import { Button } from "@client/components/ui/button";
import { useLoading } from "@client/hooks/useLoading";
import React from "react";
import { Link } from "react-router-dom";

const TableMenu = ({ uuid }: { id: number; uuid: string }) => {
	const [reject, setReject] = React.useState(false);

	const { button: deleteButton, setIsLoading: deleteButtonLoading } = useLoading({
		label: "Delete Type",
		click() {
			deleteButtonLoading(true);
		},
	});

	return (
		<div className="flex gap-4">
			<Link to={`/admin/types/edit?uuid=${uuid}`}>
				<Button>Edit</Button>
			</Link>

			<AlertWrapper
				open={reject}
				setOpen={setReject}
				trigger={<Button variant="destructive">Delete</Button>}
				action={deleteButton}
				title="Delete type"
				description="Are you sure you want to delete this type?"
			/>
		</div>
	);
};

export default TableMenu;
