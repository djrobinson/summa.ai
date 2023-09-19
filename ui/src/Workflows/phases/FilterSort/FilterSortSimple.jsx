import React from "react";
import { buildSimpleGraphQLQuery } from "../../../utils/graphqlBuilder";
import { batchCreate, createOneToMany } from "../../../utils/weaviateServices";

import {
  Text,
  Box,
  ButtonGroup,
  Button,
  Flex,
  Code,
  IconButton,
} from "@chakra-ui/react";

import { isEmpty } from "lodash";
import FilterSortChoice from "./FilterSortChoice";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { isValidLength } from "../../../utils/tokenHelpers";
import IntermediatesPreview from "../../../components/IntermediatesPreview";
import FilterOptions from "./FilterOptions";
import { AddIcon } from "@chakra-ui/icons";

const go = async (phase, data, finalContexts, finalString, combine = false) => {
  if (!isEmpty(data) && !combine) {
    localStorage.setItem(phase._additional.id, finalString);
    const restructured = finalContexts.map((c) => ({
      text: c,
    }));
    console.log("phase._additional.id ", phase._additional.id);
    console.log("refactor restructured: ", restructured);
    const res = await batchCreate("Intermediate", restructured);
    console.log("INTERMEDIATE RES: ", res);
    const intermediateIDs = res.map((r) => r.id);
    await createOneToMany(
      "Phase",
      "Intermediate",
      phase._additional.id,
      intermediateIDs,
      "intermediates",
      "phases"
    );
  }
  if (!isEmpty(data) && combine) {
    console.log("onlyOne ", phase._additional.id);
    localStorage.setItem(phase._additional.id, finalString);
    const onlyOne = [
      {
        text: finalString,
      },
    ];
    const res = await batchCreate("Intermediate", onlyOne);
    console.log("INTERMEDIATE RES onlyOne: ", res);
    const intermediateIDs = res.map((r) => r.id);
    await createOneToMany(
      "Phase",
      "Intermediate",
      phase._additional.id,
      intermediateIDs,
      "intermediates",
      "phases"
    );
  }
};

const FilterSortSimple = ({
  phase,
  prevPhaseID,
  fields = {
    Intermediate: { type: "Intermediate", properties: ["text", "phase"] },
    "Intermediate.phase": { type: "Phase", properties: ["title"]}
  },
}) => {
  const [fieldFilterIndex, setFieldFilterIndex] = React.useState(0); // 1 because we always want to have at least one filter
  const [filters, setFilters] = React.useState({
    Intermediate: [
      {
        path: ["phase", "Phase", "id"],
        operator: 'Equal',
        valueText: prevPhaseID,
      },
    ],
  });
  // TODO: CREATE DIFFERENT INPUTS FOR EACH TYPE IN FILTEROPTIONS.JSX AND SET THESE ACCORDINGLY
  const [searches, setSearches] = React.useState({});
  const [sorts, setSorts] = React.useState([]);
  const [limit, setLimit] = React.useState(0);

  const realQueryString = buildSimpleGraphQLQuery(
    fields,
    filters,
    searches,
    sorts,
    limit
  );
  console.log("INTERMEDIATE QUERY: ", realQueryString);
  const { data, error, loading } = useQuery(
    gql`
      ${realQueryString}
    `,
    {
      variables: {
        id: prevPhaseID,
      },
    }
  );
  console.log("INTERMEDIATE RES: ", data, error, loading);
  let finalString = "";
  let finalContexts = [];
  if (data && !isEmpty(data.Get["Intermediate"]) && data.Get["Intermediate"][0]) {
    finalContexts = data.Get["Intermediate"].map((int) => int.text);
    finalString = data.Get["Intermediate"].reduce(
      (acc, int) => acc + int.text,
      ""
    );
    finalString = finalContexts.join("\n");
  }
  const intermediates = data && !isEmpty(data.Get["Intermediate"]) && data.Get["Intermediate"] ? data.Get["Intermediate"] : [];
  
  return (
    <Box w="600px">
      <Box>
        <Code>{realQueryString}</Code>
      </Box>
      <Box h="300px">
        {[...Array(fieldFilterIndex)].map((item, i) => (
          <FilterOptions
            fieldFilterIndex={i}
            type={"Intermediate"}
            fields={["text", "order"]}
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
      <Box h="370px" overflowY={"scroll"}>
        <IntermediatesPreview intermediates={intermediates} />
      </Box>

      <Flex mt="10px">
        <Button
          onClick={async () => {
            await go(phase, data, finalContexts, finalString, false);
          }}
          colorScheme="teal"
          rounded="full"
          flex={"1 0 auto"}
        >
          Generate Context
        </Button>
      </Flex>
    </Box>
  );
};

export default FilterSortSimple;
