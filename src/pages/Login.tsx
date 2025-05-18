
import { LoginForm } from "@/components/auth/LoginForm";
import { MainLayout } from "@/components/layout/MainLayout";

const Login = () => {
  return (
    <MainLayout requireAuth={false}>
      <div className="h-full flex flex-col justify-center items-center pt-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-nestconnect-purple mb-2">NestConnect</h1>
          <p className="text-lg text-gray-600">Internal Employee Communication Platform</p>
        </div>
        <LoginForm />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For demo, use:</p>
          <p>Email: john.doe@nestconnect.com</p>
          <p>Password: any password will work</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
