import React from "react";
import { buildSimpleGraphQLQuery } from "../../../utils/graphqlBuilder";
import { batchCreate, createObject, createOneToMany, createRelationship } from "../../../utils/weaviateServices";

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
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import IntermediatesPreview from "../../../components/IntermediatesPreview";
import FilterOptions from "./FilterSortOptions";
import { AddIcon } from "@chakra-ui/icons";
import { apiKeyState } from "../../../recoil/atoms";
import { useRecoilValue } from "recoil";

const go = async (phase, data, finalContexts, finalString, filters, searches, limit, combine = false) => {
  console.log("FILTERS: ", filters, searches)
  const filteredFilters = filters.Intermediate.filter(f => f.valueText !== phase._additional.id)
  if (!isEmpty(searches)) {
    const filter = await createObject('Filter', {
      operator: 'nearText',
      objectPath: searches.nearText.path,
      value: searches.nearText.concept
    })
    console.log("CREATING SEARCH: ", filter)
    await createRelationship(
      "Filter",
      filter.id,
      "phase",
      "Phase",
      phase._additional.id,
      "filters"
    );
  }

  await filteredFilters.forEach(async (fil) => {
    const filter = await createObject('Filter', {
      operator: fil.operator,
      objectPath: fil.path.join('.'),
      value: fil.valueText
    })
    console.log("CREATING FILTER: ", filter)
    await createRelationship(
      "Filter",
      filter.id,
      "phase",
      "Phase",
      phase._additional.id,
      "filters"
    );
  })
  if (!isEmpty(data) && !combine) {
    localStorage.setItem(phase._additional.id, finalString);
    const restructured = finalContexts.map((c, i) => ({
      text: c,
      order: i+1
    }));
    const res = await batchCreate("Intermediate", restructured);
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
    localStorage.setItem(phase._additional.id, finalString);
    const onlyOne = [
      {
        text: finalString,
      },
    ];
    const res = await batchCreate("Intermediate", onlyOne);
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

const FilterSort = ({
  phase,
  prevPhaseID,
  fields = {
    Intermediate: { type: "Intermediate", properties: ["text", "order", "phase"] },
    "Intermediate.phase": { type: "Phase", properties: ["title"]}
  },
}) => {
  console.log('PHASE: ', phase)
  const onlyUserFacing = phase.filters ? phase.filters.filter(f => f.valueText !== phase._additional.id && f.operator !== 'nearText') : []
  const defaultFilters = onlyUserFacing.map(f => ({
    path: f.objectPath.split('.'),
    operator: f.operator,
    valueText: f.value
  }))
  const onlySearches = phase.filters ? phase.filters.filter(f => f.operator === 'nearText') : []
  const defaultSearch = !isEmpty(onlySearches) ? {
    nearText: {
      path: onlySearches[0].objectPath,
      concept: onlySearches[0].value
     }} : {}
  const apiKey = useRecoilValue(apiKeyState)
  const [fieldFilterIndex, setFieldFilterIndex] = React.useState(defaultFilters.length - 1 + !isEmpty(defaultSearch) || 1);
  const [filters, setFilters] = React.useState({
    Intermediate: [
      {
        path: ["phase", "Phase", "id"]  ,
        operator: 'Equal',
        valueText: prevPhaseID,
      },
      ...defaultFilters
    ],
  });

  const [searches, setSearches] = React.useState(defaultSearch);
  const [sorts, setSorts] = React.useState([]);
  const [limit, setLimit] = React.useState(0);
  console.log('FILTERS: ', filters, searches)

  const realQueryString = buildSimpleGraphQLQuery(
    fields,
    filters,
    searches,
    sorts,
    limit
  );
  const { data, error, loading } = useQuery(
    gql`
      ${realQueryString}
    `,
    {
      context: {
        headers: {
            "X-Openai-Api-Key": apiKey
        }
    },
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
      <Box h="200px">
        {[...Array(fieldFilterIndex)].map((item, i) => (
          <FilterOptions
            filterIndex={i}
            type={"Intermediate"}
            fields={["text", "order"]}
            filters={filters}
            setFilters={setFilters}
            sorts={sorts}
            setSorts={setSorts}
            searches={searches}
            setSearches={setSearches}
            limit={limit}
            setLimit={setLimit}

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
      <Box h="500px" overflowY={"scroll"}>
        <IntermediatesPreview intermediates={intermediates} />
      </Box>

      <Flex mt="10px">
        <Button
          onClick={async () => {
            await go(phase, data, finalContexts, finalString, filters, searches, limit, false);
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

export default FilterSort;
