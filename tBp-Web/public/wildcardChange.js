// Attach AJAX requestors to wildcard events
// Requires USERID to be in global scope and rows
// in the event table to have id attributes like 'event_#'

var wildcards = document.getElementsByClassName('wildcard_event');

for (var i = 0; i < wildcards.length; i++) {
  var event = wildcards[i];
  attachCategoryChanger(event);
}

function attachCategoryChanger(event) {
  var eventId = event.id.split('_')[1];
  var selector = event.children[2].firstElementChild

  selector.onchange = () => {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status == 200) {
        document.location.reload(true);
      }
    }
    
    httpRequest.open('PATCH', '/api/users/' + USERID + '/events/' + eventId);

    var patchString = '[{"op": "replace", "path": "/type", "value": "' + selector.value + '"}]';
    httpRequest.setRequestHeader('Content-Type', 'application/json');

    httpRequest.send(patchString);
  }
}
