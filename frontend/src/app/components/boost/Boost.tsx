import { cn } from '@/lib/utils';
import homeBgLarge from '../../../assets/home-bg-large.webp';
import EmeraldsLogo from '@/assets/Esports_Tokens_icon.webp';

export default function Boost() {
  const timewrapBoost = [
    {
      id: 1,
      name: '12h timewrap',
      timeAcceleration: 43200,
      price: 75,
    },
    {
      id: 2,
      name: '24h timewrap',
      timeAcceleration: 86400,
      price: 145,
    },
    {
      id: 3,
      name: '3d timewrap',
      timeAcceleration: 259200,
      price: 475,
    },
    {
      id: 4,
      name: '7d timewrap',
      timeAcceleration: 604800,
      price: 1350,
    },
    {
      id: 5,
      name: '14d timewrap',
      timeAcceleration: 1209600,
      price: 2500,
    },
  ];

  return (
    <section className="flex flex-col items-center h-full justify-center">
      <img
        src={homeBgLarge}
        alt="background"
        className={cn(
          'absolute left-0 top-0 h-screen object-cover visible min-w-[500vw] -z-[1]',
        )}
      />
      <div
        className={cn(
          'rounded-t-2xl flex flex-col overflow-hidden border-2 border-[#245184] bg-gradient-to-t from-[#111429] to-[#1F3358] text-white m-10',
        )}
      >
        <h2 className="text-4xl text-center relative text-white p-5">
          Boosts !
        </h2>
        <div
          className={cn(
            'bg-gradient-to-t border-2 border-white from-[#111429] from-0% to-[#1f3358] to-100% self-center flex flex-col touch-pan-y w-10/12 mb-2 rounded-xl p-1',
          )}
        >
          <p className="text-white p-3  rounded-xl text-center self-center">
            Timewrap
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-3 overflow-auto touch-pan-y rounded-xl p-3 ">
          {timewrapBoost.map((item) => (
            <li
              key={item.id}
              className={cn(
                'gap-2 border p-2 cursor-pointer relative transition-all active:scale-[0.98] w-full h-full flex flex-col justify-between items-center',
              )}
              onClick={() => {
                console.log('click');
              }}
            >
              <p className="text-white self-center text-lg text-center">
                {item.name}
              </p>
              <div className="flex">
                <p className="price text-white gap-1 align-bottom p-1 self-center text-xl">{`${item.price}`}</p>
                <img
                  width="30"
                  height="30"
                  src={EmeraldsLogo}
                  alt="credit"
                  className="object-contain"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
