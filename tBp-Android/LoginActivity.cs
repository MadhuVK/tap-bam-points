using System;
using System.Net; 

using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

using tBpShared; 

namespace tBpAndroid
{
	[Activity (Label = "tBp", MainLauncher = true, Icon = "@drawable/icon")]
	public class LoginActivity : Activity
	{

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			SetContentView (Resource.Layout.Login);

			Button button = FindViewById<Button> (Resource.Id.serverLoginButton);
			button.Click += (sender, e) => validateLogin(); 
		}

		void validateLogin() {
			EditText server = FindViewById<EditText> (Resource.Id.serverLoginText); 
			EditText pass = FindViewById<EditText> (Resource.Id.serverPasswordText); 


			var validCredentials = false; 
			var authResults = EntityRepository.AuthenticateConnection (server.Text, pass.Text); 
			Boolean.TryParse (authResults, out validCredentials); 

			Android.Util.Log.Info ("LoginActivity", "Validation Result: " + authResults); 

			if (validCredentials) {
				StartActivity(typeof(EventListActivity)); 
			} else {
				Toast.MakeText (this, "Invalid Password", ToastLength.Long).Show (); 
			}
		}
	}
}


