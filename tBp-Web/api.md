# tBp REST API

## Notes

- gzip everything and pretty print by default
  - http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#pretty-print-gzip
- use PATCH with JSON Patch for updates, in favor of PUT where applicable
  - https://www.mnot.net/blog/2012/09/05/patch
  - http://williamdurand.fr/2014/02/14/please-do-not-patch-like-an-idiot/
- GET requests support flexible, concise sorting and filtering
  - http://www.vinaysahni.combest-practices-for-a-pragmatic-restful-api#advanced-queries
- DELETE methods for collections seem dangerous; you'll see none below

### Database tables
- user, event, tbp_event, tbp_user

### JavaScript objects
- user, event, attendance record -- schema TBD

## Resources and methods
	GET /users - get list of all users
	POST /users - add a new user
	GET /users/{id} - get user by user_id
	PATCH /users/{id} - update user
	DELETE /users/{id} - delete user

	GET /users/{id}/events - get a user's event attendance history
	POST /users/{id}/events - add an attendance record to the history
	PATCH /users/{id}/events/{event_id} - update attendance record
	DELETE /users/{id}/events/{event_id} - remove a user's attendance record

	GET /events - get list of events
	POST /events - add a new event
	GET /events/{id} - get event by event_id
	PATCH /events/{id} - update event
	DELETE /events/{id} - delete event

	GET /events/{id}/users - get list of attendees
	POST /events/{id}/users - add a user to an event's attendees collection
	PATCH /events/{id}/users/{user_id} - alias of PATCH /users/{id}/events/{event_id}
	DELETE /events/{id}/users/{user_id} - alias of DELETE /users/{id}/events/{event_id}
