import { buildSimpleGraphQLQuery } from "../graphqlBuilder";

describe("GraphQL", () => {
  test("GraphQL Builder Blank", () => {
    const query = buildSimpleGraphQLQuery({ "Intermediate": {
        properties: ['text', 'order']} }, {}, {}, {}, 0);
    expect(query).toBe(`{
Get {
Intermediate {
text
order
}
}
}`);
  });
  test("GraphQL Builder Filter", () => {
    const query = buildSimpleGraphQLQuery({ "Intermediate": {
        properties: ['text', 'order']} }, {
          "Intermediate": [
            {
              path: "text",
              operator: "Equals",
              valueText: "hey",
            },
          ],
        }, {}, {}, 10);
    expect(query).toBe(
`{
Get {
Intermediate (
where: {
operator: And,
operands: [{
path: "text",
operator: Equals,
valueText: "hey"
}]
}
limit: 10
) {
text
order
}
}
}`
    );
  });
  test("GraphQL Builder Filters", () => {
    const query = buildSimpleGraphQLQuery({ "Intermediate": {
        properties: ['text', 'order']} }, {
          "Intermediate": [
            {
              path: "text",
              operator: "Equals",
              valueText: "hey",
            },
            {
              path: "text",
              operator: "Contains",
              valueText: "hey2",
            },
          ],
        }, {}, {}, 10);
    expect(query).toBe(
`{
Get {
Intermediate (
where: {
operator: And,
operands: [{
path: "text",
operator: Equals,
valueText: "hey"
},{
path: "text",
operator: Contains,
valueText: "hey2"
}]
}
limit: 10
) {
text
order
}
}
}`
    );
  });
  test("GraphQL Builder search", () => {
    const query = buildSimpleGraphQLQuery({ "Intermediate": {
        properties: ['text', 'order']} }, {}, {
          nearText: {
            concept: "hey",
            distance: 80,
          },
        }, [], 10);
    expect(query).toBe(
`{
Get {
Intermediate (
nearText: {
concepts: ["hey"],
distance: 80
}
limit: 10
) {
text
order
}
}
}`
    );
  });
  test("GraphQL Builder limit", () => {
    const query = buildSimpleGraphQLQuery({ "Intermediate": {
        properties: ['text', 'order']} }, {}, {}, [], 10);
    expect(query).toBe(
`{
Get {
Intermediate (
limit: 10
) {
text
order
}
}
}`);
  });
  test("GraphQL Builder sort", () => {
    const query = buildSimpleGraphQLQuery({ "Intermediate": {
        properties: ['text', 'order']} }, {}, {}, [{
          "path": "order",
          "order": "asc",
        }], 10);
    expect(query).toBe(
`{
Get {
Intermediate (
sort: [{ path: "order", order: "asc" }]
limit: 10
) {
text
order
}
}
}`);
  });
  test("GraphQL Builder mixed", () => {
    const query = buildSimpleGraphQLQuery({ "Intermediate": {
        properties: ['text', 'order']} }, {
          "Intermediate": [
            {
              path: "text",
              operator: "Equals",
              valueText: "hey",
            },
            {
              path: "text",
              operator: "Contains",
              valueText: "hey2",
            },
          ],
        }, {
          nearText: {
            concept: "hey",
            distance: 80,
          },
        }, [{
          "path": "order",
          "order": "asc",
        },
        {
          "path": "text",
          "order": "desc",
        }], 10);
    expect(query).toBe(
`{
Get {
Intermediate (
where: {
operator: And,
operands: [{
path: "text",
operator: Equals,
valueText: "hey"
},{
path: "text",
operator: Contains,
valueText: "hey2"
}]
}
sort: [{ path: "order", order: "asc" },{ path: "text", order: "desc" }]
nearText: {
concepts: ["hey"],
distance: 80
}
limit: 10
) {
text
order
}
}
}`);
  });
});
