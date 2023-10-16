import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)


# The idea is copy the full intermediateText so I don't have to make
# Intermediates themselves publishable
object = {
    "class": "Annotation",
    "vectorizer": "none",
    "vectorIndexConfig": {
        "skip": "true"
    },
    "properties": [
        {
            "name": "reportHighlightText",
            "dataType": ["text"],
        },
        {
            "name": "intermediateHighlightText",
            "dataType": ["text"],
        },
        {
            "name": "intermediateText",
            "dataType": ["text"],
        },
        {
            "name": "intermediate",
            "dataType": ["Intermediate"],
        },
        {
            "name": "report",
            "dataType": ["Report"],
        },
    ],
}

client.schema.create_class(object)


add_prop = {
    "name": "annotations",
    "dataType": ["Annotation"]
}
client.schema.property.create("Report", add_prop)

add_prop = {
    "name": "annotations",
    "dataType": ["Annotation"]
}
client.schema.property.create("Intermediate", add_prop)



