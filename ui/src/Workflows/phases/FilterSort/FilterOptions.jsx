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
  // These should always hold true together
  if (!filters[field] && index === 0) {
    return {
      ...filters,
      [field]: [
        {
          [key]: value,
        },
      ],
    };
  }
  const newArray = [...filters[field]];
  newArray[index] = {
    ...newArray[index],
    [key]: value,
  };
  return {
    ...filters,
    [field]: [...newArray],
  };
};

const FilterOptions = ({
  fieldFilterIndex,
  field,
  fields,
  filters,
  setFilters,
}) => {
  const [type, setType] = React.useState(null); // [type, setType] = useState(null)
  const [topPath, setTopPath] = React.useState(null);

  return (
    <Flex p="4px">
    <Select
        placeholder="Choose type..."
        onChange={(e) => {
          setType(e.target.value);
        }}
        value={type}
      >
        {['Filter', 'Search', 'Sort', 'Limit'].map((k) => (
          <option value={k}>{k}</option>
        ))}
      </Select>
      
      {type === 'Filter' && (
        <>
        <Select
            placeholder="Filter type..."
            onChange={(e) => {
              const newFilters = createFilters(
                filters,
                "operator",
                e.target.value,
                field,
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
                field,
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
                field,
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
