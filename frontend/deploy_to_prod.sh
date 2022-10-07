#!/bin/bash

build_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)
server="crypto-journal.light.ovh"

cd ${build_dir} && npm run build
scp -r ${build_dir}/build/ ubuntu@${server}:/home/ubuntu
ssh ubuntu@${server} "sudo rm -rf /var/www/html/* && sudo cp -r /home/ubuntu/build/* /var/www/html/ && rm -rf /home/ubuntu/build/"
