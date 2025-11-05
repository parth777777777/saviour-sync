import React from "react";
import { useNavigate } from "react-router-dom";
import OrgAuthForm from "../../components/org/OrgAuth";

const OrgSignup = () => {
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/org/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        // Optionally store orgId/type if needed
        localStorage.setItem("orgId", result.orgId);

        // Redirect to login page
        navigate("/org/login");
      } else {
        alert(result.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <OrgAuthForm mode="signup" onSubmit={handleSignup} />
    </div>
  );
};

export default OrgSignup;
