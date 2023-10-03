// Super important component!
// Must be visible at all times, and shouldn't have parent who regularly updates
// Coordinates all of the queued requests.
// Done in lieu of a backend queuing system. Not even sure that's desirable at this point.
import React from "react";

import {
  IconButton,
  Badge,
  Stack,
  Text,
  Button,
  Box
} from "@chakra-ui/react";

import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { showRequestManagerState, clockState, allRequestStatuses, rateLimitState, requestState, pendingRequestsState, doneRequestsState, erroredRequestsState, runningRequestsState } from "./recoil/atoms";
import { HiArrowsUpDown } from "react-icons/hi2";
import { getUnixNow } from "./utils/timeUtils";
import { getTokenCount } from "./utils/tokenHelpers";


const RequestsButton = () => {
    const [showRequests, setShowRequests] = useRecoilState(showRequestManagerState);
    const allRequests = useRecoilValue(allRequestStatuses)
    const rateLimit = useRecoilValue(rateLimitState)
    const poller = useRecoilValue(clockState(2000))
    const runPending = useRecoilCallback(({set}) => async (rid) => {
        set(requestState(rid), (oldR) => ({...oldR, status: 'RUNNING'}))
    })
    const dones = useRecoilValue(doneRequestsState);
    const pendings = useRecoilValue(pendingRequestsState)
    const runs = useRecoilValue(runningRequestsState)
    const errors = useRecoilValue(erroredRequestsState)
    React.useEffect(() => {
        const now = getUnixNow()
        const filteredRequests = allRequests.filter(r => now - r.start < 60)
        const pendingRequests = allRequests.filter(r => r.status === 'PENDING')
        console.log("allRequests: ", now, allRequests, filteredRequests)
        const lastMinTokens = filteredRequests.reduce((acc, curr) => {
            const tokens = getTokenCount(curr.data)
            return acc + tokens
        }, 0)
        console.log("PENDING REQUESTS: ", pendingRequests)
        console.log("last min requests: ", filteredRequests.length)
        console.log("lastMinTokens: ", lastMinTokens)
        if (lastMinTokens <= rateLimit && pendingRequests.length > 0) {
            console.log("SETTING TO ACTIVE!", pendingRequests)
            // pendingRequests.forEach(r => {
            //     runPending(r.id)
            // })
        }
    }, [poller, allRequests, rateLimit, runPending])
    return (
        <>
        <Stack align='center'>
            <IconButton
                variant="ghost"
                fontSize="30px"
                icon={<HiArrowsUpDown />}
                onClick={() => {setShowRequests(!showRequests)}}

            />
            <Stack align="center" style={{ cursor: 'pointer' }} onClick={() => {setShowRequests(!showRequests)}}>
                <Text mt='-3' fontSize="12px">LLM</Text>
                <Text mt='-3' fontSize="12px">Requests</Text>
            </Stack>
        </Stack>
        <Stack>
            <Badge colorScheme='yellow'>
                {pendings.length} Pending
            </Badge>
            <Badge colorScheme='blue'>
                {runs.length} In Progress
            </Badge>
            </Stack>
        <Stack>
            <Badge  colorScheme='green'>
                {dones.length} Complete
            </Badge>
            <Badge  colorScheme='red'>
                {errors.length} Errors
            </Badge>
        </Stack>
        </>
    )
}

export default RequestsButton