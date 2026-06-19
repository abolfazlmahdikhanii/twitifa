"use client"
import { useAuth } from "@/context/AuthContext";
import AuthOtp from "./AuthOtp";
import ForgetPassword from "./ForgotPassword";

const ForgotPasswordWrapper = () => {
  const { isShowOtp } = useAuth();
  return <div>{!isShowOtp ? <ForgetPassword /> : <AuthOtp isReset={true} />}</div>;
};

export default ForgotPasswordWrapper;
