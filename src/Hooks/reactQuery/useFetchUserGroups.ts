import { useQuery, QueryOptions } from "@tanstack/react-query";
import queryKeys from "../../Constants/queryKeys";
import { fetchUserGroups } from "../../Utils/firebase";
import { FetchUserGroupsPayload } from "../../Types/firebaseTypes";

type Options = {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean
}

export const useFetchUserGroups = (params: FetchUserGroupsPayload, options: Options = {}) => {
  const enabled = options.enabled ?? !!params.user;

  return useQuery({
    queryKey: [
      queryKeys.USE_GET_USER_GROUPS,
      params.user?.uid,
    ],
    queryFn: () => fetchUserGroups(params),
    enabled: enabled,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? true,
  });
};
