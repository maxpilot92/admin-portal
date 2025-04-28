"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const param = useParams();
  const { token } = param;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);

  // Password requirements
  const passwordRequirements: PasswordRequirement[] = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { text: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { text: "At least one number", met: /[0-9]/.test(password) },
    {
      text: "At least one special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  if (!token) {
    throw new Error("Token is required");
  }

  // Calculate password strength
  useEffect(() => {
    const metRequirements = passwordRequirements.filter(
      (req) => req.met
    ).length;
    setPasswordStrength((metRequirements / passwordRequirements.length) * 100);
  }, [password]);

  // Validate token on page load
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Call your API to validate the token
        const response = await axios.post("/api/validate-token", { token });
        let isValid = false;
        console.log(response);
        // Check if the token is valid
        if (response.status === 200) isValid = true;
        const email = response.data.user?.email || "";
        const name = response.data.user?.username || "";
        if (isValid) {
          setIsTokenValid(true);
          // In a real app, the API would return user info associated with the token
          setUserName(name);
          setUserEmail(email);
          setIsNewUser(token.includes("new-user"));
        } else {
          setIsTokenValid(false);
          setTokenError(
            "Invalid or expired token. Please request a new invitation or password reset."
          );
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsTokenValid(false);
        setTokenError(
          "An error occurred while validating your token. Please try again."
        );
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      return;
    }

    if (passwordStrength < 60) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.patch("/api/set-password", {
        email: userEmail,
        password,
      });

      if (response.status === 200) {
        setIsSuccess(true);
      }

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (error) {
      console.error("Error setting password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while validating token
  if (isTokenValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Validating your link...
          </p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (isTokenValid === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Invalid Link
            </CardTitle>
            <CardDescription className="text-center">
              We couldn&apos;t verify your password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/sign-in">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success message
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-center mt-4">
              {isNewUser ? "Account Activated" : "Password Reset Complete"}
            </CardTitle>
            <CardDescription className="text-center">
              {isNewUser
                ? "Your account has been successfully activated."
                : "Your password has been successfully reset."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground mb-4">
              You will be redirected to the login page in a few seconds.
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/sign-in">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main password reset form
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center mt-4">
            {isNewUser ? "Set Your Password" : "Reset Your Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {isNewUser
              ? `Welcome, ${userName}! Create a password to activate your account.`
              : "Enter your new password below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email</Label>
              </div>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">New Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter your new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>

              {/* Password strength indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Password strength</span>
                  <span
                    className={
                      passwordStrength < 40
                        ? "text-destructive"
                        : passwordStrength < 80
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }
                  >
                    {passwordStrength < 40
                      ? "Weak"
                      : passwordStrength < 80
                      ? "Medium"
                      : "Strong"}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={`${
                    passwordStrength < 40
                      ? "bg-destructive/20"
                      : passwordStrength < 80
                      ? "bg-amber-500/20"
                      : "bg-emerald-500/20"
                  } ${
                    passwordStrength < 40
                      ? "indicator-bg-destructive"
                      : passwordStrength < 80
                      ? "indicator-bg-amber-500"
                      : "indicator-bg-emerald-500"
                  }`}
                />
              </div>

              {/* Password requirements */}
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground">
                  Password must include:
                </p>
                <ul className="text-xs space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          req.met ? "bg-emerald-500" : "bg-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          req.met ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirm-password">Confirm Password</Label>
              </div>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className={
                  confirmPassword && password !== confirmPassword
                    ? "border-destructive"
                    : ""
                }
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting ||
                password !== confirmPassword ||
                passwordStrength < 60
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isNewUser
                    ? "Activating Account..."
                    : "Resetting Password..."}
                </>
              ) : isNewUser ? (
                "Activate Account"
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-center text-muted-foreground">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
