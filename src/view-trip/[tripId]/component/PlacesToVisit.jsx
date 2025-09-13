import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>
      <div>
        {trip.tripData?.Itinerary?.map((item, index) => (
          <div className="mt-5">
            <h2 className="font-medium text-lg">{item.Day}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {item.Plan.map((place, index) => (
                <div className="">
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
