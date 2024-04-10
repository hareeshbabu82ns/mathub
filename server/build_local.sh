docker build --no-cache -t docker.terabits.io/home/mathub-api:latest -f Dockerfile .
# docker run -d -p 24000:4000 \
  # -e MONGO_URI="mongodb://user:pwd@docker-ct.local.io:27018/?authMechanism=DEFAULT&authSource=db" \
  # -e DATABASE_URL="mongodb://user:pwd@docker-ct.local.io:27018/db?authSource=db" \
  # -e PUSH_MSG_VAPID_PUBLIC_KEY=test-key \
  # -e PUSH_MSG_VAPID_PRIVATE_KEY=test-pkey \
  # --name mathub-vite docker.terabits.io/home/mathub-api:latest
docker push docker.terabits.io/home/mathub-api:latest
cd .ansible
ansible-playbook playbook.yml -e "git_tag=latest" \
  -e "git_branch=main" -e "git_repo=mathub" \
  -e "ansible_ssh_private_key_file=~/.ssh/id_rsa_hsrv"