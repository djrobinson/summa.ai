import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "ReportItem",
    "properties": [
        {
            "name": "text",
            "dataType": ["text"],
        },
    ],
}

client.schema.create_class(object)


object = {
    "class": "Report",
    "vectorizer": "none",
    "vectorIndexConfig": {
        "skip": "true"
    },
    "properties": [
        {
            "name": "type",
            "dataType": ["text"],
        },
        {
            "name": "title",
            "dataType": ["text"],
        },
        {
            "name": "public",
            "dataType": ["boolean"],
        },
        {
            "name": "items",
            "dataType": ["ReportItem"],
        },
        {
            "name": "phase",
            "dataType": ["Phase"],
        },
        {
            "name": "workflow",
            "dataType": ["Workflow"],
        },
    ],
}

client.schema.create_class(object)


add_prop = {
    "name": "report",
    "dataType": ["Report"]
}
client.schema.property.create("ReportItem", add_prop)

add_prop = {
    "name": "reports",
    "dataType": ["Report"]
}
client.schema.property.create("Workflow", add_prop)

add_prop = {
    "name": "reports",
    "dataType": ["Report"]
}
client.schema.property.create("Phase", add_prop)

