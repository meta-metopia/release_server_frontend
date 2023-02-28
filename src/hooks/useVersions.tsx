import axios from "axios";
import { useQuery } from "react-query";
import { API_URL } from "../constants";

export default function useVersions(name: string | null) {
  const query = useQuery<string[]>(
    ["versions", name],
    async () => {
      const url = `${API_URL}/release/versions/${name}`;
      const res = await axios.get(url);
      return res.data;
    },
    {
      enabled: !!name,
      refetchInterval: 10 * 1000,
    }
  );

  return query;
}
