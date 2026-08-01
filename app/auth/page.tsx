"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";


export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });
    setLoading(false);
    toast.success("Signed in successfully!");
    if (!error) router.push("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: fullName,
      callbackURL: "/dashboard",
    });
    setLoading(false);
    toast.success("Account created successfully!");
    if (!error) setPending(true);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual Accent Sidebar */}
      <div className="relative hidden flex-col justify-between bg-gradient-warm p-12 lg:flex text-white">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="size-7 text-amber-500" />
          <span className="text-xl font-semibold tracking-tight">RestaurantOS</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-4xl font-semibold leading-tight">
            One console for the floor, the kitchen and the books.
          </h2>
          <p className="mt-4 text-white">
            Orders, tables, recipes, stock, purchasing and expenses — with AI shortage forecasts and
            invoice extraction built in.
          </p>
        </div>
        <p className="text-sm text-white">
          Role-based access for owners, managers, chefs, waiters, cashiers and store managers.
        </p>
      </div>

      {/* Auth Interaction Section */}
      <div className="flex items-center justify-center px-4 py-12 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your workspace. The first account created becomes the Owner.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={true}
              type="button"
            >
              Continue with Google
            </Button>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            {pending && (
              <p className="rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 p-4 text-sm mb-4">
                We sent a confirmation link to <strong>{email}</strong>. Confirm it, then sign in.
              </p>
            )}

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form className="space-y-4 pt-4" onSubmit={handleSignIn}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Sign in
                  </Button>

                  {/* // owner login button */}
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setEmail("testuser1@gmail.com")
                      setPassword("Testuser@123")
                    }}
                  >
                    Owner login
                  </Button>
                  {/* // waiter login button */}
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setEmail("waiter1@gmail.com")
                      setPassword("Waiter@123")
                    }}
                  >
                    Waiter login
                  </Button>
                  {/* // manager login button */}
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setEmail("manager1@gmail.com")
                      setPassword("Manager@123")
                    }}
                  >
                    Manager login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form className="space-y-4 pt-4" onSubmit={handleSignUp}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Work email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null} Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
