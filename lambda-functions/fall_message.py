import urllib3

def lambda_handler(event, context):
    http = urllib3.PoolManager()
    r = http.request('GET','http://[EC2_PUBLIC_IP]/index.php?reason=fall')
    print(r)