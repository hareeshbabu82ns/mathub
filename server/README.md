# MathHub API

Simple Math Questions and Answers for kids API

# Create Release
```sh
yarn release
```

# Run locally
```sh
yarn
yarn serve
```

# Docker Build
```sh
docker build . -t mathub-api
```

# Docker Run
```sh
docker run -d -p 4000:4000 \
  -e "MONGO_URI=mongodb://mathub:mathub@docker-ct.local.io:27017/mathub" 
  -e "MONGO_DATA_BASE_NAME=mathub" --name mathub-api mathub-api

docker rm -f mathub-api
```

```sh
ansible-vault decrypt inventory/host_vars/host-ct/vault.yml
ansible-vault encrypt inventory/host_vars/host-ct/vault.yml
```

## DNS issue
* Pod was not able to reach `docker-ct.local.io`
### Troublshooting
* [ref](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
* create a pod with following `dnsutils.yaml`
* test using `nslookup`
```sh
kubectl exec -i -t dnsutils -- nslookup
```
* check `resolv.conf` for current entries
```sh
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

* `solution` is to add the commented lines from `dnsutils.yaml` which will add custom `nameserver` to dns resolving
* take the remaining values from existing `resolv.conf` from other pods
* [ref](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)

```yaml
# dnsutils.yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: dnsutils
  namespace: default
spec:
  containers:
  - name: dnsutils
    image: k8s.gcr.io/e2e-test-images/jessie-dnsutils:1.3
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
  restartPolicy: Always
  # dnsPolicy: "None"
  # dnsConfig:
  #   nameservers:
  #     - 192.168.86.199
  #     - 10.43.0.10
  #   searches:
  #     - default.svc.cluster.local
  #     - svc.cluster.local
  #     - cluster.local
  #   options:
  #     - name: ndots
  #       value: "5"
```