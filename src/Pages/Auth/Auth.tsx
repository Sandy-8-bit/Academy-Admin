import ButtonSm from '../../components/Common/Button'
import Input from '../../components/Common/Input'
import { useLogin } from '../../Queries/AuthQueries'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const SignInPage = () => {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useLogin()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    login(
      { identifier, password },
      {
        onSuccess: (res:any) => {
          if (res.token) {
            navigate('/dashboard')
          } 
        },
      }
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!identifier || !password || isPending) return
    handleLogin()
  }

  const isSubmitDisabled = !identifier || !password || isPending

  return (
    <div className="flex h-screen w-full flex-col justify-center lg:flex-row">
      {/* LEFT SECTION */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 md:px-12 lg:w-1/2">
        <form
          className="flex w-full max-w-[380px] flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {/* Welcome text */}
          <p className="text-start text-sm font-medium text-gray-500 md:text-base">
            Sign in to continue
          </p>

          <h2 className="mt-1 text-start text-xl font-semibold text-gray-900 md:text-2xl">
            Welcome 👋
          </h2>

          {/* Username Input */}
          <Input
            title="Username"
            placeholder="Enter your username"
            inputValue={identifier}
            onChange={setIdentifier}
            type="str"
            name="email"
            required
          />

          {/* Password Input */}
          <div className="relative w-full min-w-[180px] self-stretch">
            <label
              htmlFor="password"
              className="mb-0.5 block text-xs leading-loose font-semibold text-slate-700"
            >
              Password <span className="text-red-500">*</span>
            </label>

            <div className="parent-input-wrapper flex items-center justify-between overflow-clip rounded-xl border-2 border-[#F1F1F1] bg-white px-3 py-1.5 transition-all focus-within:border-slate-500">
              <input
                id="password"
                name="password"
                required
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:text-blue-600 focus:outline-none"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <img
                  src={
                    showPassword
                      ? '/icons/eye-off-icon.svg'
                      : '/icons/eye-icon.svg'
                  }
                  alt={showPassword ? 'Hide password' : 'Show password'}
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <ButtonSm
            state="default"
            text="Sign In"
            type="submit"
            isPending={isPending}
            disabled={isSubmitDisabled}
            onClick={handleLogin}
          />
        </form>

      </div>

      {/* RIGHT IMAGE SECTION */}
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
  )
}
