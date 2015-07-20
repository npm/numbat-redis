var bole = require('bole');
var redis = require('redis');
var redisInfo = require('redis-info');
var NumbatEmitter = require('numbat-emitter');

var DEFAULT_INTERVAL = 1000;

var RedisProducer = module.exports = function(options) {
  var emitter = new NumbatEmitter(options);
  setInterval(produce, options.interval || DEFAULT_INTERVAL);

  var logger = options.logger || bole('numbat-redis');

  var client = redis.createClient(options.redis);

  function produce() {
    client.info(function (err, info) {
      if (err) {
        logger.error('error while trying to retrieve Redis stats', err);
        return;
      }

      var parsed = redisInfo.parse(info);

      emitter.metric({
        name: 'redis.clients',
        description: 'Clients connected',
        value: parseInt(parsed.fields.connected_clients, 10)
      });

      emitter.metric({
        name: 'redis.blocked-clients',
        description: 'Clients waiting for a blocking operation to finish',
        value: parseInt(parsed.fields.blocked_clients, 10)
      });

      emitter.metric({
        name: 'redis.rejected-connections',
        description: 'Clients rejected due to limit of clients',
        value: parseInt(parsed.fields.rejected_connections, 10)
      });

      emitter.metric({
        name: 'redis.ops-per-sec',
        description: 'Operations per second',
        value: parseInt(parsed.fields.instantaneous_ops_per_sec, 10)
      });

      emitter.metric({
        name: 'redis.slaves',
        description: 'Slaves connected',
        value: parseInt(parsed.fields.connected_slaves, 10)
      });
    });
  }
};
