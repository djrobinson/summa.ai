import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "DataSource",
    "vectorIndexConfig": {
        "skip": True
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
            "name": "s3_url",
            "dataType": ["text"],
        },
        {
            "dataType": ["text"],
            "name": "weaviate_url",
        },
        {
            "name": "fields",
            "dataType": ["Field"],
        },
        {
            "name": "phases",
            "dataType": ["Phase"],
        },
    ],
}

client.schema.create_class(object)

add_prop = {"dataType": ["DataSource"], "name": "data_source"}
client.schema.property.create("Phase", add_prop)
