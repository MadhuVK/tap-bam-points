using System.Text; 
using System.Security.Cryptography; 

namespace tBpShared
{
	public static class Crypto
	{
		public static byte[] Hash(string s) 
		{
			const string salt = ""; 
			var saltedText = new StringBuilder (s); 
			saltedText.Append (salt); 

			var algorithm = SHA256.Create (); 
			algorithm.ComputeHash (Encoding.UTF8.GetBytes (saltedText.ToString ())); 
			return algorithm.Hash; 
		}


	}
}

