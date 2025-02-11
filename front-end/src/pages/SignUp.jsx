import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-gray-50">
      <div className="max-w-md w-full">
        <ClerkSignUp 
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          fallbackRedirectUrl="/welcome"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl rounded-lg",
              headerTitle: "text-2xl font-bold text-center",
              headerSubtitle: "text-center",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUp;