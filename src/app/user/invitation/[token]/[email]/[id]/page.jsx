"use client"; // For Next.js App Directory

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { message } from "antd";


const Invitation = () => {
  const params = useParams();
  const router = useRouter();
const [access , setAccess] = useState(false)
  const token = params?.token;
  const email = params?.email;
  const id = params?.id;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    
    if (!token || !email || !id) {
      console.error("Missing required query parameters");
      return;
    }
    
    // Check if the user is logged in
    const accessToken = localStorage.getItem("access_token");
 setAccess(accessToken)
    if (accessToken) {
      setIsAuthenticated(true);
      processInvitation(accessToken); // Process the invitation if logged in
    } else {
      // Redirect to login with token, email, and id in query params
      router.push(`/?token=${token}&email=${email}&id=${id}`);
    }
  }, [token, email, id, router]);

  const processInvitation = async (access_token) => {
    try {
      console.log(access_token)
      // const accessToken =localStorage.getItem("access_token");
      // console.log(accessToken)
        // const accessToken = localStorage.getItem("access_token");
     
      const response = await fetch(
        "https://13j4t1np-6000.inc1.devtunnels.ms/workspace/accept-invitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TrelloAPIkey$$%",
            // authorization: `Bearer ${access_token}`,
            'accesstoken': `Bearer ${access_token}`,
          },
          body: JSON.stringify({ token: token, email:email, workspace_id:id }),
        }
      );

      const data = await response.json();
      if (data.success) {
        router.push("/home"); // Redirect to dashboard or relevant page
      } else {
        console.error("Invitation failed:", data.message);
      }
    } catch (error) {
      console.error("Error processing invitation:", error);
    }
  };
  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-semibold text-white">Processing Invitation...</h1>
    </div>
  );
};

export default Invitation;
