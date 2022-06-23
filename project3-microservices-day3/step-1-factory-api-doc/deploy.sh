#!/bin/bash 
npm i -g redoc-cli

redoc-cli bundle -o index.html openapi.yaml

scp -i rlarnfma2.pem index.html ubuntu@ec2-13-125-110-144.ap-northeast-2.compute.amazonaws.com:

ssh -i "rlarnfma2.pem" ubuntu@ec2-13-125-110-144.ap-northeast-2.compute.amazonaws.com "sudo docker stop won"

ssh -i "rlarnfma2.pem" ubuntu@ec2-13-125-110-144.ap-northeast-2.compute.amazonaws.com "sudo docker rm won"

ssh -i "rlarnfma2.pem" ubuntu@ec2-13-125-110-144.ap-northeast-2.compute.amazonaws.com "sudo docker image rm won"

ssh -i "rlarnfma2.pem" ubuntu@ec2-13-125-110-144.ap-northeast-2.compute.amazonaws.com "sudo docker build -t won ."

ssh -i "rlarnfma2.pem" ubuntu@ec2-13-125-110-144.ap-northeast-2.compute.amazonaws.com "sudo docker run --name won -d -p 8089:80 won"