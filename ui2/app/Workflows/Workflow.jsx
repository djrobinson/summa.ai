import React from "react";

import { gql, useLazyQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { globalWorkflowNameState } from "../recoil/atoms";
import Phases from "./Phases";

export const FETCH_WORKFLOW = gql`
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
  const [globalWorkflowName, setGlobalWorkflowName] = useRecoilState(
    globalWorkflowNameState
  );

  const [fetchWorkflows, { data, error, loading }] = useLazyQuery(
    FETCH_WORKFLOW,
    {
      variables: { id },
    }
  );
  React.useEffect(() => {
    fetchWorkflows();
  }, []);

  console.log("Workflow: ", data, error, loading);
  // If phases, then render them
  // if not, show DataSourceSelector
  const workflow = !isEmpty(data) ? data.Get.Workflow[0] : {};
  React.useEffect(() => {
    setGlobalWorkflowName(workflow.name);
  }, [workflow, setGlobalWorkflowName]);
  const phases =
    !isEmpty(data) && !isEmpty(data.Get.Workflow[0].phases)
      ? data.Get.Workflow[0].phases
      : [];

  return (
    <Phases phases={phases} workflowID={id} workflowTitle={workflow.name} />
  );
};

export default Workflow;
