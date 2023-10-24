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
    const [lastMinuteTokens, setLastMinuteTokens] = React.useState(0)
    const [showThrottleMessage, setShowThrottleMessage] = React.useState(0)
    const [waitTime, setWaitTime] = React.useState(0)
    const poller = useRecoilValue(clockState(1000))
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
        
        let limit = rateLimit - lastMinTokens
        pendings.forEach((p) => {
            const tokens = getTokenCount(p.prompt + ' ' + p.context)
            if (tokens < limit) {
                nextUp.push(p)
                limit = limit - tokens
            }
        })
        if (!nextUp.length && pendings.length) {
            console.log("PENDINGS: ", lastMinuteRequests, pendings, nextUp)
            const startsOnly = lastMinuteRequests.map(lmr => lmr.start)
            const latest = Math.max(...startsOnly)
            const secondsLeft = now - latest
            setWaitTime(60 - secondsLeft)
            setShowThrottleMessage(true)
        } else {
            setShowThrottleMessage(false)
            setWaitTime(0)
        }
        setLastMinuteTokens(lastMinTokens)
        if (nextUp.length) {
            nextUp.forEach((p) => {
                runPending(p.id)
            })
        }
    }, [poller, all, rateLimit, pendings, runPending])
    return (
        <>
        {showThrottleMessage ? <Text color="orange" fontWeight="800">Tokens/Minute limit reached. Waiting {waitTime} seconds for next batch...</Text> : null}
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
        <Box h="50px" bg="black" rounded={"lg"} w="180px" align="center" justify="center">
            <Text color="lime" fontSize="12px" fontWeight="800">Tokens in Last Minute</Text>
            <Text color="lime" fontSize="18px" fontWeight="300">{lastMinuteTokens} / {rateLimit} TPM</Text>
        </Box>
        
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