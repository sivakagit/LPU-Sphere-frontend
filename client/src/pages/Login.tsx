import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react";
import lpuLogo from "@/assets/lpu-logo.png";
import { toast } from "sonner";
import api from "@/api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regNo || !password) {
      toast.error("Please enter registration number and password");
      return;
    }

    try {
      setLoading(true);
      console.log("🔹 Attempting login with:", { regNo, password });

      const { data } = await api.post("/api/auth/login", { regNo, password });
      console.log("✅ Login response:", data);

      // 🧩 Safety check — make sure data and user exist
      if (!data || !data.user) {
        toast.error(data?.message || "Invalid response from server");
        console.error("⚠️ Unexpected response structure:", data);
        return;
      }

      // Save JWT token & user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Safe welcome message
      const userName = data.user.name || "User";
      toast.success(`Welcome, ${userName}!`);

      navigate("/app");
    } catch (err: any) {
      console.error("❌ Login error:", err);
      console.error("❌ Error response:", err.response?.data);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid credentials";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="w-full max-w-md flex flex-col items-center gap-8 animate-fade-in">
        <img
          src={lpuLogo}
          alt="Lovely Professional University"
          className="w-48 h-auto mb-4"
        />

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              type="text"
              placeholder="Reg No"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="px-12 h-14 rounded-full text-center bg-input shadow-md"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-12 h-14 rounded-full text-center bg-input shadow-md"
            />
          </div>

          <Button
            type="submit"
            variant="auth"
            className="w-40 h-12 rounded-full mx-auto block mt-6"
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOG IN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
