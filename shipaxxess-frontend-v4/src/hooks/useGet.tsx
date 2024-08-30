/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@client/lib/api";
import { useQuery } from "@tanstack/react-query";


export const UseGet = (queryKey: string, url: string) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: async () => {
            const res = await api.url(url).useAuth().get();
            const data = await res.json() as any;
            if (data.error) {

                throw new Error(data.error);
            }


            return data;
        },
    });
}