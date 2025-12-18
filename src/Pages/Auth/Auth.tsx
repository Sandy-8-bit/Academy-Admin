import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ButtonSm from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import { useSignInMutation } from "../../Queries/signInQuery";
import { appRoutes } from "../../routes/appRoutes";

export const SignInPage = () => {
  const navigate = useNavigate();
  const { mutate: signIn, isPending } = useSignInMutation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(()=>{
    const token2 =  Cookies.get("token")
   const token =  localStorage.getItem("token")
   if(token || token2 ){
    navigate(appRoutes.dashboard)

   }
  },[])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identifier || !password || isPending) return;

    signIn(
      { identifier, password },
      {
        onSuccess: (res) => {
          if (res?.token) {
            navigate(appRoutes.dashboard);
          }
        },
      }
    );
  };

  const isSubmitDisabled = !identifier || !password || isPending;

  return (
    <div className="flex h-screen w-full flex-col justify-center lg:flex-row">
      {/* LEFT SECTION */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 md:px-12 lg:w-1/2">
        <form
          className="flex w-full max-w-[380px] flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <p className="text-sm font-medium text-gray-500">
            Sign in to continue
          </p>

          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            Welcome 👋
          </h2>

          {/* Email / Identifier */}
          <Input
            title="Email"
            placeholder="Enter your email"
            inputValue={identifier}
            onChange={setIdentifier}
            type="str"
            name="identifier"
            required
          />

          {/* Password */}
          <div className="relative w-full">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center rounded-xl border-2 border-[#F1F1F1] bg-white px-3 py-1.5 focus-within:border-slate-500">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-slate-600 focus:outline-none"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 flex h-8 w-8 items-center justify-center"
              >
                <img
                  src={
                    showPassword
                      ? "/icons/eye-off-icon.svg"
                      : "/icons/eye-icon.svg"
                  }
                  alt="toggle password"
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>

          {/* Submit */}
          <ButtonSm
            state="default"
            text="Sign In"
            type="submit"
            isPending={isPending}
            disabled={isSubmitDisabled}
          />
        </form>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative hidden w-1/2 items-center justify-center lg:flex">
        <div className="absolute z-50 text-center text-[40px] leading-[45px] text-[#00b3fa] mix-blend-difference xl:text-[80px] xl:leading-20">
          Reliable <br /> Fast <br /> Smart.
        </div>

        <img
          src="/Images/sign-in-image.webp"
          alt="Login Banner"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
      </div>
    </div>
  );
};
