import { api } from "@client/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";


export const UseGet = (queryKey: string, url: string) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            const res = await api.url(url).useAuth().get();
            const data = await res.json() as any;
            if (data.error) {
                throw new Error(data.error);
            }
            //  sort the notifications by created_at in descending order
            // data.sort((a: any, b: any) => {
            //     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            // });

            return data;
        },
    });
}