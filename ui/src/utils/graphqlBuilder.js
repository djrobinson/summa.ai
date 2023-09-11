import { gql } from '@apollo/client'
import { isEmpty } from 'lodash'

const createFilter = (path, operator, valueText) => {
  return `{
      path: ${JSON.stringify(path)},
      operator: ${operator},
      valueText: "${valueText}"
  }`
}

const recurseQueryLevels = (
  property,
  fields,
  parentPath,
  query,
  filters,
  iteration = 3,
) => {
  const indent = '  '.repeat(iteration)
  if (
    fields[parentPath + '.' + property] &&
    fields[parentPath + '.' + property].properties
  ) {
    query += `\n${indent}${property} {\n${indent}  ... on ${
      fields[parentPath + '.' + property].type
    } {`
    fields[parentPath + '.' + property].properties.forEach((p2) => {
      query = recurseQueryLevels(
        p2,
        fields,
        parentPath + '.' + property,
        query,
        filters,
        iteration + 2,
      )
    })
    query += `\n${indent}  }\n${indent}}`
  } else {
    query += `\n${indent}${property}`
  }
  return query
}

export const buildGraphQLQuery = (
  fields,
  filters = {},
  limit = null,
) => {
  let query = `{ \n  Get {`
  const orderedFields = Object.keys(fields).sort((a, b) => {
    const aLen = a.split('.').length
    const bLen = b.split('.').length
    return aLen > bLen
  })
  const topFields = orderedFields.filter((f) => !f.includes('.'))
  topFields.forEach((f) => {
    if (fields[f].properties) {
      // Limits/filters/sorts will all end up here!
      if (!limit && isEmpty(filters)) {
        query += `\n    ${f} {`
      } else if (isEmpty(filters) && limit > 0) {
        query += `\n    ${f}(limit: ${limit}) {`
      } else {
        let filter = ''
        if (filters[f].length > 0) {
          filter += `{
            operator: And,
            operands: [`
          filter += filters[f]
            .map((ff) => {
              return createFilter(ff.path, ff.operator, ff.valueText)
            })
            .join(',')
          filter += `]
          }`
        } else {
          const thisFilter = filters[f][0]
          filter = createFilter(
            thisFilter.path,
            thisFilter.operator,
            thisFilter.valueText,
          )
        }
        query += `\n    ${f}(where: ${filter}) {`
      }

      fields[f].properties.forEach((p) => {
        query = recurseQueryLevels(p, fields, f, query, filters)
      })
    }
  })
  if (!isEmpty(fields)) {
    query += '\n    }'
  }
  query += `\n  }\n}`
  return query
}

export const buildIntermediateGraphql = (id, filters) => {
  const GET_INTERMEDIATES = `
    query GetIntermediates($id: String!) {
      Get {
        Phase(
          where: {operator: And, operands: [{ path: "id", operator: Equal, valueString: $id }]}
        ) {
          intermediates {
            ... on Intermediate {
              _additional {
                id
              }
              text
            }
          }
        }
      }
    }
  `
  return GET_INTERMEDIATES
}
