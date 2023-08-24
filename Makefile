# Makefile for AWS CDK project

key-pair-file-name = cdk-ts-keypair
key-pari-id = $(shell aws ec2 describe-key-pairs --key-names ${key-pair-file-name} --query 'KeyPairs[*].KeyPairId' --output text)
public-ip = 18.141.240.204

infra:

	echo "Creating VPC...🚧"
	npm run cdk deploy CfnVpcStack
	echo "===========> VPC created successfully! 🎉 <===================="

	echo "Creating Subnet...🏖️"
	npm run cdk deploy CfnSubnetStack
	echo "==========> Subnet created successfully! 🎉 <=================="

	echo "Creating Public Route Table...🗺️"
	npm run cdk deploy CfnPubRtStack
	echo "====> Public Route Table created successfully! 🎉 <============"

	echo "Creating Nat...🦇"
	npm run cdk deploy CfnNatStack
	echo "===========> Nat created successfully! 🎉 <===================="

cluster:

	echo "Creating EKS Cluster...🧠"
	npm run cdk deploy cluster-stack
	echo "========> EKS Cluster created successfully! 🎉 <================"


destroy:


	echo "Destroying all EKS Cluster...🧠"
	yes | npm run cdk destroy cluster-stack

	echo "Destroying all Nat...☕️"
	yes | npm run cdk destroy CfnNatStack

	echo "Destroying all Public Route Table...🍵"
	yes | npm run cdk destroy CfnPubRtStack

	echo "Destroying all Subnet...🍺"
	yes | npm run cdk destroy CfnSubnetStack

	echo "Destroying all VPC...🍻"
	yes | npm run cdk destroy CfnVpcStack

ssh-gen:

	aws ssm get-parameter --name /ec2/keypair/${key-pari-id} --with-decryption --query Parameter.Value --output text > key-pair.pem
	chmod 400 key-pair.pem

ssh:

	ssh -i key-pair.pem ec2-user@${public-ip}






