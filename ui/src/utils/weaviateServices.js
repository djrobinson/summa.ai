import weaviate from 'weaviate-ts-client'

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080', // Replace with your endpoint
  headers: {
    'X-Openai-Api-Key':
      '***REMOVED***',
  },
})

export const deleteWorkflow = async (workflowId, fetchWorkflows) => {
  await client.data
    .deleter()
    .withClassName('Workflow') // Class of the object to be deleted
    .withId(workflowId)
    .do()
  console.log('DELETED: ', workflowId)
}

export const updatePhase = async (phaseId, phase) => {
  console.log('UPDATING THIS PHASE: ', phaseId)
  const copyPhase = { ...phase }
  //   This will always be huge. Save in localstorage for now?
  delete copyPhase.inputText
  delete copyPhase.result
  const phaseResult = await client.data
    .updater()
    .withClassName('Phase')
    .withId(phaseId)
    .withProperties({
      ...copyPhase,
    })
    .do()

  console.log(JSON.stringify(phaseResult, null, 2))
}

export const createPhase = async (workflowId, phase) => {
  console.log('SAVING THIS PHASE: ', phase)
  const copyPhase = { ...phase }
  //   This will always be huge. Save in localstorage for now?
  delete copyPhase.inputText
  const phaseResult = await client.data
    .creator()
    .withClassName('Phase')
    .withProperties({
      ...copyPhase,
    })
    .do()

  console.log(JSON.stringify(phaseResult, null, 2))

  await client.data
    .referenceCreator()
    .withClassName('Workflow')
    .withId(workflowId)
    .withReferenceProperty('phases')
    .withReference(
      client.data
        .referencePayloadBuilder()
        .withClassName('Phase')
        .withId(phaseResult.id)
        .payload(),
    )
    .do()
  return phaseResult.id
}

export const createWorkflow = async (newWorkflowTitle) => {
  const result = await client.data
    .creator()
    .withClassName('Workflow')
    .withProperties({
      name: newWorkflowTitle,
    })
    .do()

  console.log(JSON.stringify(result, null, 2))

  const phaseResult = await client.data
    .creator()
    .withClassName('Phase')
    .withProperties({
      type: 'DATA_SOURCES',
    })
    .do()

  console.log(JSON.stringify(phaseResult, null, 2))

  await client.data
    .referenceCreator()
    .withClassName('Workflow')
    .withId(result.id)
    .withReferenceProperty('phases')
    .withReference(
      client.data
        .referencePayloadBuilder()
        .withClassName('Phase')
        .withId(phaseResult.id)
        .payload(),
    )
    .do()
}

export const createOneToMany = async (
  toClass,
  fromClass,
  toID,
  fromIDs,
  toProperty,
  fromProperty,
) => {
  console.log('CREATING ONE TO MANY ', toID)
  const batcher = await client.batch.referencesBatcher()
  for (const fromID of fromIDs) {
    batcher.withReference({
      from: `weaviate://localhost/${toClass}/${toID}/${toProperty}`,
      to: `weaviate://localhost/${fromClass}/${fromID}`,
    })
    batcher.withReference({
      from: `weaviate://localhost/${fromClass}/${fromID}/${fromProperty}`,
      to: `weaviate://localhost/${toClass}/${toID}`,
    })
  }
  batcher.withConsistencyLevel('ALL')
  try {
    // hmmm so this appears to actually work???
    const res = await batcher.do()
    console.log(res)
  } catch (e) {
    console.log(e)
  }
  console.log('Created two way relationship for ', toClass, fromClass)
}
export const batchCreate = async (className, dataObjs) => {
  let batcher5 = client.batch.objectsBatcher()
  for (const dataObj of dataObjs)
    batcher5 = batcher5.withObject({
      class: className,
      properties: dataObj,
    })
  console.log('ABOUT TO DO')
  // Flush
  const res = await batcher5.do()
  console.log(res)
  return res
}
export const createObject = async (className, dataObj) => {
  const res = await client.data
    .creator()
    .withClassName(className)
    .withProperties(dataObj)
    .do()
  return res
}
export const createRelationship = async (
  fromClass,
  fromID,
  fromProperty,
  toClass,
  toID,
  toProperty,
) => {
  console.log('CREATING RELATIONSHIP ', fromID)
  const batcher = await client.batch.referencesBatcher()
  batcher.withReference({
    from: `weaviate://localhost/${fromClass}/${fromID}/${fromProperty}`,
    to: `weaviate://localhost/${toClass}/${toID}`,
  })
  batcher.withReference({
    from: `weaviate://localhost/${toClass}/${toID}/${toProperty}`,
    to: `weaviate://localhost/${fromClass}/${fromID}`,
  })
  batcher.withConsistencyLevel('ALL')
  try {
    // hmmm so this appears to actually work???
    const res = await batcher.do()
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}
