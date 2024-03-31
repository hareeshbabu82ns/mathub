docker build --no-cache -t docker.terabits.io/home/mathub-api:latest -f Dockerfile .
# docker run -d -p 24000:4000 \
#   -e MONGO_URI="mongodb://user:pwd@docker-ct.local.io:27018/?authMechanism=DEFAULT&authSource=db" \
#   --name mathub-vite mathub-vite:latest
docker push docker.terabits.io/home/mathub-api:latest
cd .ansible
ansible-playbook playbook.yml -e "git_tag=latest" \
  -e "git_branch=main" -e "git_repo=mathub" \
  -e "ansible_ssh_private_key_file=~/.ssh/id_rsa_hsrv"