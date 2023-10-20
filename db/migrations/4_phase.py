import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "Phase",
    "vectorIndexConfig": {
        "skip": True
    },
    "properties": [
        {
            "dataType": ["text"],
            "name": "type",
        },
        {
            "dataType": ["text"],
            "name": "title",
        },
        {
            "dataType": ["text"],
            "name": "mode",
        },
        {
            "dataType": ["text"],
            "name": "selection",
        },
        {
            "dataType": ["text"],
            "name": "weaviate_url",
        },
        {
            "dataType": ["Intermediate"],
            "name": "intermediates",
        },
        {
            "dataType": ["Filter"],
            "name": "filters",
        },
        {
            "dataType": ["Workflow"],
            "name": "workflow",
        },
    ],
}

client.schema.create_class(object)

add_prop = {"dataType": ["Phase"], "name": "phase"}
client.schema.property.create("Intermediate", add_prop)
add_prop = {"dataType": ["Phase"], "name": "phases"}
client.schema.property.create("Workflow", add_prop)
add_prop = {"dataType": ["Phase"], "name": "phase"}
client.schema.property.create("Filter", add_prop)
