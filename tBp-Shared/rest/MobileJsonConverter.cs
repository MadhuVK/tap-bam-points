using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using System.Collections.Generic;

namespace tBpShared
{
	public class MobileJsonConverter : JsonConverter
	{
		public Type T{ get; set; }

		public MobileJsonConverter(Type t) {
			T = t; 
		}

		protected object Create (Type objectType, JObject jsonObject) 
		{
			if (FieldExists (jsonObject, "datetime")) {
				return new TBPEvent (); 
			} else {
				return new TBPUser (); 
			}
		}

		public override bool CanConvert (Type objectType)
		{
			return T.IsAssignableFrom(objectType);
		}

		public override object ReadJson (JsonReader reader, Type objectType,
		                                  object existingValue, JsonSerializer serializer)
		{
			var jsonObject = JObject.Load (reader);
			var target = Create (objectType, jsonObject);
			serializer.Populate (jsonObject.CreateReader (), target);
			return target;
		}

		public override void WriteJson (JsonWriter writer, object value, JsonSerializer serializer)
		{
			throw new NotImplementedException ();
		}

		protected bool FieldExists(JObject jsonObject, string field) {
			return jsonObject [field] != null; 
		}


	}
}
