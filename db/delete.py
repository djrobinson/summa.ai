import weaviate

print("AYY")

client = weaviate.Client(
    url="http://localhost:8080",
)


try:
    client.batch.delete_objects(
        class_name="Phase",
        where={"path": ["id"], "operator": "NotEqual", "valueText": "not a uuid"},
    )
    client.schema.delete_class("Phase")

    # Returns None on success
except weaviate.exceptions.UnexpectedStatusCodeException as e:
    # 404 error if the id was not found
    print(e)
