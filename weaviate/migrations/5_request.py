import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "Request",
    "vectorIndexConfig": {
        "skip": True
    },
    "properties": [
        {
            "name": "url",
            "dataType": ["text"],
        },
        {
            "name": "prompt",
            "dataType": ["text"],
        },
        {
            "name": "finished",
            "dataType": ["boolean"],
        },
        {
            "name": "inputs",
            "dataType": ["Intermediate"],
        },
        {
            "name": "outputs",
            "dataType": ["Intermediate"],
        },
        {
            "name": "phases",
            "dataType": ["Phase"],
        }
    ],
}

client.schema.create_class(object)

