import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';

const Title = styled.h1`
  font-size: 2.5em;
  font-family: sans-serif;
  margin-top: 0;
  margin-bottom: 2rem;
  color: #040529;
`;

const SubTitle = styled(Title)`
  font-size: 1.5em;
  font-family: sans-serif;
  background: #fff;
  padding: .8rem 1rem;
  border-left: 1rem solid #4caf50;
  border-top-left-radius: .3rem;
  border-bottom-left-radius: .3rem;
  box-shadow: 0 0 5px 0px #d5d5d5;
`;
const Container = styled.div`
  padding: 2rem;
`
const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`
const Select = styled.select`
    display: block;
    width: 100%;
    max-width: 150px;
    padding: 0.375rem 2.25rem 0.375rem 0.75rem;
    -moz-padding-start: calc(0.75rem - 3px);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    &:focus {
      border-color: #86b7fe;
      outline: 0;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, .25);
    }
`
const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`
const SearchInput  = styled.input`
  width: calc(100% - 2.8rem);
  padding: .6rem .6rem .6rem 2rem;
  border-radius: 4px;
  outline: none;
  border: 1px solid #ccc;
  margin-right: .5rem;
  &:focus {
    border-color: #86b7fe;
    background: #fff;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, .25);
    color: #212529;
  }
`
const SearchIcon = styled.i`
  position: absolute;
  top: .65rem;
  left: .5rem;
`
const Table = styled.table`
  width: 100%;
  margin-top: .8rem;
  margin-bottom: 1rem;
  vertical-align: top;
  border-collapse: collapse;
`
const Thead = styled.thead``
const Tbody = styled.tbody``
const ThRow = styled.tr`
  background: #0d6efd;
`
const Trow = styled.tr<{isEven?: boolean;}>`
  background: ${props => props.isEven ? '#f2f2f2' : '#ffffff'};
  &:hover {
    background: #f2f2f2;
  }
`
const Th = styled.th`
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ccc;
  color: #fff;
`
const Td = styled.td`
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  text-align: center;
`
const Pagination = styled.ul`
  display: flex;
  padding-left: 0;
  list-style: none;
  align-items: center;
  justify-content: center
`
const PageItem = styled.li``
const PageLink = styled.a<{isDisable?: boolean; isActive?: boolean}>`
  position: relative;
  padding: 0.375rem 0.75rem;
  display: block;
  color: ${props => props.isActive ? '#fff' : props.isDisable ? '#888' : '#0d6efd'};
  background-color: ${props => props.isActive ? '#0d6efd' : props.isDisable ? '#e7e7e7' : '#fff'};
  cursor: ${props => props.isDisable ? 'not-allowed' : 'pointer'};
  border: 1px solid #dee2e6;
`
const Badge = styled.span<{status?: string;}>`
  border-radius: 50rem;
  background: ${props => props.status === 'Pending' ? 'linear-gradient(0deg, #f59fa7, red);' : 'linear-gradient(0deg, #53c38f, #006100);'};
  color: #fafafa;
  display: inline-block;
  padding: 0.3rem .5rem;
  line-height: 1;
  min-width: 100px;
`

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
    // Trigger API request for search when the search Button is clicked
    setMetadata({ ...metadata, page: 1 }); // Reset pagination to first page
  };

  return (
    <div>
      <Container>
        <Title>Payouts</Title>
        <SubTitle>Payout History</SubTitle>
        {/* Filter section */}
        <Flex>
          <Select>
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </Select>
          <SearchBox>
            <SearchInput type="text" placeholder="Search by User Name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
            <SearchIcon className='fa fa-search'/>
          </SearchBox>
        </Flex>

        {/* Payout history table */}
        <Table>
          <Thead>
            <ThRow>
              <Th>User Name</Th>
              <Th>Date & Time</Th>
              <Th>Status</Th>
              <Th>Value</Th>
            </ThRow>
          </Thead>
          <Tbody>
            {payouts.map((payout, index) => (
              <Trow key={index} isEven={index % 2 === 0}>
                <Td>{payout.username}</Td>
                <Td>{payout.dateAndTime}</Td>
                <Td>
                  <Badge status={payout.status}>
                    {payout.status}
                  </Badge>
                </Td>
                <Td>{payout.value}</Td>
              </Trow>
            ))}
          </Tbody>
        </Table>
        {/* pagination */}
        <Pagination>
          <PageItem>
            <PageLink isDisable={metadata.page === 1} onClick={() => handlePageChange(1)}>First</PageLink>
          </PageItem>
          <PageItem>
            <PageLink isDisable={metadata.page === 1} onClick={() => handlePageChange(metadata.page - 1)}>Prev</PageLink>
          </PageItem>
          <PageItem>
            <PageLink isActive={true}>{metadata.page}</PageLink>
          </PageItem>
          <PageItem>
            <PageLink isDisable={metadata.page === Math.ceil(metadata.totalCount / metadata.limit)} onClick={() => handlePageChange(metadata.page + 1)}>Next</PageLink>
          </PageItem>
          <PageItem>
            <PageLink isDisable={metadata.page === Math.ceil(metadata.totalCount / metadata.limit)} onClick={() => handlePageChange(Math.ceil(metadata.totalCount / metadata.limit))}>Last</PageLink>
          </PageItem>
        </Pagination>
      </Container>
    </div>
  );
};

export default PayoutHistoryPage;
