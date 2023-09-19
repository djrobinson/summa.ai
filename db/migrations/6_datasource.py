import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

object = {
    "class": "DataSource",
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
            "name": "intermediates",
            "dataType": ["Intermediate"],
        }
    ],
}

client.schema.create_class(object)


add_prop = {
    "name": "dataSource",
    "dataType": ["DataSource"]
}
client.schema.property.create("Intermediate", add_prop)

