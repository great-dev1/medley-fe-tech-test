import axios from "axios";
import { useCallback, useState } from "react";
import { Metadata, Payout } from "../type";
import { DEFAULT_META_DATA } from "../constants";

function useFetchFilteredPayouts() {
  const [response, setResponse] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [filteredMetadata, setFilteredMetadata] = useState<Metadata>(DEFAULT_META_DATA);

  const fetchFilteredPayouts = useCallback(async (searchTerm: string, pageLimit: number) => {
    try {
      const response = await axios.get(
        `https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=${searchTerm}`
      );
      const data = response?.data || [];

      setResponse(data);
      setFilteredPayouts(data.slice(0, pageLimit));
      setFilteredMetadata({
        page: 1,
        limit: pageLimit,
        totalCount: data.length,
      });
    } catch (error) {
      console.error("Error searching payouts:", error);
    }
  }, []);

  const fetchMore = useCallback(
    (page: number, limit: number) => {
      setFilteredPayouts(response.slice((page - 1) * limit, page * limit));
      setFilteredMetadata((prev) => {
        return {
          ...prev,
          page,
          limit,
        };
      });
    },
    [response]
  );

  return { fetchFilteredPayouts, fetchMore, filteredPayouts, filteredMetadata};
}

export default useFetchFilteredPayouts;
