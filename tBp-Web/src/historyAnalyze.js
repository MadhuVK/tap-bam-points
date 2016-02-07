// Takes a user's member status and their history and returns data describing whether // or not the user meets or is deficient in any event types, depending on their
// status. Specifically, returns an array of objects like
//
// {type: String, total: Number, required: Number, fulfilled: Boolean}
//
// Initiates work toward initiation requirements, members toward active status.
// Officers have no goal because they're presumably active

const userTypes = require("./userTypes.js");
const eventTypes = require("./eventTypes.js");
const points = require("./points.js");

module.exports = function(history, memberStatus) {
  var requirements = userTypes[memberStatus].requirements;
  return analyze(history, requirements);
};

function analyze(history, requirements) {
  if (requirements === null)
    return [];

  var pointTotals = points.computeFromHistory(history);

  var result = [];
  if (requirements.eventType !== null) {
    for (var type in requirements.eventType) {
      var typeTotal = pointTotals.eventType[type];
      var required = requirements.eventType[type];
      result.push({
        type: eventTypes[type].name,
        total: typeTotal,
        required: required,
        fulfilled: typeTotal >= required
      });
    }
  }

  result.push({
    type: "Total",
    total: pointTotals.total,
    required: requirements.total,
    fulfilled: pointTotals.total >= requirements.total
  });

  return result;
}
