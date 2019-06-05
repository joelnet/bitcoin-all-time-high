# Bitcoin All-Time-High Twitter Bot

Source Code for [@AllTimeHighBot](https://twitter.com/AllTimeHighBot).

Example:

![Bitcoin All-Time-High Tweet](./images/tweet.png 'Bitcoin All-Time-High Tweet')

## Configuration

Modify the following settings in `config/default.yml` or create a new `local.yml`. `local.yml` will not be checked into GIT.

Twitter API Keys: [https://apps.twitter.com](https://apps.twitter.com)

GDAX API Keys: [https://support.gdax.com/customer/en/portal/articles/2425383-how-can-i-create-an-api-key-for-gdax-](https://support.gdax.com/customer/en/portal/articles/2425383-how-can-i-create-an-api-key-for-gdax-)

```yaml
---
twitter:
  consumer_key:
  consumer_secret:
  access_token:
  access_token_secret:
gdax:
  key:
  secret:
  passphrase:
```

## Recipes

Recipes are a way to combine individual parts into a working app. Multiple recipe's can be run simultaneously.

Recipes can be turned on and off inside `config/default.yml`. Each recipe will list the plugins they require.

```yaml
recipes:
  all-time-high:
    - gdax
    - twitter
    - media
  tracker:
    - gdax
```

### all-time-high recipe

Dependencies: gdax, twitter, media

The all-time-high recipe will listen to a socket connection to gdax, wait for a new all-time-high and then publish to twitter.

![All Time High Sequence Diagram](./images/All%20Time%20High%20Flow.png 'All Time High Sequence Diagram')

### tracker

Dependencies: gdax

The tracker recipe will listen to a socket connection to gdax and log to `.data/`.

## Production Install

### Running as a shell script

```bash
# install dependencies
npm install

# build project
npm run build

# run forever
npm run start
```

### Installing as a service

```bash
# install dependencies
npm install

# build project
npm run build

# install forever-service
sudo npm install -g forever-service

# install service
sudo forever-service install all-time-high -s dist/index.js
```

### Start the service

```bash
sudo service all-time-high start
```

### Stop the service

```bash
sudo service all-time-high stop
sudo npx forever stop all-time-high
```

### Status

```bash
# list status of all services
service --status-all

# list all forever services running
sudo npx forever list
```

If tracker is running you can watch live price updates

```bash
tail -f .data/tracker-<year>-<month>-<day>.csv
```

## Docker

| Architecture | File               |
| ------------ | ------------------ |
| x86          | Dockerfile         |
| arm32v6      | Dockerfile.arm32v6 |
| arm32v7      | Dockerfile.arm32v6 |

```bash
# Pull the source
git clone https://github.com/joelnet/bitcoin-all-time-high.git

# Build the container
docker build -t joel/all-time-high -f Dockerfile .

# Create .data directory
mkdir .data

# Run the container forever
docker run --name all-time-high -v $(pwd)/.data:/var/www/.data -d --restart unless-stopped joel/all-time-high
```

Sometimes you need to log into a container to monitor it.

```bash
docker exec -it all-time-high /bin/sh
```

## License

This software is released under the [MIT license](LICENSE).

- Rocket - https://pixabay.com/en/rocket-spaceship-clip-art-clipart-2841765/
- Creative-Tail-rocket.svg - By Creative Tail [CC BY 4.0 (http://creativecommons.org/licenses/by/4.0)], via Wikimedia Commons
