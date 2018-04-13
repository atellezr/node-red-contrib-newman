const newman = require('newman');
const mustache = require('mustache');

module.exports = function(RED) {

  function parse2json(obj) {
    obj = obj || {};
    try {
      if (typeof obj === "string") {
        obj = JSON.parse(obj);
      }
    }
    catch(e) {
      console.warn(`Error parsing object in newman.js! ${e.message}`, e);
      obj = {};
    }
    return obj;
  }

  // help from: https://github.com/node-red/node-red/blob/master/nodes/core/core/80-template.js
  function NodeContext(msg, nodeContext, parent, escapeStrings) {
    this.msgContext = new mustache.Context(msg, parent);
    this.nodeContext = nodeContext;
    this.escapeStrings = escapeStrings;
  }

  function NewmanNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on('input', function(msg) {
      node.status({ fill:"grey", shape:"dot", text:"preparing run"});

      let newmanID = RED.util.generateId();

      msg.newman = parse2json(msg.newman);
      //let options = parse2json(mustache.render(config.options, new NodeContext(msg, node.context(), null, true)));
      let options = parse2json(mustache.render(config.options, msg));
      let newmanOptions = Object.assign({}, options, msg.newman);

      let startTime = process.hrtime();

      try {
        let run = newman.run(newmanOptions)
        .on('start', function (err, args) {
          node.status({ fill:"blue", shape:"dot", text:"starting the collection run"});
          newmanOptions.execution_id = newmanID;
          node.metric("newman.starts", newmanOptions);
  			})
        .on('beforeItem', function (err, args) {
          let txt = `starting item ${args.item.name}`;
          node.status({ fill:"blue", shape:"dot", text:txt});
          node.log(`Newman run ${newmanID}: ${txt}`);
  			})
        .on('console', function (err, args) {
          const logger = node[args.level] ? node[args.level] : node.log;
          args.messages.forEach(function(message){
            logger(message);
          });
  			})
        .on('done', function (err, summary) {
          let duration = process.hrtime(startTime);
          duration = duration[0] * 1e3 + duration[1] * 1e-6;
          //duration = duration.toFixed(0);
          duration = Math.round(duration);

          msg.payload = {
            "execution_id": newmanID,
            "isCorrectNewmanExecution": !err && !summary.error,
            "duration": duration,
            "error": err,
            "summary": summary
          };

          let metricObj = {
            "execution_id": newmanID,
            "duration": duration
          };
          if (err || summary.error) {
            node.metric("newman.done.error", metricObj);
          }
          else {
            // TODO add statistics about the executions done in the metric
            node.metric("newman.done.ok", metricObj);
          }

          node.status({});
          node.send([msg, null]);
        });

        const EVENTS = ["beforeIteration", "beforeItem", "beforePrerequest", "prerequest", "beforeRequest", "request", "beforeTest", "test", "beforeScript", "script", "item", "iteration", "assertion", "console", "exception", "beforeDone"];
        EVENTS.forEach(function(event){
          run.on(event, function (err, args) {
            msg.payload = {
              "execution_id": newmanID,
              "event": event,
              "args": args,
              "error": err
            };
            node.send([null, msg]);
    			})
        });
      }
      catch(e) {
        msg.payload = e;
        node.error(`Error running the collection with newman: ${e.message}`, msg);
      }
    });
  }

  RED.nodes.registerType("newman", NewmanNode);
}
