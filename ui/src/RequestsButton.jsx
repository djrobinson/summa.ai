// Super important component.
// Must be visible at all times, and shouldn't have parent who regularly updates
// Coordinates all of the queued requests.
// Done in lieu of a backend queuing system. Not even sure that's desirable at this point.
import React from "react";

import {
  IconButton,
  Badge,
  Stack,
  Text
} from "@chakra-ui/react";

import { useRecoilState, useRecoilValue } from "recoil";
import { showRequestManagerState, clockState, requestsState } from "./recoil/atoms";
import { HiArrowsUpDown } from "react-icons/hi2";

const RequestsButton = () => {
    const [showRequests, setShowRequests] = useRecoilState(showRequestManagerState);
    const [requests, setRequests] = useRecoilState(requestsState)
    const poller = useRecoilValue(clockState(2000))
    React.useEffect(() => {
        console.log("poller: ", poller, requests)
        // todo: need some sort of "RequestsActive" state
        // also need to simply check for the number of running requests
        // need to run som calcs on the tokens. If we still have tokens,
        // run the next request.
    }, [poller, requests])
    return (
        <>
        <Stack align='center'>
        <IconButton
            fontSize="30px"
            variant="ghost"
            aria-label="open menu"
            icon={<HiArrowsUpDown />}
            onClick={() => {setShowRequests(!showRequests)}}

        />
        <Text mt='-3' fontSize="12px">LLM</Text>
        <Text mt='-3' fontSize="12px">Requests</Text>
        </Stack>
        <Stack>
        <Badge ml='1' colorScheme='green'>
        30 Complete
      </Badge>
      <Badge ml='1' colorScheme='blue'>
        10 In Progress
      </Badge>
      <Badge ml='1' colorScheme='red'>
        0 Errors
      </Badge>
      </Stack>
        
        </>
    )
}

export default RequestsButton