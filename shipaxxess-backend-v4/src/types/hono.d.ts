type Bindings = {
	DB: D1Database;
	FRONTEND_URL: string;
	LABELS_BUCKET: R2Bucket;
	BATCH_KV: KVNamespace;
};

type Variables = {
	jwtPayload: { id: number };
};

interface App {
	Bindings: Bindings;
	Variables: Variables;
}
