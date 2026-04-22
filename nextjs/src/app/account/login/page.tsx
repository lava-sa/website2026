import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In — My Account",
  description: "Sign in to your Lava account to view your Lava Points balance and order history.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
