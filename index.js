'use strict';

var bole = require('bole');
var redis = require('redis');
var redisInfo = require('redis-info');
var NumbatEmitter = require('numbat-emitter');

var DEFAULT_INTERVAL = 1000;

var RedisProducer = module.exports = function(options) {
  var emitter = new NumbatEmitter(options);
  setInterval(produce, options.interval || DEFAULT_INTERVAL);

  var logger = options.logger || bole('numbat-redis');

  var client = redis.createClient(
    options.redis.port,
    options.redis.host,
    options.redis
  );

  function produce() {
    client.info(function (err, info) {
      if (err) {
        logger.error('error while trying to retrieve Redis stats', err);
        return;
      }

      const parsed = redisInfo.parse(info);

      emitter.metric({
        name: 'clients',
        value: parseInt(parsed.connected_clients, 10)
      });

      emitter.metric({
        name: 'used_memory',
        value: parseInt(parsed.used_memory, 10)
      });

      emitter.metric({
        name: 'used_cpu_sys',
        value: parseInt(parsed.used_cpu_sys, 10)
      });

      emitter.metric({
        name: 'used_cpu_user',
        value: parseInt(parsed.used_cpu_user, 10)
      });

      emitter.metric({
        name: 'ops-per-sec',
        value: parseInt(parsed.instantaneous_ops_per_sec, 10)
      });

      emitter.metric({
        name: 'slaves',
        value: parseInt(parsed.connected_slaves, 10)
      });
    });
  }
};
