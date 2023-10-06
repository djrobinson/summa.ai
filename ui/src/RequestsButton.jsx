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
    const rateLimit = useRecoilValue(rateLimitState)
    const poller = useRecoilValue(clockState(2000))
    const runPending = useRecoilCallback(({set}) => async (rid) => {
        console.log('running ', rid)
        set(requestState(rid), (oldR) => ({ ...oldR, status: 'RUNNING', start: getUnixNow() }))
    })
    const dones = useRecoilValue(doneRequestsState);
    const pendings = useRecoilValue(pendingRequestsState)
    const runs = useRecoilValue(runningRequestsState)
    const errors = useRecoilValue(erroredRequestsState)
    
    const all = useRecoilValue(allRequestStatuses)
    
    React.useEffect(() => {
        const nextUp = [];
        const now = getUnixNow();
        const lastMinute = now - 60;
        const lastMinuteRequests = all.filter(r => r.start && r.start > lastMinute)
        const lastMinTokens = lastMinuteRequests.reduce((acc, r) => acc + getTokenCount(r.prompt + ' ' + r.context), 0)
        console.log('lastMinuteRequests ', all, lastMinuteRequests)
        let limit = rateLimit - lastMinTokens
        console.log('lastMinTokens ', lastMinTokens, rateLimit, limit, pendings)
        pendings.forEach((p) => {
            const tokens = getTokenCount(p.prompt + ' ' + p.context)
            if (tokens < limit) {
                nextUp.push(p)
                limit = limit - tokens
            }
        })
        if (nextUp.length) {
            nextUp.forEach((p) => {
                console.log("Wed run this: ", p)
                runPending(p.id)
            })
        }
    }, [poller, all, rateLimit, pendings, runPending])
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