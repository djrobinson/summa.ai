import React from "react";
import { buildSimpleGraphQLQuery } from "../../../utils/graphqlBuilder";
import {
  createObject,
  createRelationship,
} from "../../../utils/weaviateServices";

import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  Text,
} from "@chakra-ui/react";

import { gql, useQuery } from "@apollo/client";
import { AddIcon } from "@chakra-ui/icons";
import { isEmpty } from "lodash";
import { useRecoilValue } from "recoil";
import IntermediatesPreview from "../../../components/IntermediatesPreview";
import { apiKeyState } from "../../../recoil/atoms";
import FilterOption from "./options/FilterOption";
import LimitOption from "./options/LimitOption";
import SearchOption from "./options/SearchOption";
import SortOption from "./options/SortOption";

const updatePhaseAndAttachFilters = async (
  phase,
  prevPhaseID,
  filters,
  searches,
  limit
) => {
  const filteredFilters = filters.Intermediate.filter(
    (f) => f.valueText !== prevPhaseID
  );
  const cleanedSearches = [];
  if (!isEmpty(searches)) {
    const f = {
      objectPath: searches.nearText.path,
      value: searches.nearText.concept,
    };
    cleanedSearches.push(f);
    const filter = await createObject("Search", f);
    console.log("CREATING SEARCH: ", filter);
    await createRelationship(
      "Search",
      filter.id,
      "phase",
      "Phase",
      phase._additional.id,
      "searches"
    );
  }
  const cleanedFilters = [];
  await filteredFilters.forEach(async (fil) => {
    const f = {
      operator: fil.operator,
      objectPath: fil.path.join("."),
      value: fil.valueText,
    };
    cleanedFilters.push(f);
    const filter = await createObject("Filter", f);
    console.log("CREATING FILTER: ", filter);
    await createRelationship(
      "Filter",
      filter.id,
      "phase",
      "Phase",
      phase._additional.id,
      "filters"
    );
  });
  return [cleanedFilters, cleanedSearches];
  // REMOVING AND MOVING INTO ATOMS.JS!!!
  // if (!isEmpty(data) && !combine) {
  // localStorage.setItem(phase._additional.id, finalString);
  // const restructured = finalContexts.map((c, i) => ({
  //   text: c,
  //   order: i + 1,
  // }));
  //   const res = await batchCreate("Intermediate", restructured);
  //   const intermediateIDs = res.map((r) => r.id);
  //   await createOneToMany(
  //     "Phase",
  //     "Intermediate",
  //     phase._additional.id,
  //     intermediateIDs,
  //     "intermediates",
  //     "phases"
  //   );
  // }
  // if (!isEmpty(data) && combine) {
  //   localStorage.setItem(phase._additional.id, finalString);
  //   const onlyOne = [
  //     {
  //       text: finalString,
  //     },
  //   ];
  //   const res = await batchCreate("Intermediate", onlyOne);
  //   const intermediateIDs = res.map((r) => r.id);
  //   await createOneToMany(
  //     "Phase",
  //     "Intermediate",
  //     phase._additional.id,
  //     intermediateIDs,
  //     "intermediates",
  //     "phases"
  //   );
  // }
};

const FilterSort = ({
  phase,
  prevPhaseID,
  updatePhase,
  fields = {
    Intermediate: {
      type: "Intermediate",
      properties: ["text", "order", "phase"],
    },
    "Intermediate.phase": { type: "Phase", properties: ["title"] },
  },
}) => {
  console.log("FILTER SORT: ", phase);
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
  const defaultFiltersRaw = !isEmpty(phase.filters) ? phase.filters : [];
  const defaultFilters = defaultFiltersRaw.map((dfr) => ({
    path: dfr.objectPath.split(","),
    operator: dfr.operator,
    valueText: dfr.value,
  }));
  // Search Shape
  // {
  //   nearText: {
  //     path: 'text',
  //     concept: 'test'
  //   }
  // }
  const defaultSearchesRaw = !isEmpty(phase.searches) ? phase.searches : [];
  const defaultSearches = defaultSearchesRaw.map((dsr) => ({
    nearText: {
      path: dsr.objectPath,
      concept: dsr.value,
    },
  }));
  const defaultSearch = defaultSearches.length ? defaultSearches[0] : {};
  // Sorts shape
  // {
  //    path: 'text',
  //    order: 'desc'
  // }
  const defaultSortsRaw = !isEmpty(phase.sorts) ? phase.sorts : [];
  const defaultSorts = defaultSortsRaw.map((dsr) => ({
    path: dsr.objectPath,
    order: dsr.order,
  }));
  const defaultLimit = phase.limit;
  const allDefaults = [...defaultFilters];
  const apiKey = useRecoilValue(apiKeyState);
  const [fieldFilterIndex, setFieldFilterIndex] = React.useState(
    allDefaults.length + !isEmpty(defaultLimit) * 1
  );
  const [filters, setFilters] = React.useState({
    Intermediate: [...defaultFilters],
  });

  const [searches, setSearches] = React.useState(defaultSearch);
  const [sorts, setSorts] = React.useState([]);
  const [limit, setLimit] = React.useState(defaultLimit);
  const [showLimit, setShowLimit] = React.useState(defaultLimit > 0);

  const filtersWithPrev = {
    Intermediate: [
      {
        path: ["phase", "Phase", "id"],
        operator: "Equal",
        valueText: prevPhaseID,
      },
      ...filters.Intermediate,
    ],
  };

  const realQueryString = buildSimpleGraphQLQuery(
    fields,
    filtersWithPrev,
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
          "X-Openai-Api-Key": apiKey,
        },
      },
      variables: {
        id: prevPhaseID,
      },
    }
  );
  console.log("INTERMEDIATE RES: ", data, error, loading);
  // REMOVING AND MOVING INTO ATOMS.JS!!!
  // let finalString = "";
  // let finalContexts = [];
  // if (
  //   data &&
  //   !isEmpty(data.Get["Intermediate"]) &&
  //   data.Get["Intermediate"][0]
  // ) {
  //   finalContexts = data.Get["Intermediate"].map((int) => int.text);
  //   finalString = data.Get["Intermediate"].reduce(
  //     (acc, int) => acc + int.text,
  //     ""
  //   );
  //   finalString = finalContexts.join("\n");
  // }
  const intermediates =
    data && !isEmpty(data.Get["Intermediate"]) && data.Get["Intermediate"]
      ? data.Get["Intermediate"]
      : [];

  return (
    <Box w="600px">
      <Box h="320px">
        <FormLabel mt="5px" fontSize="xs" fontWeight="800">
          Searches
        </FormLabel>
        {!isEmpty(searches) ? (
          <SearchOption
            fields={["text"]}
            searches={searches}
            setSearches={setSearches}
          />
        ) : null}
        <Flex pt="10px" align="center">
          <IconButton
            ml="20px"
            size="xs"
            onClick={() => {
              setSearches({
                nearText: {
                  path: null,
                  concept: null,
                },
              });
            }}
            icon={<AddIcon />}
          ></IconButton>
          <Text pl="10px" fontSize="xs">
            Add Search
          </Text>
        </Flex>

        <FormLabel mt="5px" fontSize="xs" fontWeight="800">
          Filters
        </FormLabel>
        {!isEmpty(filters.Intermediate)
          ? filters.Intermediate.map((f, i) => (
              <FilterOption
                filterIndex={i}
                fields={["text"]}
                filters={filters}
                setFilters={setFilters}
              />
            ))
          : null}
        <Flex pt="10px" align="center">
          <IconButton
            ml="20px"
            size="xs"
            onClick={() => {
              setFieldFilterIndex(fieldFilterIndex + 1);
            }}
            icon={<AddIcon />}
          ></IconButton>
          <Text pl="10px" fontSize="xs">
            Add Filter
          </Text>
        </Flex>
        <FormLabel mt="5px" fontSize="xs" fontWeight="800">
          Sorts
        </FormLabel>
        {!isEmpty(sorts) ? (
          <SortOption fields={["text"]} sorts={sorts} setSorts={setSorts} />
        ) : null}
        <Flex pt="10px" align="center">
          <IconButton
            ml="20px"
            size="xs"
            onClick={() => {
              setFieldFilterIndex(fieldFilterIndex + 1);
            }}
            icon={<AddIcon />}
          ></IconButton>
          <Text pl="10px" fontSize="xs">
            Add Sort
          </Text>
        </Flex>
        <FormLabel mt="5px" fontSize="xs" fontWeight="800">
          Limit
        </FormLabel>
        {showLimit ? <LimitOption limit={limit} setLimit={setLimit} /> : null}
        {!showLimit ? (
          <Flex pt="10px" pb="10px" align="center">
            <IconButton
              ml="20px"
              size="xs"
              onClick={() => {
                setShowLimit(true);
                setLimit(10);
              }}
              icon={<AddIcon />}
            ></IconButton>
            <Text pl="10px" fontSize="xs">
              Add Limit
            </Text>
          </Flex>
        ) : null}
      </Box>
      <Box h="380px" overflowY={"scroll"}>
        <IntermediatesPreview intermediates={intermediates} />
      </Box>

      <Flex mt="10px">
        <Button
          onClick={async () => {
            console.log("FILTERS: ", filters, searches);
            const updatedPhase = {
              ...phase,
              limit: Number.parseInt(limit),
            };
            console.log("updatedPhase ", updatedPhase);
            const [cleanedFilters, cleanedSearches] =
              await updatePhaseAndAttachFilters(
                phase,
                prevPhaseID,
                filters,
                searches,
                limit
              );
            updatedPhase.searches = cleanedSearches;
            updatedPhase.filters = cleanedFilters;
            await updatePhase(phase._additional.id, updatedPhase);
          }}
          colorScheme="teal"
          rounded="full"
          flex={"1 0 auto"}
        >
          Update Config
        </Button>
      </Flex>
    </Box>
  );
};

export default FilterSort;
