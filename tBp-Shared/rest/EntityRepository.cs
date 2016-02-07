using System;
using System.Text; 
using System.Text.RegularExpressions; 
using System.Linq; 
using System.Collections.Generic; 
using RestSharp; 
using Newtonsoft.Json; 



namespace tBpShared
{
	public abstract class EntityRepository : IEntityRepository
	{
		static readonly string URL_PATTERN = 
			@"^(?<proto>.*://)?(?<host>[A-Za-z0-9\-\.]+)(?<port>:[0-9]+)?(?<query>.*)$";

		static readonly IEntityRepository connection = new EntityRepositoryImpl(); 

	 	public Uri BaseURL { get; protected set; } 
		public string AccessToken { get; protected set; }
		public IRestClient Client { get; protected set; }

		public static IEntityRepository get() {
			return connection; 
		}

		public abstract void AssignClient (Uri url, string token); 

		public static string AuthenticateConnection(string baseUrl, string pass) 
		{

			var url_matches = new Regex (URL_PATTERN).Match(baseUrl); 

			var urlBuilder = new UriBuilder (); 
			urlBuilder.Scheme = "http";

			string hostName = url_matches.Groups ["host"].Value; 
			if (String.IsNullOrWhiteSpace (hostName)) {
				return "No Host Found"; 
			}
			urlBuilder.Host = hostName; 

			string port = url_matches.Groups ["port"].Value; 
			if (!String.IsNullOrEmpty (port)) {
				urlBuilder.Port = UInt16.Parse (port.Substring(1)); 
			}

			urlBuilder.Path = "api"; 

			var client = new RestClient (urlBuilder.Uri); 
			var request = new RestRequest ("authenticate", Method.POST); 
			var pass_hash = BitConverter.ToString (Crypto.Hash (pass)); 
			request.AddJsonBody (new {pass_hash}); 
			request.Timeout = 5000;

			var response = client.Execute (request); 
			var responseContent = JsonConvert.DeserializeObject
				<Dictionary<string, string>> (response.Content); 

			string status, token, error; 
			if (responseContent.TryGetValue ("success", out status)) {
				if (Boolean.Parse (status)) {
					responseContent.TryGetValue ("token", out token); 
					connection.AssignClient (urlBuilder.Uri, token); 
					return status; 
				} else {
					responseContent.TryGetValue ("error", out error); 
					return error; 
				}

			}

			return response.Content; 
		}

		
		

		/* Dummy implementations */ 

		public virtual List<User> getUsers() {
			return new List<User> {
				new TBPUser(uid: 0, fname: "Harry", lname: "Potter", barcode: "123456789", 
					status: TBPUser.Status.Member, house: TBPUser.HouseColor.Blue), 
				new TBPUser(uid: 1, fname: "Atticus", lname: "Finch", barcode: "111111111", 
					status: TBPUser.Status.Initiate, house: TBPUser.HouseColor.Green), 
				new TBPUser(uid: 2, fname: "Nick", lname: "Davies", barcode: "222222222", 
					status: TBPUser.Status.Member, house: TBPUser.HouseColor.Red), 
				new TBPUser(uid: 3, fname: "Bobby", lname: "Pendragon", barcode: "333333333", 
					status: TBPUser.Status.Member, house: TBPUser.HouseColor.Red), 
			}; 
		}

		public virtual List<Event> getEvents() {
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

		public virtual List<Event> getEventsForUser(int userId) {
			var result = from e in getEvents ()
				         where e.Id % 2 == userId % 2
				         select e; 
			return result.ToList (); 
		}


		public virtual List<User> getUsersForEvent(int eventId) {
			var result = from u in getUsers ()
					where u.Id % 2 == eventId % 2
				         select u; 
			return result.ToList (); 
		}

		public virtual User getUser(int userId) {
			var result = from u in getUsers ()
			             where u.Id == userId
			             select u; 
			return result == null ? result.ElementAt(0) : null; 
		}

		public virtual Event getEvent(int eventId) {
			var result = from e in getEvents ()
			             where e.Id == eventId
			             select e; 
			return result == null ? result.ElementAt(0) : null; 
		}


		public virtual bool addUser(User user) {
			return false; 
		}

		public virtual bool addEvent(Event e) {
			return false; 
		}

		public virtual bool deleteUser(int userId) {
			return false; 
		}

		public virtual bool deleteEvent(int eventId) {
			return false; 
		}

		public virtual bool addEventToUser(int userId, int eventId) {
			return false; 
		}

		public virtual bool deleteEventOnUser(int userId, int eventId) {
			return false; 
		}

		/* PATCH is not allowed in this revision */
		public bool updateEventOnUser(int userId, int eventId) 
		{
			throw new NotImplementedException ("Updating not allowed in app."); 
		}

		public bool updateUser(int userId) 
		{
			throw new NotImplementedException ("Updating not allowed in app."); 
		}
		public bool updateEvent(int eventId)
		{
			throw new NotImplementedException ("Updating not allowed in app."); 
		}

	}
}

