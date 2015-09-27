using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using System.Collections.Generic;

namespace tBpShared
{
	public abstract class MobileJsonConverter : JsonConverter
	{
		protected abstract object Create (Type objectType, JObject jsonObject);
		public abstract override bool CanConvert (Type objectType); 

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

	public class ListJsonConverter<T> : MobileJsonConverter
	{
		protected override object Create (Type objectType, JObject jsonObject)
		{
			var baseType = typeof(T).GetGenericArguments () [0];
			if (baseType == typeof(Event)) {
				return new List<TBPEvent> (); 
			} else if (baseType == typeof(User)) {
				return new List<TBPUser> (); 
			} else {
				return default(T);
			}
		}

		public override bool CanConvert (Type objectType)
		{
			var baseType = typeof(T).GetGenericArguments () [0]; 
			return baseType.IsAssignableFrom (objectType); 
		}

	}

	public class SingleJsonConverter<T> : MobileJsonConverter
	{
		protected override object Create (Type objectType, JObject jsonObject)
		{
			if (typeof(T) == typeof(Event)) {
				return new List<TBPEvent> (); 
			} else if (typeof(T) == typeof(User)) {
				return new List<TBPUser> (); 
			} else {
				return default(T);
			}
		}

		public override bool CanConvert (Type objectType)
		{
			return typeof(T).IsAssignableFrom (objectType);
		}
	}

}


