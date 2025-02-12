import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

const SignIn = () => {
  return (
    <div className="min-h-screen d-flex align-content-center justify-content-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <ClerkSignIn 
          routing="hash"
          fallbackRedirectUrl="/TBD/welcome"
          signUpUrl="/TBD/sign-up"
          appearance={{
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
              termsPageUrl: "https://clerk.com/terms"
            },
            elements: {
              formButtonPrimary: 
                "bg-blue-500 hover:bg-blue-600 text-white w-full",
              card: "shadow-xl rounded-lg p-6",
              headerTitle: "text-2xl font-bold text-center text-gray-900",
              headerSubtitle: "text-center text-gray-500",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-700",
              formFieldInput: "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignIn;