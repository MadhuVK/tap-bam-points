using System;

namespace tBpShared
{
	public abstract class User 
	{

		public int? Id { get; set; }
		public string LastName { get; set; } 
		public string FirstName { get; set; }
		public string BarcodeHash { get; set; }

		protected User() {}
		protected User(int? uid, string fname, string lname, string barcode)
		{
			Id = uid;
			FirstName = fname; 
			LastName = lname; 
			byte[] bHash =  Crypto.Hash (barcode);
			BarcodeHash = BitConverter.ToString (bHash).ToLower ().Replace ("-", "");
		}

		protected User(int? uid, string fname, string lname, byte[] barcodeHash)
		{
			Id = uid;
			FirstName = fname; 
			LastName = lname; 
			BarcodeHash = BitConverter.ToString (barcodeHash).ToLower ().Replace ("-", "");
		}

		public abstract int? save (); 
		public abstract override string ToString ();

	}
}