import {
    MutationFunction,
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';

type useSendDataProps = {
    success?: (data: any) => void;
    error?: (data: any) => void;
    invalidateKey?: Array<string>;
    fn: MutationFunction;
};

export const useGetData = <T>(options: UseQueryOptions) => {
    const result = useQuery(options);
    return {
        ...result,
        data: result.data as T,
    };
};

export const useSendData = ({ invalidateKey, error, success, fn }: useSendDataProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fn,
        onSuccess: (data: any) => {
            invalidateKey &&
                invalidateKey.forEach(key =>
                    queryClient.invalidateQueries({
                        queryKey: [key],
                    }),
                );
            success && success(data);
            return data;
        },
        onError: (data: any) => error && error(data),
        retry: 1,
    });
};
