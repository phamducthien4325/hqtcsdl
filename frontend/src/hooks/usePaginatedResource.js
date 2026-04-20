import { useEffect, useState } from "react";
import { api } from "../services/api";

export function usePaginatedResource(path, query) {
  const [data, setData] = useState({ items: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    api
      .get(path, { params: query })
      .then((response) => {
        if (active) {
          setData(response.data);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [path, JSON.stringify(query)]);

  return { data, loading };
}
