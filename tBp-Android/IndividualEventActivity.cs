
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Newtonsoft.Json; 

using tBpShared; 

namespace tBpAndroid
{
	[Activity (Label = "IndividualEventActivity")]			
	public class IndividualEventActivity : Activity
	{
		Event mEvent; 
		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			string jsonEvent = Intent.GetStringExtra ("event"); 
			JsonSerializerSettings settings = new JsonSerializerSettings
			{
				TypeNameHandling = TypeNameHandling.All
			};
			mEvent = JsonConvert.DeserializeObject<Event> (jsonEvent, settings); 

			SetContentView (Resource.Layout.IndividualEvent); 
			TextView v = FindViewById<TextView> (Resource.Id.individualEventText);
			v.Text = mEvent.ToString (); 
		}
	}
}

