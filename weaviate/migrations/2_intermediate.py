import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "Intermediate",
    "properties": [
        {
            "name": "text",
            "dataType": ["text"],
        },
        {
            "name": "start",
            "dataType": ["int"],
        },
        {
            "name": "end",
            "dataType": ["int"],
        },
        {
            "dataType": ["text"],
            "name": "userid",
        },
        {
            "dataType": ["boolean"],
            "name": "public",
        },
        {
            "dataType": ["boolean"],
            "name": "isResult",
        },
        {"name": "source", "dataType": ["Intermediate"]},
        {"name": "sourceFor", "dataType": ["Intermediate"]},
    ],
}

client.schema.create_class(object)
