import React from "react";
import {
  Select,
  Flex,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { isEmpty } from "lodash";


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

const SortOption = ({
  filterIndex,
  fields,
  sorts,
  setSorts,
}) => {
  const [topPath, setTopPath] = React.useState(null);
  return (
    <Flex p="4px">
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

    </Flex>
  );
};

export default SortOption;
