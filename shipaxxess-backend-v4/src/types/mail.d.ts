type Payload = {
	gateway?: "postalserver" | "sendgrid" | "mailgun" | "mailjet";
	from?: string;
	to: string[];
	subject: string;
	html: string;
};

type PostalserverResponse = {
	status: "error" | "success";
	time: number;
	flags: {};
	data: {
		code: string;
		message: string;
		action: string;
		controller: string;
		message_id: string;
	};
};
