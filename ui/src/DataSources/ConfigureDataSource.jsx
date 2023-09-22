import React from "react";

import { useLazyQuery, gql, useQuery } from "@apollo/client";

import { FaPlay, FaRegSave } from "react-icons/fa";
import { FiFile, FiRefreshCcw } from "react-icons/fi";
import axios from "axios";
import {
  Icon,
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  InputGroup,
  InputLeftElement,
  Textarea,
  RadioGroup,
  Radio,
  Wrap,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { isValidLength } from "../utils/tokenHelpers";
import DataSourceSplitWizard from "./DataSourceSplitWizard";
import SourceSelector from "./SourceSelector";
import ConfirmDataSource from "./ConfirmDataSource";

const FETCH_DATA_SOURCE = gql`
  {
    Get {
      DataSource {
        _additional {
          id
        }
        type
        title
        s3_url
        weaviate_url
      }
    }
  }
`;

// https://codesandbox.io/s/assignment-121-animate-checkmark-solution-jggkm
// Rework this for loading state

const ConfigureDataSource = ({ uuid, setShowConfigure, setDsID }) => {
  const [pasted, setPasted] = React.useState("");

  return (
    <Flex>
      <SourceSelector
        pasted={pasted}
        setPasted={setPasted}
        setShowConfigure={setShowConfigure}
        setDsID={setDsID}
      />
      <DataSourceSplitWizard dataSourceID={uuid} inputText={pasted} />
      <ConfirmDataSource dataSourceID={uuid} />
    </Flex>
  );
};

export default ConfigureDataSource;
