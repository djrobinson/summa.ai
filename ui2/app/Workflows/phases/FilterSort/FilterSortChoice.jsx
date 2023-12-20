import React from "react";
import { filter, isEmpty } from "lodash";
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
import FilterOptions from "./FilterSortOptions";

const TypeFilters = ({ fields, field, type, types, filters, setFilters }) => {
  const [fieldFilterIndex, setFieldFilterIndex] = React.useState(0);
  return (
    <Box pt="10px">
      <Heading size="md" pl={`${20 * field.split(".").length}px`}>
        {type}
      </Heading>
      {[...Array(fieldFilterIndex)].map((item, i) => (
        <FilterOptions
          fieldFilterIndex={i}
          field={field}
          type={fields[field].type}
          types={types}
          fields={fields}
          filters={filters}
          setFilters={setFilters}
        />
      ))}
      <Flex pt="10px">
        <IconButton
          ml="20px"
          size="xs"
          onClick={() => {
            setFieldFilterIndex(fieldFilterIndex + 1);
          }}
          icon={<AddIcon />}
        ></IconButton>
        <Text pl="10px">Add Filter</Text>
      </Flex>
    </Box>
  );
};

const FilterSortChoice = ({ types, fields, filters, setFilters }) => {
  const orderedFields = Object.keys(fields).sort((a, b) => {
    const aLen = a.split(".").length;
    const bLen = b.split(".").length;
    return aLen > bLen;
  });
  const field = orderedFields[0] || {};
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <TypeFilters
        field={field}
        type={fields[field].type}
        types={types}
        fields={fields}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default FilterSortChoice;
