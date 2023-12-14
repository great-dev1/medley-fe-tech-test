import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDebounce } from "react-use";
import useFetchFilteredPayouts from "./helpers/hooks/useFetchFilteredPayout";
import useFetchPayouts from "./helpers/hooks/useFetchPayouts";
import { DEFAULT_META_DATA } from "./helpers/constants";
import { Metadata, Payout } from "./helpers/type";
import moment from 'moment'

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
  border-radius: .2rem;
  overflow: hidden;
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

const PayoutHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayData, setDisplayData] = useState<Payout[]>([]);
  const [displayMeta, setDisplayMeta] = useState<Metadata>(DEFAULT_META_DATA);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagelimt, setPageLimit] = useState(10);
  const { fetchFilteredPayouts, fetchMore, filteredPayouts, filteredMetadata } =
    useFetchFilteredPayouts();
  const { fetchPayouts, payouts, metadata } = useFetchPayouts();

  useEffect(() => {
    fetchPayouts(0, pagelimt);
  }, [fetchPayouts, fetchFilteredPayouts, pagelimt]);

  useDebounce(
    () => {
      if (searchTerm.length > 0) fetchFilteredPayouts(searchTerm, pagelimt);
      else fetchPayouts(1, pagelimt);
    },
    1000,
    [searchTerm]
  );

  useDebounce(
    () => {
      if (!searchTerm.length) fetchPayouts(currentPage, pagelimt);
      else fetchMore(currentPage, pagelimt);
    },
    1000,
    [currentPage]
  );

  useDebounce(
    () => {
      if (!searchTerm.length) fetchPayouts(currentPage, pagelimt);
      else fetchMore(currentPage, pagelimt);
    },
    500,
    [pagelimt]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  useEffect(() => {
    setDisplayData(payouts);
  }, [payouts]);

  useEffect(() => {
    setDisplayData(filteredPayouts);
  }, [filteredPayouts]);

  useEffect(() => {
    setDisplayMeta(metadata);
  }, [metadata]);

  useEffect(() => {
    setDisplayMeta(filteredMetadata);
  }, [filteredMetadata]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleLimitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageLimit(parseInt(e.target.value));
    setCurrentPage(1);
  }, []);

  const formatDate = (date: string) => {
    return moment(date).format("YYYY-MM-DD HH:mm");
  }

  return (
    <div>
      <Container>
        <Title>Payouts</Title>
        <SubTitle>Payout History</SubTitle>
        {/* Filter section */}
        <Flex>
          <Select
            value={pagelimt}
            onChange={handleLimitChange}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Search by User Name"
              onChange={handleSearchChange}
            />
            <SearchIcon className="fa fa-search" />
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
            {displayData.length ? displayData.map((payout, index) => (
              <Trow key={index}>
                <Td>{payout.username}</Td>
                <Td>{formatDate(payout.dateAndTime)}</Td>
                <Td>
                  <Badge status={payout.status}>
                    {payout.status}
                  </Badge>
                </Td>
                <Td><b>{payout.value}</b></Td>
              </Trow>
            )) :
            <Trow>
              No data to display
            </Trow>}
          </Tbody>
        </Table>

      {/* Pagination */}
        <Pagination>
          <PageItem>
            <PageLink
              isDisable={displayMeta.page === 1 || displayMeta.totalCount === 0}
              onClick={() => handlePageChange(1)}
            >
              First
            </PageLink>
          </PageItem>
          <PageItem>
            <PageLink
              isDisable={displayMeta.page === 1 || displayMeta.totalCount === 0}
              onClick={() => handlePageChange(displayMeta.page - 1)}
            >
              Prev
            </PageLink>
          </PageItem>
          <PageItem>
            <PageLink isActive={true}>
              {displayMeta.page} /{" "}
              {Math.max(Math.ceil(displayMeta.totalCount / pagelimt), 1)}
            </PageLink>
          </PageItem>
          <PageItem>
            <PageLink
              isDisable={
                displayMeta.page === Math.ceil(displayMeta.totalCount / pagelimt) || displayMeta.totalCount === 0
              }
              onClick={() => handlePageChange(displayMeta.page + 1)}
            >
              Next
            </PageLink>
          </PageItem>
          <PageItem>
            <PageLink
              isDisable={
                displayMeta.page === Math.ceil(displayMeta.totalCount / pagelimt) || displayMeta.totalCount === 0
              }
              onClick={() =>
                handlePageChange(Math.ceil(displayMeta.totalCount / pagelimt))
              }
            >
              Last
            </PageLink>
          </PageItem>
        </Pagination>
      </Container>
    </div>
  );
};

export default PayoutHistoryPage;
