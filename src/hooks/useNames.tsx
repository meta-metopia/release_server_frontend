import axios from "axios";
import { useQuery } from "react-query";
import { API_URL } from "../constants";

export default function useNames() {
  const query = useQuery<string[]>("names", async () => {
    const url = `${API_URL}/release/names`;
    const res = await axios.get(url);
    return res.data;
  });

  return query;
}
