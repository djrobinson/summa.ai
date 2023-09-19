import weaviate

client = weaviate.Client(
    url="http://localhost:8080",
)

client.schema.delete_all()
