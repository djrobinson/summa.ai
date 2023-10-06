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
  Stack,
  Alert,
  AlertIcon,
  CloseButton,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { alertsState, requestState, requestsState, clearedAlertsState } from "./recoil/atoms";


const AlertRouter = ({ alert, close }) => {
    const type = alert.type;
    const title = alert.title;
    const message = alert.message;
    const id = alert.id;
    return (
        <Alert status={type} zIndex={10} >
          <AlertIcon />
            <Box w="full">

          <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
            {message}
            </AlertDescription>
          </Box>
          <CloseButton justify='flex-end'
                position='relative'
                right={-1}
                top={-1}
                onClick={() => close(id)}
            />
        </Alert>
    )
}

const Alerts = ({ w = "98%" }) => {
    const alerts = useRecoilValue(alertsState)
    const [clearedAlerts, setClearedAlerts] = useRecoilState(clearedAlertsState)
    const [requests, setRequests] = useRecoilState(requestsState);

    const deleteAlert = (id) => {
        setClearedAlerts(oldCA => [...clearedAlerts, id])
    }
  return (

      <Stack pos="absolute" w={w} spacing={3}>
        {alerts.map((alert) => (
            <AlertRouter alert={alert} close={deleteAlert}  />
        ))}
      </Stack>

  );
};

export default Alerts;
