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

const SearchOption = ({
  fields,
  searches,
  setSearches
}) => {
    console.log('SEARCHES: ', searches)
  return (
    <Flex p="4px">
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
    </Flex>
  );
};

export default SearchOption;
