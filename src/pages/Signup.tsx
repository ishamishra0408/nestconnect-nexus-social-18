
import { SignupForm } from "@/components/auth/SignupForm";
import { MainLayout } from "@/components/layout/MainLayout";

const Signup = () => {
  return (
    <MainLayout requireAuth={false}>
      <div className="h-full flex flex-col justify-center items-center pt-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-nestconnect-purple mb-2">NestConnect</h1>
          <p className="text-lg text-gray-600">Join Your Workplace Community</p>
        </div>
        <SignupForm />
      </div>
    </MainLayout>
  );
};

export default Signup;
