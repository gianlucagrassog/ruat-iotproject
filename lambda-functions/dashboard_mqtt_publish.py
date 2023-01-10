import boto3
import json

def lambda_handler(event, context):
        client = boto3.client('iot-data', region_name='eu-west-1')
        response = client.publish(
                topic='ruat/esp1/dash',
                qos=1,
                payload=json.dumps({"From dashboard":"Received"})
            )