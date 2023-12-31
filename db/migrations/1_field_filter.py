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
            "name": "operator",
        },
        {
            "dataType": ["text"],
            "name": "objectPath",
        },
        {
            "dataType": ["text"],
            "name": "value",
        },
    ],
}

client.schema.create_class(object)

object = {
    "class": "Search",
    "vectorIndexConfig": {
        "skip": True
    },
    "properties": [
        {
            "dataType": ["text"],
            "name": "objectPath",
        },
        {
            "dataType": ["text"],
            "name": "value",
        },
    ],
}

client.schema.create_class(object)

object = {
    "class": "Sort",
    "vectorIndexConfig": {
        "skip": True
    },
    "properties": [
        {
            "dataType": ["text"],
            "name": "objectPath",
        },
        {
            "dataType": ["text"],
            "name": "order",
        },
    ],
}

client.schema.create_class(object)
