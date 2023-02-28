import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { API_URL } from "../constants";
import { Pagination, Release } from "../types";

export default function useReleases({
  page = 1,
  perPage = 20,
  name,
  version,
}: {
  page?: number;
  perPage?: number;
  name?: string | null;
  version?: string | null;
}) {
  const query = useQuery<Pagination<Release>>(
    ["releases", page, perPage, name, version],
    async () => {
      if (name && version) {
        const url = `${API_URL}/release/${name}/${version}`;
        const res = await axios.get(url);
        return {
          items: [res.data],
          total: 1,
          page: 1,
          per: 1,
          total_pages: 1,
        };
      } else {
        const url = `${API_URL}/release?page=${page}&per=${perPage}`;
        const res = await axios.get(url);
        return res.data;
      }
    },
    {
      refetchInterval: 10,
    }
  );

  return query;
}
