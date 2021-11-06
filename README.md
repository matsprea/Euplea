# Euplea

## Setup

### Requirement

This project requires Node 14 or 16

### Install dependencies

This project uses `yarn` as package manager, after cloning this repository in your local directly please install its dependencies using the following command:

```bash
yarn
```

### ENV variables

You may also want to create a  `.env.local` file in the project root to provide some ENV variables to the project with appropiates values for an [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) instance that this project uses as caching layer

```text
COSMOS_ENDPOINT='https://your-azure-cosmosdb.documents.azure.com:443/'
COSMOS_KEY='YourAzureCosmosDBKey=='
SECRET='YourSecret'
```

## Developer mode

Execute the following command to start the project locally in developer mode:

```bash
yarn dev
```

Open the url <http://localhost:3000> with your browser

## How to run it

Execute the following command to build the project for production:

```bash
yarn build
```

To start the project in production mode, execute the following command

```bash
yarn start
```

Please make your have configured correctly the [ENV variables](#env-variables)

## Docker

A [Dockerfile](./Dockerfile) has been provided to allow to build and run the project in a container

### Build your own image

To build your own `my-euplea-image` image, execute the following command

```bash
docker build -t my-euplea-image .
```

### Run Docker image

To build run your own `my-euplea-image` image and exposing it on port 3000, execute the following command

```bash
docker run -e COSMOS_ENDPOINT -e COSMOS_KEY -e SECRET -p 3000:3000 euplea-alpine
```

Please make your have configured correctly the [ENV variables](#env-variables)
You can fine more informations about passing ENV variables on [Docker documentation](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file)
