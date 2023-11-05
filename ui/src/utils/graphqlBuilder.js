import { isEmpty } from "lodash";

const recurseQueryLevels = (
  property,
  types,
  parentPath,
  query,
  filters,
  iteration = 3
) => {
  if (
    types[parentPath + "." + property] &&
    types[parentPath + "." + property].properties
  ) {
    query += `\n${property} {\n... on ${
      types[parentPath + "." + property].type
    } {
_additional {
  id
}`;
    types[parentPath + "." + property].properties.forEach((p2) => {
      query = recurseQueryLevels(
        p2,
        types,
        parentPath + "." + property,
        query,
        filters,
        iteration + 2
      );
    });
    query += `\n}\n}`;
  } else {
    query += `\n${property}`;
  }
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
  let filter = "";
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
  return filter;
};

const createSearches = (searches) => {
  let search = "";
  if (searches.nearText) {
    search += `\nnearText: {
concepts: ["${searches.nearText.concept}"]
}`;
  }
  return search;
};

const createSorts = (sorts) => {
  return `[${sorts.map((f) => {
    return `{ path: "${f.path}", order: ${f.order} }`;
  })}]`;
};

// TECH DEBT: TYPE ARG STRUCTURE MAKES THIS SO CONFUSING! LIMIT IT TO NOTHING BUT INTERMEDIATES.
// THIS WAS HISTORICALLY BUILT TO HANDLE ANY TYPE OF OBJECT, BUT REALLY JUST NEED IT FOR INTERS!
// THIS IS WHAT IT EXPECTS:
// {
//   Intermediate: {
//     type: "Intermediate",
//     properties: ["text", "order", "phase"],
//   },
//   "Intermediate.phase": {
//     type: "Phase",
//     properties: ["title"],
//   },
// }
export const buildSimpleGraphQLQuery = (
  types,
  filters = {},
  searches = {},
  sorts = [],
  limit = null
) => {
  console.log("SORTS: ", sorts);
  let query = `{\nGet {`;
  const orderedFields = Object.keys(types).sort((a, b) => {
    const aLen = a.split(".").length;
    const bLen = b.split(".").length;
    return aLen > bLen;
  });
  const typeList = orderedFields.filter((f) => !f.includes("."));
  typeList.forEach((f) => {
    if (types[f].properties) {
      // Limits/filters/sorts will all end up here!
      query += `\n${f}`;
      if (!limit && isEmpty(filters) && isEmpty(searches) && isEmpty(sorts)) {
        query += ` {`;
      } else {
        query += ` (`;
        if (!isEmpty(filters)) {
          let filter = createFilters(filters, f);
          query += `\nwhere: ${filter}`;
        }
        if (!isEmpty(sorts)) {
          const sort = createSorts(sorts, f);
          query += `\nsort: ${sort}`;
        }
        if (!isEmpty(searches)) {
          query += createSearches(searches, f);
        }
        if (limit > 0) {
          query += `\nlimit: ${limit}`;
        }
        query += `\n) {
_additional {
  id
}`;
      }
      types[f].properties.forEach((p) => {
        query = recurseQueryLevels(p, types, f, query, filters);
      });
    }
  });
  if (!isEmpty(types)) {
    query += "\n}";
  }
  query += `\n}\n}`;
  return query;
};
