
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthPage({
    mode = "login",
    onSubmit,
}) {
    const isSignup = mode === "signup";
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const updateField = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (isSignup && form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (isSignup && form.password !== form.confirmPassword) {
            setError("Your passwords don't match.");
            return;
        }

        if (!onSubmit) {
            setError("Authentication is not connected yet.");
            return;
        }

        try {
            setLoading(true);

            const payload = isSignup
                ? {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }
                : {
                    email: form.email,
                    password: form.password,
                };

            const result = await onSubmit(payload);

            if (result?.success === false) {
                throw new Error(result.message || "Something went wrong.");
            }

            navigate(result?.redirectTo || "/");
        } catch (err) {
            setError(err.message || "Unable to continue. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full h-[46px] px-3.5 rounded-md bg-[#111718] border border-[#293334] text-[#E9E7DF] text-sm placeholder:text-[#626B69] outline-none transition-colors focus:border-[#C6A44E]";

    const labelClass =
        "block text-[12px] font-medium text-[#B9BFBA] mb-1.5";

    const [activePreview, setActivePreview] = useState(0);

    const previews = [
        {
            label: "SOURCE DOCUMENT",
            number: "01 / 04",
            title: "Introduction to Biology.pdf",
            description: "Your study material, ready to be transformed.",
            type: "document",
        },
        {
            label: "GENERATED QUIZ",
            number: "02 / 04",
            title: "Test your understanding.",
            description: "Which structure is responsible for controlling the activities of a cell?",
            type: "quiz",
        },
        {
            label: "MULTIPLE QUESTION TYPES",
            number: "03 / 04",
            title: "Learn in different ways.",
            description: "Switch between different question formats to strengthen your understanding.",
            type: "types",
        },
        {
            label: "YOUR LEARNING PROGRESS",
            number: "04 / 04",
            title: "See how far you've come.",
            description: "Review your answers, understand mistakes, and keep improving.",
            type: "progress",
        },
    ];

    const nextPreview = () =>
        setActivePreview((prev) => (prev + 1) % previews.length);

    const previousPreview = () =>
        setActivePreview((prev) => (prev - 1 + previews.length) % previews.length);

    return (
        <main className="min-h-[100svh] bg-[#0C0F10] text-[#E9E7DF] flex flex-col">

            {/* Main content */}
            <section className="flex-1 grid lg:grid-cols-[1.05fr_0.95fr] min-h-0">

                {/* Form side */}

                <div className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-12 lg:px-16">

                    {/* Header */}
                    <Link
                        to="/"
                        className="absolute left-6 top-7 flex items-center gap-2.5 sm:left-10 sm:top-9"
                    >
                        <img
                            src="/icon.png"
                            alt="NoteLM"
                            className="h-7 w-7 object-contain"
                        />
                        <span className="text-[17px] font-semibold tracking-tight text-[#E9E7DF]">
                            NoteLM
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="absolute right-6 top-9 text-xs text-[#858D8B] transition-colors hover:text-[#E9E7DF] sm:right-10"
                    >
                        Back to website <span className="ml-1">↗</span>
                    </Link>

                    {/* Main content */}
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-[390px]"
                    >

                        {/* Account switch */}
                        <div className="flex justify-end mb-7">
                            <p className="text-[12px] text-[#858D8B]">
                                {isSignup
                                    ? "Already have an account?"
                                    : "Don't have an account?"}

                                {" "}

                                <Link
                                    to={isSignup ? "/login" : "/register"}
                                    className="font-medium text-[#D4B568] transition-colors hover:text-[#E9D49A]"
                                >
                                    {isSignup ? "Sign in" : "Sign up"}
                                </Link>
                            </p>
                        </div>

                        {/* Heading */}
                        <div className="mb-8">
                            <h1 className="text-[36px] font-semibold leading-[1.13] tracking-[-0.045em] text-[#E9E7DF] sm:text-[40px]">
                                {isSignup ? (
                                    <>Learn more.<br />Remember better.</>
                                ) : (
                                    <>Good to have<br />you back.</>
                                )}
                            </h1>

                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-[18px]">

                            {isSignup && (
                                <div>
                                    <label htmlFor="name" className={labelClass}>
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        className={inputClass}
                                        name="name"
                                        value={form.name}
                                        onChange={updateField}
                                        placeholder="Your name"
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className={labelClass}>
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    className={inputClass}
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={updateField}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className={labelClass}>
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        className={`${inputClass} pr-16`}
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={updateField}
                                        placeholder="Enter your password"
                                        autoComplete={isSignup ? "new-password" : "current-password"}
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#858D8B] transition-colors hover:text-[#D4B568]"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {isSignup && (
                                <div>
                                    <label htmlFor="confirmPassword" className={labelClass}>
                                        Confirm password
                                    </label>

                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            className={`${inputClass} pr-16`}
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={updateField}
                                            placeholder="Re-enter your password"
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#858D8B] transition-colors hover:text-[#D4B568]"
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <p role="alert" className="text-xs leading-relaxed text-red-400">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group mt-1 flex h-[49px] w-full items-center justify-center gap-2 rounded-md bg-[#C6A44E] text-[13px] font-semibold text-[#0C0F10] transition-all duration-200 hover:bg-[#D4B568] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Please wait..."
                                    : isSignup
                                        ? "Create account"
                                        : "Sign in"}

                                {!loading && (
                                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                                        →
                                    </span>
                                )}
                            </button>
                        </form>


                    </motion.div>
                </div>


                {/* Product preview side */}
                <div className="hidden lg:flex bg-[#111718] border-l border-[#1E2628] px-10 xl:px-16 py-10 items-center justify-center relative overflow-hidden">
                    <div className="w-full max-w-[510px]">

                        {/* Document preview */}

                        <div className="relative">

                            {/* Carousel */}
                            <div className="overflow-hidden">
                                <motion.div
                                    className="flex"
                                    animate={{ x: `-${activePreview * 100}%` }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 20,
                                    }}
                                >
                                    {previews.map((preview, index) => (
                                        <div
                                            key={preview.type}
                                            className="w-full shrink-0 pr-1"
                                        >
                                            <div className="border border-[#293334] rounded-lg bg-[#0C0F10] min-h-[340px] p-5 xl:p-7">

                                                <div className="flex items-center justify-between pb-5 border-b border-[#1E2628]">
                                                    <span className="text-[10px] tracking-[0.17em] text-[#C6A44E]">
                                                        {preview.label}
                                                    </span>
                                                    <span className="text-[10px] text-[#626B69]">
                                                        {preview.number}
                                                    </span>
                                                </div>

                                                <div className="pt-6">
                                                    <h3 className="text-xl font-medium tracking-tight">
                                                        {preview.title}
                                                    </h3>

                                                    <p className="text-sm text-[#858D8B] mt-2 leading-relaxed max-w-[380px]">
                                                        {preview.description}
                                                    </p>
                                                </div>

                                                {/* Document */}
                                                {preview.type === "document" && (
                                                    <div className="mt-7 border border-[#293334] rounded-md p-5 bg-[#111718]">
                                                        <div className="flex items-center justify-between mb-5">
                                                            <span className="text-xs text-[#E9E7DF]">
                                                                Biology — Chapter 01
                                                            </span>
                                                            <span className="text-[10px] text-[#C6A44E] border border-[#C6A44E]/30 rounded px-2 py-1">
                                                                PDF
                                                            </span>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="h-2 w-[40%] rounded-full bg-[#394342]" />
                                                            <div className="h-1.5 w-full rounded-full bg-[#252E2F]" />
                                                            <div className="h-1.5 w-[92%] rounded-full bg-[#252E2F]" />
                                                            <div className="h-1.5 w-[76%] rounded-full bg-[#252E2F]" />
                                                            <div className="h-1.5 w-[86%] rounded-full bg-[#252E2F]" />
                                                        </div>

                                                        <div className="mt-6 flex items-center gap-2 text-[11px] text-[#858D8B]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A44E]" />
                                                            Document ready
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Quiz */}
                                                {preview.type === "quiz" && (
                                                    <div className="mt-6 space-y-2.5">
                                                        {[
                                                            "Cell membrane",
                                                            "Nucleus",
                                                            "Cytoplasm",
                                                            "Mitochondria",
                                                        ].map((answer, i) => (
                                                            <div
                                                                key={answer}
                                                                className={`flex items-center gap-3 px-4 py-3 rounded-md border text-xs ${i === 1
                                                                    ? "border-[#C6A44E]/60 bg-[#C6A44E]/[0.07] text-[#E9E7DF]"
                                                                    : "border-[#293334] text-[#858D8B]"
                                                                    }`}
                                                            >
                                                                <span className="text-[10px] text-[#C6A44E]">
                                                                    {String.fromCharCode(65 + i)}
                                                                </span>
                                                                {answer}
                                                                {i === 1 && (
                                                                    <span className="ml-auto text-[10px] text-[#C6A44E]">
                                                                        Selected
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Question types */}
                                                {preview.type === "types" && (
                                                    <div className="grid grid-cols-2 gap-3 mt-7">
                                                        {[
                                                            ["01", "Multiple choice"],
                                                            ["02", "True or false"],
                                                            ["03", "Short answer"],
                                                            ["04", "Mixed questions"],
                                                        ].map(([number, title]) => (
                                                            <div
                                                                key={number}
                                                                className="border border-[#293334] rounded-md bg-[#111718] p-4"
                                                            >
                                                                <span className="text-[10px] text-[#C6A44E]">
                                                                    {number}
                                                                </span>
                                                                <p className="text-xs mt-4 text-[#E9E7DF]">
                                                                    {title}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Progress */}
                                                {preview.type === "progress" && (
                                                    <div className="mt-7 border border-[#293334] rounded-md bg-[#111718] p-5">
                                                        <div className="flex justify-between items-end mb-5">
                                                            <div>
                                                                <p className="text-[11px] text-[#858D8B]">
                                                                    QUIZ PERFORMANCE
                                                                </p>
                                                                <p className="text-3xl font-semibold mt-2">
                                                                    80<span className="text-lg text-[#858D8B]">%</span>
                                                                </p>
                                                            </div>
                                                            <span className="text-[11px] text-[#C6A44E]">
                                                                8 of 10 correct
                                                            </span>
                                                        </div>

                                                        <div className="h-2 rounded-full bg-[#252E2F] overflow-hidden">
                                                            <div className="h-full w-[80%] rounded-full bg-[#C6A44E]" />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                                            <div>
                                                                <p className="text-[10px] text-[#858D8B]">Correct</p>
                                                                <p className="text-lg mt-1">08</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-[#858D8B]">Incorrect</p>
                                                                <p className="text-lg mt-1">02</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Carousel controls */}
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-2">
                                    {previews.map((preview, index) => (
                                        <button
                                            key={preview.type}
                                            type="button"
                                            onClick={() => setActivePreview(index)}
                                            aria-label={`Go to preview ${index + 1}`}
                                            className={`h-[3px] rounded-full transition-all duration-300 ${activePreview === index
                                                ? "w-8 bg-[#C6A44E]"
                                                : "w-3 bg-[#394342] hover:bg-[#858D8B]"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={previousPreview}
                                        aria-label="Previous preview"
                                        className="w-9 h-9 border border-[#293334] rounded-md text-[#858D8B] hover:text-[#E9E7DF] hover:border-[#858D8B] transition-colors"
                                    >
                                        ←
                                    </button>

                                    <button
                                        type="button"
                                        onClick={nextPreview}
                                        aria-label="Next preview"
                                        className="w-9 h-9 border border-[#293334] rounded-md text-[#858D8B] hover:text-[#E9E7DF] hover:border-[#858D8B] transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-8 text-[11px] text-[#626B69]">
                                <span>Read less. Understand more.</span>
                                <span>NoteLM © 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
