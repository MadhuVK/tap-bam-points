using System;

using RestSharp.Deserializers; 

namespace tBpShared
{
	public abstract class Event
	{
		public int? Id { get; set; } 
		public string Name { get; set; }
		public DateTime DateTime { get; set; }

		protected Event() {}
		protected Event(int? id, string name, DateTime? date)
		{
			Id = id; 
			Name = name; 
			DateTime = date ?? DateTime.Today;
		}

		public abstract int? save (); 
		public abstract override string ToString(); 

	}
}

