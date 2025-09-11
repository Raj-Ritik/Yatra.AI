import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "../constants/option";
import { toast } from "sonner";
import { chatSession } from "../service/AIModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!formData?.location || !formData?.budget || !formData?.traveler) {
      toast("Please fill all the fields");
      return;
    }
    if (formData?.noOfDays > 5) {
      toast("Number of days entered should be less than a week");
      return;
    }

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    console.log(FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        onGenerateTrip();
      });
  };

  return (
    <div className="w-[900px] mx-auto px-5 mt-10 min-h-screen">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🛫🚆⛰️🏝️
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-15 flex flex-col gap-10">
        {/* Destination */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        {/* Days */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.budget === item.title && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            What do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.traveler === item.people && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="my-10 justify-end flex">
        <Button onClick={onGenerateTrip}>Generate Trip</Button>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <img
              src="/logo.svg"
              alt="App logo"
              className="h-10 w-auto mx-auto"
            />
            <DialogTitle className="font-bold text-lg mt-4">
              Sign In With Google
            </DialogTitle>
            <DialogDescription>
              Sign in to the App with Google Authentication securely.
            </DialogDescription>
          </DialogHeader>

          <Button
            onClick={login}
            className="w-full mt-5 flex gap-4 items-center"
          >
            <FcGoogle className="h-7 w-7" /> Sign In With Google
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
