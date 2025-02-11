import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <ClerkSignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          afterSignInUrl="/welcome"
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

export default SignIn;