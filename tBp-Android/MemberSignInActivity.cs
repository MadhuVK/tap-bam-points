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
using ZXing;
using ZXing.Mobile;
using Newtonsoft.Json;

using tBpShared;

namespace tBpAndroid
{
	[Activity (Label = "Event Sign In", Theme="@android:style/Theme.Holo.Light")]			
	public class MemberSignInActivity : Activity
	{
		TBPEvent cEvent;
		TBPUser user;
		Spinner cat;
		String jsonEvent;
		String jsonUser;
		const int maxhours = 5;

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);
			jsonEvent = Intent.GetStringExtra ("event"); 
			jsonUser = Intent.GetStringExtra ("user");
			JsonSerializerSettings settings = new JsonSerializerSettings
			{
				TypeNameHandling = TypeNameHandling.All
			};
			cEvent = (TBPEvent) JsonConvert.DeserializeObject<Event> (jsonEvent, settings); 
			user = (TBPUser) JsonConvert.DeserializeObject<User> (jsonUser, settings);

			SetContentView (Resource.Layout.MemberSignIn);
			TextView name = FindViewById<TextView> (Resource.Id.memberSignInName);
			name.Text = user.FirstName + " " + user.LastName;
			TextView eventName = FindViewById<TextView> (Resource.Id.memberSignInEvent);
			eventName.Text = cEvent.Name;
			Spinner hours = FindViewById<Spinner> (Resource.Id.memberSignInPoints);
			ArrayAdapter hAdapt = new ArrayAdapter<int> (this, Android.Resource.Layout.SimpleListItem1, Enumerable.Range (1, maxhours).ToList ());
			hours.Adapter = hAdapt;

			if (cEvent.Points >= maxhours)
				hours.SetSelection (hAdapt.GetPosition (maxhours));
			else
				hours.SetSelection (hAdapt.GetPosition (cEvent.Points));
			
			Button done = FindViewById<Button> (Resource.Id.memberSignInDone);
			cat = FindViewById<Spinner> (Resource.Id.memberSignInCategory);
			ArrayAdapter adapter = new ArrayAdapter<TBPEvent.Category> (this, Android.Resource.Layout.SimpleListItem1, Enum.GetValues(typeof(TBPEvent.Category)).Cast<TBPEvent.Category>().ToList());
			cat.Adapter = adapter;
			for (int i = 0; i < cat.Count; i++) {
				if (cat.GetItemAtPosition(i).ToString().Equals(cEvent.Type.ToString()))
					cat.SetSelection (i);
			}

			if (!cEvent.Wildcard) {
				cat.Enabled = false;
			}


			done.Click += (sender, e) => signInMember ((int)hours.SelectedItem);
			
		}

		void signInMember(int hours)
		{
			var repo = EntityRepository.get (); 
			Intent mIntent = new Intent (this, typeof(IndividualEventActivity));
			mIntent.PutExtra ("user", jsonUser);

			TBPEvent.Category type = (TBPEvent.Category)Enum.Parse(typeof(TBPEvent.Category), cat.SelectedItem.ToString());
			repo.addEventToUser ((int)user.Id, (int)cEvent.Id, hours, type);
				
			SetResult (Android.App.Result.Ok, mIntent);
			Finish ();
		}

	}


}

