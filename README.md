# numbat-redis
Monitor your Redis with Numbat.

## Installation

```bash
npm install numbat-redis
```

## Usage

```js
var NumbatRedis = require('numbat-redis');
var emitter = new NumbatRedis({
  redis: {
    host: 'localhost',
    port: 6379
  },
  interval: 1000
});
```
