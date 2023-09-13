import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "Field",
    "vectorIndexConfig": {
        "skip": True
    },
    "properties": [
        {
            "dataType": ["text"],
            "name": "key",
        },
        {
            "dataType": ["text"],
            "name": "alias",
        },
        {
            "dataType": ["text"],
            "name": "objectPath",
        },
    ],
}

client.schema.create_class(object)


object = {
    "class": "Filter",
    "vectorIndexConfig": {
        "skip": True
    },
    "properties": [
        {
            "dataType": ["text"],
            "name": "key",
        },
        {
            "dataType": ["text"],
            "name": "filter",
        },
        {
            "dataType": ["text"],
            "name": "value",
        },
    ],
}

client.schema.create_class(object)
