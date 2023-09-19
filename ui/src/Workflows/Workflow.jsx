import React from "react";

import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Wrap,
  Flex,
  Box,
  Heading,
  Text,
  useColorModeValue,
  Button,
  Input,
  FormLabel,
  Center,
  Select,
} from "@chakra-ui/react";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import Checkmark from "../components/Checkmark";
import { useParams } from "react-router-dom";
import DataSourceSelector from "./phases/DataSourceSelector";
import Phases from "./Phases";

const FETCH_WORKFLOWS = gql`
  query GetWorkflow($id: String!) {
    Get {
      Workflow(where: { operator: Equal, path: ["id"], valueString: $id }) {
        _additional {
          id
        }
        name
        phases {
          ... on Phase {
            _additional {
              id
            }
            title
            mode
            type
          }
        }
      }
    }
  }
`;
const Workflow = ({}) => {
  const { id } = useParams();
  const { data, error, loading } = useQuery(FETCH_WORKFLOWS, {
    variables: { id },
  });
  console.log("Workflow: ", data, error, loading);
  // If phases, then render them
  // if not, show DataSourceSelector
  const phases = !isEmpty(data) ? data.Get.Workflow[0].phases : [];
  if (!isEmpty(phases)) {
    return <Phases phases={phases} workflowID={id} />;
  }
  return <DataSourceSelector id={id} />;
};

export default Workflow;
