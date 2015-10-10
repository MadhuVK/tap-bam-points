/* Abstract class used to get the database connection. 
 * Currently uses dummy implementations
 */

using System; 
using System.Linq;
using System.Collections.Generic; 

namespace tBpShared
{
	public abstract class EntityDatabase : IEntityDatabase
	{
		static readonly IEntityDatabase connection = new EntityDatabaseImpl(); 

		public static IEntityDatabase get ()
		{
			return connection;
		}

		public virtual List<User> getUsers() 
		{
			return new List<User> {
				new TBPUser(uid: 0, fname: "Harry", lname: "Potter", barcode: "123456789", 
					status: TBPUser.Status.Active, house: TBPUser.HouseColor.Blue), 
				new TBPUser(uid: 1, fname: "Atticus", lname: "Finch", barcode: "111111111", 
					status: TBPUser.Status.Initiate, house: TBPUser.HouseColor.Green), 
				new TBPUser(uid: 2, fname: "Nick", lname: "Davies", barcode: "222222222", 
					status: TBPUser.Status.Active, house: TBPUser.HouseColor.Red), 
				new TBPUser(uid: 3, fname: "Bobby", lname: "Pendragon", barcode: "333333333", 
					status: TBPUser.Status.Inactive, house: TBPUser.HouseColor.Red), 
			}; 
		}

		public virtual List<User> getUsers(Func<User, bool> condition) 
		{
			return getUsers ().Where (condition).ToList(); 
		}


		public virtual List<Event> getEvents()
		{
			return new List<Event> {
				new TBPEvent(id: 0, name: "Event1", date: new DateTime(1994, 03, 01), 
					type:TBPEvent.Category.Community, points: 20, officer:"ATonyGuy"),
				new TBPEvent(id: 1, name: "Event2", date: new DateTime(2000, 04, 01), 
					type:TBPEvent.Category.Wildcard, points: 20, officer:"Juby"),
				new TBPEvent(id: 2, name: "Event3", date: new DateTime(2015, 05, 01), 
					type:TBPEvent.Category.Academic, points: 20, officer:"BeardedOne"),
				new TBPEvent(id: 3, name: "Event4", date: new DateTime(2016, 06, 01), 
					type:TBPEvent.Category.Social, points: 20, officer:"aAron"),
				new TBPEvent(id: 4, name: "Event5", date: new DateTime(2016, 07, 01), 
					type:TBPEvent.Category.Community, points: 20, officer:"aAron"),
				new TBPEvent(id: 5, name: "Event6", date: new DateTime(2016, 08, 01), 
					type:TBPEvent.Category.Social, points: 20, officer:"aAron"),
				new TBPEvent(id: 6, name: "Event7", date: new DateTime(2016, 09, 30), 
					type:TBPEvent.Category.Community, points: 20, officer:"aAron"),
			}; 
		}

		public virtual List<Event> getEvents(Func<Event, bool> condition)
		{
			return getEvents ().Where (condition).ToList(); 
		}

		public virtual List<Event> getEventsForUser(int userId)
		{
			var result = from e in getEvents ()
				         where e.Id % 2 == userId % 2
				         select e; 
			return result.ToList (); 
		}

		public virtual List<User> getUsersForEvent(int eventId)
		{
			var result = from u in getUsers ()
					where u.Id % 2 == eventId % 2
				         select u; 
			return result.ToList (); 
		}

		public virtual User getUser(int userId)
		{
			var result = from u in getUsers ()
			             where u.Id == userId
			             select u; 
			return result == null ? result.ElementAt(0) : null; 
		}

		public virtual Event getEvent(int eventId)
		{
			var result = from e in getEvents ()
			             where e.Id == eventId
			             select e; 
			return result == null ? result.ElementAt(0) : null; 
		}

		public virtual int saveUser(User user)
		{
			return 0; 
		}

		public virtual int saveEvent(Event e)
		{
			return 0; 
		}

	}
}

