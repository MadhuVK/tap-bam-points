
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
	[Activity (Label = "CreateMemberActivity")]			
	public class CreateMemberActivity : Activity
	{
		TextView barcodeDisplay;
		EditText firstName;
		EditText lastName;
		Spinner memberType;
		Spinner memberHouse;
	

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);
			string barcode = Intent.GetStringExtra ("barcode");
			SetContentView (Resource.Layout.CreateMember);

			//find view elements
			barcodeDisplay = FindViewById<TextView> (Resource.Id.createMemberBarcode);
			firstName = FindViewById<EditText> (Resource.Id.createMemberFirstName);
			lastName = FindViewById<EditText> (Resource.Id.createMemberLastName);
			barcodeDisplay.Text = barcode;

			//Initialize category spinner
			ArrayAdapter statusAdapter = new ArrayAdapter<TBPUser.Status> (this, Android.Resource.Layout.SimpleListItem1, Enum.GetValues(typeof(TBPUser.Status)).Cast<TBPUser.Status>().ToList());
			memberType = FindViewById<Spinner> (Resource.Id.createMemberType);
			memberType.Adapter = statusAdapter;


			ArrayAdapter houseAdapter = new ArrayAdapter<TBPUser.HouseColor> (this, Android.Resource.Layout.SimpleListItem1, Enum.GetValues(typeof(TBPUser.HouseColor)).Cast<TBPUser.HouseColor>().ToList());
			memberHouse = FindViewById<Spinner> (Resource.Id.createMemberHouse);
			memberHouse.Adapter = houseAdapter;



			var buttonDone = FindViewById<Button> (Resource.Id.createMemberButtonDone);
			buttonDone.Click += (sender, e) => createMember();
			
		}

		void createMember() {
			Intent cIntent = new Intent (this, typeof(ScanEventActivity));

			TBPUser.Status status = (TBPUser.Status)Enum.Parse(typeof(TBPUser.Status), memberType.SelectedItem.ToString());
			TBPUser.HouseColor house = (TBPUser.HouseColor)Enum.Parse (typeof(TBPUser.HouseColor), memberHouse.SelectedItem.ToString ());
			TBPUser newUser = new TBPUser (null, firstName.Text, lastName.Text, barcodeDisplay.Text, status, house);

			JsonSerializerSettings settings = new JsonSerializerSettings
			{
				TypeNameHandling = TypeNameHandling.All
			};

			string user_string = JsonConvert.SerializeObject (newUser, settings);
			cIntent.PutExtra ("user", user_string);
			SetResult (Result.Ok, cIntent);

			//TO DO: ADD USER TO REST

			Finish ();
		}

			
	}
}

