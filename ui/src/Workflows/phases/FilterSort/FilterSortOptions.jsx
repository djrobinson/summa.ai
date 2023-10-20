import React from "react";
import {
  Select,
  Center,
  ButtonGroup,
  Flex,
  Box,
  Text,
  Button,
  Heading,
  IconButton,
  SearchIcon,
  InputGroup,
  Input,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { isEmpty } from "lodash";

const filterTypes = {
  Equal: {},
  NotEqual: {},
  GreaterThan: {},
  GreaterThanEqual: {},
  LessThan: {},
  LessThanEqual: {},
  Like: {},
};

const searchTypes = {
  NearText: {},
};

const sortTypes = {
  Ascending: {},
  Descending: {},
};


const createSorts = (sorts, key, value, index) => {
  const newArray = [...sorts];
  if (isEmpty(newArray[index])) {
    newArray[index] = {};
  }
  newArray[index] = {
    ...newArray[index],
    [key]: value,
  };
  return newArray;
}

// The +1 is coupled to the prepopulated filter for the Phase ID!
const createFilters = (filters, key, value, field, index) => {
  const newArray = [...filters[field]];
  newArray[index + 1] = {
    ...newArray[index + 1],
    [key]: value,
  };
  return {
    ...filters,
    [field]: [...newArray],
  };
};

const FilterOptions = ({
  filterIndex,
  type,
  fields,
  filters,
  sorts,
  searches,
  limit,
  setFilters,
  setSorts,
  setSearches,
  setLimit
}) => {
  const [selectedType, setSelectedType] = React.useState(null); // [type, setSelectedType] = useState(null)
  const [topPath, setTopPath] = React.useState(null);
  return (
    <Flex p="4px">
    <Select
        placeholder="Choose type..."
        onChange={(e) => {
          setSelectedType(e.target.value);
        }}
        value={selectedType}
      >
        {['Filter', 'Search', 'Sort', 'Limit'].map((k) => (
          <option value={k}>{k}</option>
        ))}
      </Select>
      
      {selectedType === 'Filter' && (
        <>
        <Select
            placeholder="Filter type..."
            onChange={(e) => {
              const newFilters = createFilters(
                filters,
                "operator",
                e.target.value,
                type,
                filterIndex
              );
              setFilters(newFilters);
            }}
            value={filters.operator}
          >
            {Object.keys(filterTypes).map((k) => (
              <option value={k}>{k}</option>
            ))}
          </Select>
          <Select
            placeholder="Select a field to filter"
            onChange={(e) => {
              const newFilters = createFilters(
                filters,
                "path",
                e.target.value,
                type,
                filterIndex
              );
              setFilters(newFilters);
              setTopPath(e.target.value);
            }}
            value={topPath}
          >
            {fields.map((k) => (
              <option value={k}>{k}</option>
            ))}
          </Select>

          <Input
            placeholder="Value"
            onChange={(e) => {
              const newFilters = createFilters(
                filters,
                "valueText",
                e.target.value,
                type,
                filterIndex
              );
              setFilters(newFilters);
            }}
            value={filters.valueText}
          />
        </>
      )}
      {selectedType === 'Search' && (
        <>
          <Select
            placeholder="Select a field to search"
            onChange={(e) => {
              setSearches({
                nearText: {
                  path: e.target.value
                }
              });

            }}
            value={searches.nearText?.path || null}
          >
            {fields.map((k) => (
              <option value={k}>{k}</option>
            ))}
          </Select>

          <Input
            placeholder="Value"
            onChange={(e) => {
              setSearches({
                nearText: {
                  ...searches.nearText,
                  concept: e.target.value,
                }
              });
            }}
            value={searches.nearText?.concept || null}
          />
        </>
      )}
      {selectedType === 'Sort' && (
        <>
          <Select
            placeholder="Select a field to sort"
            onChange={(e) => {
              const newSorts = createSorts(sorts, "path", e.target.value, filterIndex);
              setSorts(newSorts)
              setTopPath(e.target.value);
            }}
            value={topPath}
          >
            {fields.map((k) => (
              <option value={k}>{k}</option>
            ))}
          </Select>
          <Select
            placeholder="Order"
            onChange={(e) => {
              const newSorts = createSorts(sorts, "order", e.target.value, filterIndex);
              setSorts(newSorts)
              setTopPath(e.target.value);
            }}
            value={topPath}
          >
            {['asc', 'desc'].map((k) => (
              <option value={k}>{k}</option>
            ))}
          </Select>
        </>
      )}
      {selectedType === 'Limit' && (
        <>
          <Input
            placeholder="Limit"
            onChange={(e) => {
              
              setLimit(e.target.value);
            }}
            value={limit}
          />
        </>
      )}
    </Flex>
  );
};

export default FilterOptions;
