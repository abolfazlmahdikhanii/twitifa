"use client"
import { useAuth } from "@/context/AuthContext";
import AuthOtp from "./AuthOtp";
import ForgetPassword from "./ForgotPassword";

const ForgotPasswordWrapper = () => {
  const { isShowOtp } = useAuth();
  return <>{!isShowOtp ? <ForgetPassword /> : <AuthOtp isReset={true} />}</>;
};

export default ForgotPasswordWrapper;
