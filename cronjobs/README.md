## Deploy

```sh
echo -n 'https://example.com' | base64
echo -n 'dummy-api-key' | base64

cd cronjobs

# Apply secrets by deploying the secrets.yaml manifest
kubectl apply -f manifests/secrets.yaml
# Edit environment variables using the base64 encoded results from above
kubectl edit secret webpage-summarizer-secrets
# Apply the cronjob by deploying the secrets.yaml manifest
kubectl apply -f manifests/kubernetes.yaml
```
