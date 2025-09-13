// this section will be present in all the web pages so adding it to main.jsx
import React, { use, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";  
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

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
        window.location.reload();
      });
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <img src="/logo.svg" />
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
            <Button variant="outline" className="rounded-full">
              + Create Trip
            </Button>
            </a>
            <a href="/my-trips">
            <Button variant="outline" className="rounded-full">
              My Trips
            </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="h-[35px] w-[35px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>
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
            disabled={loading}
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

export default Header;
