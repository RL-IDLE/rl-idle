import splashScreen from '@/assets/splash-screen.webp';

export default function Loading() {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-50 bg-white">
      <img
        src={splashScreen}
        alt="splash-screen"
        className="absolute object-cover h-screen left-0 top-0"
      />
      <p className="absolute inset-x-0 bottom-6 text-2xl font-extrabold text-center text-white">
        Connexion en cours...
      </p>
    </div>
  );
}
