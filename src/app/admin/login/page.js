"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, LogIn, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

// --- Particle Background Component ---
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 40;

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 1.5 + 0.5;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = Math.random() * 0.2 - 0.1;
        let directionY = Math.random() * 0.2 - 0.1;
        let color = "rgba(101, 163, 13, 0.18)";
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    init();
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        background:
          "linear-gradient(135deg, #0f1419 0%, #1a2d27 50%, #0f1419 100%)",
      }}
    />
  );
};

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState(null); // 'error' | 'success' | null

  // Redirect to /admin if already logged in
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin")) {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    if (status === "success" && user) {
      // Save user/admin to localStorage
      localStorage.setItem("admin", JSON.stringify(user));
      // Redirect to /admin
      router.push("/admin");
    }
  }, [status, user, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const result = await dispatch(login(form));
    if (result.meta.requestStatus === "fulfilled") {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-gray-200 font-sans relative">
      <ParticleBackground />
      <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col items-center">
        <img src="/MK-GROUP.png" alt="MK Group Logo" className="h-16 w-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
        <p className="text-gray-400 mb-8 text-center">Sign in to access the admin dashboard</p>

        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Username or Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username or email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:border-transparent transition-all"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Error/success messages from Redux */}
          <AnimatePresence>
            {(status === 'error' || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {error || 'Invalid credentials. Please try again.'}
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Login successful! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#65a30d] hover:bg-[#4d7c0f] rounded-xl text-white font-semibold text-lg transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-[#65a30d] focus:ring-offset-2"
            disabled={loading}
          >
            <LogIn className="h-5 w-5" />
            <span>{loading ? 'Logging in...' : 'Login'}</span>
          </button>
          {/* Signup link */}
          <div className="mt-4 text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link href="/admin/signup" className="text-[#65a30d] hover:underline">Sign up</Link>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} MK Group. All rights reserved.
        </div>
      </div>
    </div>
  );
} 