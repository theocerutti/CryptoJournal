#!/bin/bash

build_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)

docker exec crypto-journal-backend sh -c "npm run typeorm:generate $1"
docker cp crypto-journal-backend:/app/src/migrations/ "${build_dir}/src/"
sudo chown "theo:theo" "${build_dir}/src/migrations"
sudo chmod -R 664 "${build_dir}/src/migrations/"
sudo chmod 775 "${build_dir}/src/migrations"
sudo chown -R "theo:theo" "${build_dir}/src/migrations/"
