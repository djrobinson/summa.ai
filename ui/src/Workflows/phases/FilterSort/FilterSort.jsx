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

const generateContext = async (phase, data, finalContexts, finalString, filters, searches, combine = false) => {
  console.log("FILTERS: ", filters, searches)
  const filteredFilters = filters.Intermediate.filter(f => f.valueText !== phase._additional.id)
  if (!isEmpty(searches)) {
    const filter = await createObject('Search', {
      objectPath: searches.nearText.path,
      value: searches.nearText.concept
    })
    console.log("CREATING SEARCH: ", filter)
    await createRelationship(
      "Search",
      filter.id,
      "phase",
      "Phase",
      phase._additional.id,
      "search"
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
  // 1. Extract all filters, search, limits, sorts
  // 2. Set defaults
  // 3. Create a megadefault with everything
  // 4. Iterate over it all
  // 5. setFieldFilterIndex to megadefault length
  // Filter Shape
  // {
  //   path: ["phase", "Phase", "id"]  ,
  //   operator: 'Equal',
  //   valueText: prevPhaseID,
  // }
  const defaultFiltersRaw = !isEmpty(phase.filters) ? phase.filters : []
  const defaultFilters = defaultFiltersRaw.map(dfr => ({
    path: dfr.objectPath.split(','),
    operator: dfr.operator,
    valueText: dfr.value
  }))
  // Search Shape
  // {
  //   nearText: {
  //     path: 'text',
  //     concept: 'test'
  //   }
  // }
  const defaultSearchesRaw = !isEmpty(phase.searches) ? phase.searches : []
  const defaultSearches = defaultSearchesRaw.map(dsr => ({
    nearText: {
      path: dsr.objectPath,
      concept: dsr.concept
    }
  }))
  const defaultSearch = defaultSearches.length ? defaultSearches[0] : {}
  // Sorts shape
  // {
  //    path: 'text',
  //    order: 'desc'
  // }
  const defaultSortsRaw = !isEmpty(phase.sorts) ? phase.sorts : []
  const defaultSorts = defaultSortsRaw.map(dsr => ({
    path: dsr.objectPath,
    order: dsr.order
  }))
  const defaultLimit = phase.limit
  const allDefaults = [...defaultFilters, ...defaultSearches, ...defaultSorts]
  console.log('ALL DEFAULTS ', allDefaults)
  const apiKey = useRecoilValue(apiKeyState)
  const [fieldFilterIndex, setFieldFilterIndex] = React.useState(allDefaults.length + !isEmpty(defaultLimit) * 1);
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
  const [limit, setLimit] = React.useState(defaultLimit);
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
            fields={["text"]}
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
            await generateContext(phase, data, finalContexts, finalString, filters, searches, limit, false);
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
