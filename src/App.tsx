import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Payout {
  dateAndTime: string;
  status: string;
  value: string;
  username: string;
}

interface Metadata {
  page: number;
  limit: number;
  totalCount: number;
}

const PayoutHistoryPage: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({ page: 1, limit: 10, totalCount: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    // Fetch payouts based on search criteria
    const fetchPayouts = async () => {
      try {
        const response = await axios.get('https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts', {
          params: {
            page: metadata.page,
            limit: metadata.limit,
            totalCount: metadata.totalCount,
          },
        });
        setPayouts(response.data.data);
        setMetadata(response.data.metadata);
      } catch (error) {
        console.error('Error fetching payouts:', error);
      }
    };

    fetchPayouts();
  }, [metadata.page]);


  const handlePageChange = (newPage: number) => {
    setMetadata({ ...metadata, page: newPage });
  };

  const handleSearchClick = () => {
    setIsSearch(true);
    // Trigger API request for search when the search button is clicked
    setMetadata({ ...metadata, page: 1 }); // Reset pagination to first page
  };

  return (
    <div>
      {/* Filter section */}
      <div>
        <input type="text" placeholder="Search by User Name" onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearchClick}>Search</button>
      </div>

      {/* Payout history table */}
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout, index) => (
            <tr key={index}>
              <td>{payout.username}</td>
              <td>{payout.dateAndTime}</td>
              <td>{payout.status}</td>
              <td>{payout.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button disabled={metadata.page === 1} onClick={() => handlePageChange(1)}>First</button>
        <button disabled={metadata.page === 1} onClick={() => handlePageChange(metadata.page - 1)}>Prev</button>
        <span>{metadata.page}</span>
        <button disabled={metadata.page === Math.ceil(metadata.totalCount / metadata.limit)} onClick={() => handlePageChange(metadata.page + 1)}>Next</button>
        <button disabled={metadata.page === Math.ceil(metadata.totalCount / metadata.limit)} onClick={() => handlePageChange(Math.ceil(metadata.totalCount / metadata.limit))}>Last</button>
      </div>
    </div>
  );
};

export default PayoutHistoryPage;
