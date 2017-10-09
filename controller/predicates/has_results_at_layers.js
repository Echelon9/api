const _ = require('lodash');
const Debug = require('../../helper/debug');
const debugLog = new Debug('controller:predicates:has_results_at_layers');
const stackTraceLine = require('../../helper/stackTraceLine');
// returns a function that returns true if any result.layer is in any of the
// supplied layers using array intersection

// example usage: determining if the response contains only admin results

module.exports = {
  any: (layers) => (request, response) => {
    const has_results_at_any_layer = !_.isEmpty(
      _.intersection(
        // convert layers to an array if it isn't already one
        _.castArray(layers),
        // pull all the layer properties into an array
        _.map(response.data, _.property('layer'))
    ));

    debugLog.push(request, () => ({
    reply: {[layers]: has_results_at_any_layer},
    stack_trace: stackTraceLine()
    }));
    return has_results_at_any_layer;

  },
  all: (layers) => (request, response) => {
    const has_results_at_all_layers = _.isEmpty(
      _.difference(
        _.map(response.data, _.property('layer')),
        _.castArray(layers)
      )
    );

    debugLog.push(request, () => ({
    reply: {[layers]: has_results_at_all_layers},
    stack_trace: stackTraceLine()
    }));
    return has_results_at_all_layers;

  }

};
