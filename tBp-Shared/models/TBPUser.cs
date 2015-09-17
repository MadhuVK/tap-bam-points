using System;
using Newtonsoft.Json;

namespace tBpShared
{
	public class TBPUser : User
	{
		public enum Status { Active, Inactive, Initiate, Officer };
		public enum House { Red, Green, Blue };

		public Status MemberStatus { get; set; }
		public House HouseColor { get; set; }

		public TBPUser(int? uid, string fname, string lname, string barcode,
			Status status, House house) : base(uid, fname, lname, barcode)
		{
			MemberStatus = status; 
			HouseColor = house; 
		}

		public TBPUser(int? uid, string fname, string lname, byte[] barcodeHash,
			Status status, House house) : base(uid, fname, lname, barcodeHash)
		{
			MemberStatus = status; 
			HouseColor = house; 
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

