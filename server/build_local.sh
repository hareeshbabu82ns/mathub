docker build --no-cache -t docker.terabits.io/home/mathub-api:latest -f Dockerfile .
docker push docker.terabits.io/home/mathub-api:latest
cd .ansible
ansible-playbook playbook.yml -e "git_tag=latest"