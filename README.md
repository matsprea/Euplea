# Euplea
[![Build Status](https://matsprea.visualstudio.com/Euplea/_apis/build/status/matsprea.Euplea?branchName=azure-pipelines)](https://matsprea.visualstudio.com/Euplea/_apis/build/status/matsprea.Euplea?branchName=azure-pipelines)
![Release Status](https://matsprea.vsrm.visualstudio.com/_apis/public/Release/badge/2e4add35-d302-41da-b874-b272fee09237/1/1)

## Setup

This project uses `yarn` as package manager, after cloning this repository in your local directly please install its dependencies using the following command:

```bash
yarn
```

You may also want to create a  `.env.local` file in the project root to provide some ENV variables to the project with appropiates values for an [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) instance that this project uses as caching layer

```text
COSMOS_ENDPOINT='https://your-azure-cosmosdb.documents.azure.com:443/'
COSMOS_KEY='YourAzureCosmosDBKey=='
SECRET='YourSecret'
```

## How to use

Execute the following command to start the project locally:

```bash
yarn dev
```

Open the url <http://localhost:3000> with your browser
