type ApiResponseProps = {
	payload: { code?: string; pdf?: string; id?: number; message?: string };
	message: string;
};

type ApiUpsResponseProps = { payload: { tracking?: string; pdf?: string; id?: number }; message: string };
