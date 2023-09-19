import { isEmpty } from "lodash";



const recurseQueryLevels = (
  property,
  fields,
  parentPath,
  query,
  filters,
  iteration = 3
) => {
  const indent = "  ".repeat(iteration);
  if (
    fields[parentPath + "." + property] &&
    fields[parentPath + "." + property].properties
  ) {
    query += `\n${indent}${property} {\n${indent}  ... on ${
      fields[parentPath + "." + property].type
    } {`;
    fields[parentPath + "." + property].properties.forEach((p2) => {
      query = recurseQueryLevels(
        p2,
        fields,
        parentPath + "." + property,
        query,
        filters,
        iteration + 2
      );
    });
    query += `\n${indent}  }\n${indent}}`;
  } else {
    query += `\n${indent}${property}`;
  }
  return query;
};

export const buildNestedGraphQLQuery = (
  fields,
  filters = {},
  searches = {},
  sorts = {},
  limit = null
) => {
  let query = `{ \n  Get {`;
  const orderedFields = Object.keys(fields).sort((a, b) => {
    const aLen = a.split(".").length;
    const bLen = b.split(".").length;
    return aLen > bLen;
  });
  const topFields = orderedFields.filter((f) => !f.includes("."));
  topFields.forEach((f) => {
    if (fields[f].properties) {
      // DELETING OLD CODE SO I DON'T CONFUSE MYSELF
      // BUT LEAVING THE RECURSIVE BITS CUZ I'LL NEED TO REIMPLEMENT
      // WHEN I GET THE WEAVIATE CONNECTION WORKING AGAIN
      fields[f].properties.forEach((p) => {
        query = recurseQueryLevels(p, fields, f, query, filters);
      });
    }
  });
  if (!isEmpty(fields)) {
    query += "\n}";
  }
  query += `\n  }\n}`;
  return query;
};

const createFilter = (path, operator, valueText) => {
  return `{
path: ${JSON.stringify(path)},
operator: ${operator},
valueText: "${valueText}"
}`;
};

const createFilters = (filters, f) => {
  let filter = ''
  if (filters[f].length > 0) {
    filter += `{
operator: And,
operands: [`;
    filter += filters[f]
      .map((ff) => {
        return createFilter(ff.path, ff.operator, ff.valueText);
      })
      .join(",");
    filter += `]
}`;
  } else {
    const thisFilter = filters[f][0];
    filter = createFilter(
      thisFilter.path,
      thisFilter.operator,
      thisFilter.valueText
    );
  }
  return filter
}

const createSearches = (searches) => {
  let search = ''
  if (searches.nearText) {
    search += `\nnearText: {
concepts: ["${searches.nearText.concept}"],
distance: ${searches.nearText.distance}
}`;
}
return search
}

const createSorts = (sorts) => {
  return `[${sorts.map((f) => {
    return `{ path: "${f.path}", order: "${f.order}" }`;
  })}]`;}


export const buildSimpleGraphQLQuery = (
  types,
  filters = {},
  searches = {},
  sorts = [],
  limit = null
) => {
  let query = `{\nGet {`;
  const typeList = Object.keys(types)
  typeList.forEach((f) => {
    if (types[f].properties) {
      // Limits/filters/sorts will all end up here!
      query += `\n${f}`;
      if (!limit && isEmpty(filters) && isEmpty(searches) && isEmpty(sorts)) {
        query += ` {`;
      } else {
        query += ` (`;
        if(!isEmpty(filters)) {
          let filter = createFilters(filters, f)
          query += `\nwhere: ${filter}`;
        }
        if(!isEmpty(sorts)) {
          const sort = createSorts(sorts, f)
          query += `\nsort: ${sort}`;
        }
        if(!isEmpty(searches)) {
          query += createSearches(searches, f)
        }
        if (limit > 0) {
          query += `\nlimit: ${limit}`;
        } 
        query += `\n) {`;
      }
      types[f].properties.forEach((p) => {
        query += `\n${p}`;
      });
    }
  });
  if (!isEmpty(types)) {
    query += "\n}";
  }
  query += `\n}\n}`;
  return query;
};
