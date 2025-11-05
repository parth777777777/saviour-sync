import React from "react";
import { useNavigate } from "react-router-dom";
import OrgAuthForm from "../../components/org/OrgAuth";

const OrgLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/org/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        // Save token
        localStorage.setItem("orgToken", result.token);
        localStorage.setItem("orgId", result.orgId);
        localStorage.setItem("orgType", result.type);

        // Redirect to org dashboard or home page
        navigate("/org/dashboard");
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <OrgAuthForm mode="login" onSubmit={handleLogin} />
    </div>
  );
};

export default OrgLogin;
