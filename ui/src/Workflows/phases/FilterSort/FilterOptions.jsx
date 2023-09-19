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
  fieldFilterIndex,
  type,
  fields,
  filters,
  setFilters,
}) => {
  const [selectedType, setSelectedType] = React.useState(null); // [type, setSelectedType] = useState(null)
  const [topPath, setTopPath] = React.useState(null);
  console.log('FILTERS: ', filters)
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
                fieldFilterIndex
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
                fieldFilterIndex
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
                fieldFilterIndex
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
              const newFilters = createFilters(
                filters,
                "path",
                e.target.value,
                type,
                fieldFilterIndex
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
                fieldFilterIndex
              );
              setFilters(newFilters);
            }}
            value={filters.valueText}
          />
        </>
      )}
      {selectedType === 'Sort' && (
        <>
          <Select
            placeholder="Select a field to sort"
            onChange={(e) => {
              const newFilters = createFilters(
                filters,
                "path",
                e.target.value,
                type,
                fieldFilterIndex
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
          <Select
            placeholder="Direction"
            onChange={(e) => {
              const newFilters = createFilters(
                filters,
                "path",
                e.target.value,
                type,
                fieldFilterIndex
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
        </>
      )}
      {selectedType === 'Limit' && (
        <>

          <Input
            placeholder="Limit"
            onChange={(e) => {
              const newFilters = createFilters(
                filters,
                "valueText",
                e.target.value,
                type,
                fieldFilterIndex
              );
              setFilters(newFilters);
            }}
            value={filters.valueText}
          />
        </>
      )}
    </Flex>
  );
};

export default FilterOptions;
