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

const LimitOption = ({
  limit,
  setLimit
}) => {

  return (
    <Flex p="4px">
          <Input
            placeholder="Limit"
            onChange={(e) => {
              setLimit(e.target.value);
            }}
            value={limit}
          />
    </Flex>
  );
};

export default LimitOption;
