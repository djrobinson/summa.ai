import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "Workflow",
    "vectorIndexConfig": {
        "skip": True
    },
    "properties": [
        {
            "name": "name",
            "dataType": ["text"],
        }
    ],
}

client.schema.create_class(object)