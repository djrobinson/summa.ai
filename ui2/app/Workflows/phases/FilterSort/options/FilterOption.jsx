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

const FilterOption = ({
  filterIndex,
  type,
  fields,
  filters,
  setFilters,
}) => {
  const thisFilter = filters.Intermediate[filterIndex] || {}
  console.log('THIS FILTER: ', thisFilter)
  return (
    <Flex p="4px">

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
            value={thisFilter.operator}
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
            }}
            value={thisFilter.path[0]}
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
            value={thisFilter.valueText}
          />
    </Flex>
  );
};

export default FilterOption;
