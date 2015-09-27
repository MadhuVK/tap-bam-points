using System;
using Newtonsoft.Json;

namespace tBpShared
{
	public sealed class TBPEvent : Event
	{

		public enum Category { Academic, Social, Community, Wildcard };

		public Category EventType { get; set; }
		public int DefaultPoints { get; set; }
		public string Officer { get; set; }


		public TBPEvent() {}
		public TBPEvent(int? id, string name, DateTime? date, 
			Category type, int points, string officer) : base(id, name, date)
		{
			EventType = type; 
			DefaultPoints = points; 
			Officer = officer; 
		}

		public override int? save() 
		{
			// TODO: Database Call 
			return null;
		}

		public override string ToString ()
		{
 			return JsonConvert.SerializeObject (this); 
		}


	}
}

