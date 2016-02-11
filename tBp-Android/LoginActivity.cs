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
			button.Click += (sender, e) => new LoginTask (this).Execute (); 

			ServicePointManager.ServerCertificateValidationCallback += delegate
			{
				return true;
			};
		}

		class LoginTask : AsyncTask<Object, Object, bool> 
		{
			ProgressDialog progress; 
			Activity activity; 

			public LoginTask(Activity a) 
			{
				progress = new ProgressDialog(a); 
				activity = a; 
			}

			protected override void OnPreExecute ()
			{
				progress.SetMessage ("Receiving Authorization Token"); 
				progress.Show (); 
			}

			protected override bool RunInBackground (params Object[] @params)
			{
			
				EditText server = activity.FindViewById<EditText> (Resource.Id.serverLoginText); 
				EditText pass = activity.FindViewById<EditText> (Resource.Id.serverPasswordText); 

				var validCredentials = false; 
				var authResults = EntityRepository.AuthenticateConnection (server.Text, pass.Text); 
				Boolean.TryParse (authResults, out validCredentials); 

				Android.Util.Log.Info ("LoginActivity", "Validation Result: " + authResults); 
				return validCredentials; 

			}

			protected override void OnPostExecute (bool result)
			{
				if (progress.IsShowing) {
					progress.Dismiss (); 
				}

				if (result) {
					Toast.MakeText (activity, "Sucessful Login", ToastLength.Short).Show (); 
					activity.StartActivity (typeof(EventListActivity)); 
					activity.Finish (); 
				} else {
					Toast.MakeText (activity, "Invalid Server/Pass", ToastLength.Short).Show (); 
				}

			}
		}

	}

}


