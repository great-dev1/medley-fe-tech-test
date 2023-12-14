import axios from "axios";
import { useCallback, useState } from "react";
import { Metadata, Payout } from "../type";
import { DEFAULT_META_DATA } from "../constants";

function useFetchPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [metadata, setMetadata] = useState<Metadata>(DEFAULT_META_DATA);
  const fetchPayouts = useCallback(async (page: number, limit: number) => {
    try {
      const response = await axios.get(
        "https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts",
        {
          params: {
            page,
            limit,
          },
        }
      );
      setPayouts(response.data.data);
      setMetadata(response.data.metadata);
    } catch (er) {
      console.error("Error fetching payouts:", er);
    }
  }, []);

  return { fetchPayouts, payouts, metadata};
}

export default useFetchPayouts;
