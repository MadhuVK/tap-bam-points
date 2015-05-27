using System;
using System.Text; 
using System.Security.Cryptography; 

namespace tBpShared
{
	public static class Crypto
	{
		public static byte[] Hash(string s) 
		{
			const string salt = "@3Xd4ffbOB]bc[}o{U1hp"; // Weak, need to change
			var saltedText = new StringBuilder (s); 
			saltedText.Append (salt); 

			var algorithm = SHA512.Create (); 
			algorithm.ComputeHash (Encoding.UTF8.GetBytes (saltedText.ToString ())); 
			return algorithm.Hash; 
		}

	}
}

