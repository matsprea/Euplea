# Euplea

## Setup

### Requirement

This project supports Node 14, 16 and 17

### Install dependencies

This project uses `yarn` as package manager, after cloning this repository in your local directly please install its dependencies using the following command:

```bash
yarn
```

## ENV variables

You may also want to create a  `.env.local` file in the project root to provide some ENV variables

```text
NEXT_PUBLIC_OVERPASS=1 # Set to 1 if you want to use the overpass-turbo API, 0 to use Sophox API
REDIS_URL=https://***.upstash.io
REDIS_TOKEN=YourRedisToken=
SECRET=YourSecret
MAP_CENTER='42.504306, 12.572639' # Initial center of the map
MAP_ZOOM=6 # Zoom level
CULTURAINSTITUTE_PER_DAY=2 # Number of cultural institutes to visit per day
NEXT_PUBLIC_AMENITY_RADIUS=2 # Radius in Kilometers for the amenities search
AMENITY_MAX_COUNT=10 # Maximum number of amenities to be returned for each day
NEXT_PUBLIC_ACCOMODATION_RADIUS=5 # Radius in Kilometers for the accomodation search
ACCOMODATION_MAX_COUNT=10 # Maximum number of accomodations to show for each day
```

### Overpass vs Sophox

It's possible to use the [overpass-turbo API](<https://overpass-turbo.eu/>) or the [Sophox API](<https://sophox.com/>) to retrieve the amenities and accomodations.

Until [this Sophox issue](<https://github.com/Sophox/sophox/issues/27>) will be resolved, the overpass-turbo API should be used.

### Cache

To improve the peformance a caching mechanism is implemented using [Upstas](<https://upstash.com/>) Redis.

To enable it you need to set the `REDIS_URL` and `REDIS_TOKEN` environment variables to the values of your account.
If you are not providing these values, the caching mechanism will be disabled.

The `SECRET` environment variable is used to hash the cache entries keys.

### Map

The map will be displayed using [Leaflet](<https://leafletjs.com/>) and it will be centered on the `MAP_CENTER` and zoomed to the `MAP_ZOOM` level.

### Itinerary

The itinerary will be created using date from [Ministero della cultura](https://www.beniculturali.it/) and you can select how many cultura institeutes you want to view per day with `CULTURAINSTITUTE_PER_DAY`.

### Amenities and Accomodations

You can set the `NEXT_PUBLIC_AMENITY_RADIUS` and `NEXT_PUBLIC_ACCOMODATION_RADIUS` to the maximum radius in Kilometers to be searched around each cultural institute.

`AMENITY_MAX_COUNT` and `ACCOMODATION_MAX_COUNT` is used to configure the maximum number of results to returned for each cultura institute.

## Developer mode

Execute the following command to start the project locally in developer mode:

```bash
pnpm dev
```

Open the url <http://localhost:3000> with your browser

## Production

### How to run it

Execute the following command to build the project for production:

```bash
pnpm build
```

To start the project in production mode, execute the following command

```bash
pnpm start
```

Please make your have configured correctly the [ENV variables](#env-variables)

### Docker

A [Dockerfile](./Dockerfile) has been provided to allow to build and run the project in a container

### Package

[![Create and publish a Docker image](https://github.com/matsprea/Euplea/actions/workflows/release-docker-image.yml/badge.svg)](https://github.com/matsprea/Euplea/actions/workflows/release-docker-image.yml)

Docker image packages are available on [Github Package](https://github.com/matsprea/Euplea/pkgs/container/euplea)
To use the Docker image, execute the following command:

```bash
docker pull ghcr.io/matsprea/euplea
```

### Build your own image

To build your own `euplea` image, execute the following command:

```bash
docker build -t euplea .
```

### Run Docker image

To run your `euplea` image and exposing it on port 3000, execute the following command

```bash
docker run --env-file ./env.list -p 3000:3000 euplea
```

To run the `euplea` image published and exposing it on port 3000, execute the following command

```bash
docker run --env-file ./env.list -p 3000:3000  ghcr.io/matsprea/euplea
```

Please make your have configured correctly the [ENV variables](#env-variables) in the `env.list` file

You can fine more informations about passing ENV variables on [Docker documentation](https://docs.docker.com/engine/reference/commandline/run/#env)
