// Takes a user's member status and their history and returns data describing whether // or not the user meets or is deficient in any event types, depending on their
// status. Specifically, returns an array of objects like
//
// {type: String, total: Number, required: Number, fulfilled: Boolean}
//
// Initiates work toward initiation requirements, members toward active status.
// Officers have no goal because they're presumably active

const userTypes = require("./userTypes.js");
const eventTypes = require("./eventTypes.js");

module.exports = function(history, status) {
  var requirements = userTypes[status].requirements;
  return analyze(history, requirements);
};

function analyze(history, requirements) {
  if (requirements === null)
    return [];

  var pointTypeTotals = getPointTypeTotals(history);
  var totalPoints = getTotalPoints(pointTypeTotals);

  var result = [];
  if (requirements.eventType !== null) {
    for (var type in requirements.eventType) {
      var total = pointTypeTotals.get(type);
      var required = requirements.eventType[type];
      result.push({
        type: type,
        total: total,
        required: required,
        fulfilled: total >= required
      });
    }
  }

  result.push({
    type: "Total",
    total: totalPoints,
    required: requirements.total,
    fulfilled: totalPoints >= requirements.total
  });

  return result;
}

function getPointTypeTotals(history) {
  var map = initPointsMap();
  for (var event of history) {
    var oldValue = map.get(event.type);
    map.set(event.type, oldValue + event.pointsEarned);
  }
  return map;
}

function initPointsMap() {
  var map = new Map();
  for (type in eventTypes)
    map.set(type, 0);
  return map;
}

function getTotalPoints(pointTypeTotals) {
  var sum = 0;
  for (var points of pointTypeTotals.values())
    sum += points;
  return sum;
}