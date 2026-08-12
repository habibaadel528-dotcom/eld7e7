import facebookIcon from '../../assets/icons/auth/facebook.svg';
import googleIcon from '../../assets/icons/auth/google.svg';
import appleIcon from '../../assets/icons/auth/apple.svg';

const socialProviders = [
  {
    name: 'Facebook',
    icon: facebookIcon,
  },
  {
    name: 'Google',
    icon: googleIcon,
  },
  {
    name: 'Apple',
    icon: appleIcon,
  },
];

export default function SocialLogin() {
  const handleSocialLogin = (providerName) => {
    console.log(`${providerName} login`);

    /*
      بعد ربط الـbackend:
      هنا هنبدأ OAuth الخاص بـGoogle / Facebook / Apple.
    */
  };

  return (
    <div>
      <p className="mb-4 text-center text-xs text-[#535353]/60">
        Or continue with
      </p>

      <div className="flex items-center justify-center gap-8">
        {socialProviders.map((provider) => (
          <button
            key={provider.name}
            type="button"
            onClick={() => handleSocialLogin(provider.name)}
            aria-label={`Continue with ${provider.name}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl transition hover:-translate-y-0.5 hover:bg-white/30"
          >
            <img
              src={provider.icon}
              alt=""
              width="40"
              height="40"
              className="h-10 w-10 object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}