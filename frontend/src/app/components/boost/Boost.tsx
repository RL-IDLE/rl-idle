import { cn } from '@/lib/utils';
import EmeraldsLogo from '@/assets/Esports_Tokens_icon.webp';
import TimeWarpIcon from '@/assets/Icon_ScoreTime.png';
import UpgradeIcon from '@/assets/Icon_ScoreSpeed.png';
import gradient from '@/assets/gradient.png';

export default function Boost() {
  const timewrapBoost = [
    {
      id: 1,
      name: '12h',
      timeAcceleration: 43200,
      price: 75,
    },
    {
      id: 2,
      name: '24h',
      timeAcceleration: 86400,
      price: 145,
    },
    {
      id: 3,
      name: '3d',
      timeAcceleration: 259200,
      price: 475,
    },
  ];

  const upgradeBoost = [
    {
      id: 1,
      name: 'AFK Time',
      afkTime: 1,
      price: 75,
    },
    {
      id: 2,
      name: 'Click x2',
      durationTime: 3600,
      price: 145,
    },
    {
      id: 3,
      name: 'Click x3',
      durationTime: 900,
      price: 475,
    },
    {
      id: 4,
      name: 'Click x3',
      durationTime: 2700,
      price: 1350,
    },
  ];

  return (
    <section className="flex flex-col h-full pt-32 pb-28">
      <div
        className={cn(
          'justify-between rounded-xl overflow-hidden self-center text-white w-[calc(100%-40px)] flex flex-col items-center ',
        )}
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: 'cover',
        }}
      >
        <h2 className="text-4xl text-center relative text-white p-5">
          Boosts !
        </h2>
        <div className="flex flex-col overflow-y-scroll">
          <div
            className={cn(
              'bg-gradient-to-t border-2 border-white from-[#111429] from-0% to-[#1f3358] to-100% self-center flex flex-col touch-pan-y w-10/12 mb-1 rounded-xl',
            )}
          >
            <p className="text-white p-1 rounded-l text-center self-center">
              Timewarp
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-3 max-h-full max-w-full h-fit w-full touch-pan-y rounded-xl p-3 ">
            {timewrapBoost.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'gap-3 border p-2 rounded-xl cursor-pointer relative transition-all active:scale-[0.98] w-full h-full flex flex-col items-center',
                )}
                onClick={() => {
                  console.log('click');
                }}
              >
                <div className="flex items-center justify-center">
                  <img
                    width="40"
                    height="40"
                    src={TimeWarpIcon}
                    alt="credit"
                    className="object-container"
                  />
                  <p className="text-white self-center text-xl text-center">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    width="20"
                    height="20"
                    src={EmeraldsLogo}
                    alt="credit"
                    className="object-contain"
                  />
                  <p className="price text-white gap-1 align-bottom p-1 self-center text-base">{`${item.price}`}</p>
                </div>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              'bg-gradient-to-t border-2 m-2 border-white from-[#111429] from-0% to-[#1f3358] to-100% self-center flex flex-col touch-pan-y w-10/12 mb-1 rounded-xl',
            )}
          >
            <p className="text-white p-1 rounded-xl text-center self-center">
              Upgrade
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 max-h-full max-w-full h-fit w-full touch-pan-y rounded-xl p-3 ">
            {upgradeBoost.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'gap-3 border p-2 rounded-xl cursor-pointer relative transition-all active:scale-[0.98] w-full h-full flex flex-col justify-between items-center',
                )}
                onClick={() => {
                  console.log('click');
                }}
              >
                <div className="flex flex-col justify-center items-center">
                  <img
                    width="40"
                    height="40"
                    src={UpgradeIcon}
                    alt="credit"
                    className="object-contain"
                  />
                  <p className="text-white self-center text-l text-center">
                    {item.name}
                  </p>
                  <p className="text-white self-center text-l text-center">
                    {item.durationTime
                      ? item.durationTime / 60 + 'min'
                      : '+' + item.afkTime?.toString() + 'h'}
                  </p>
                </div>

                <div className="flex items-center">
                  <img
                    width="20"
                    height="20"
                    src={EmeraldsLogo}
                    alt="credit"
                    className="object-contain"
                  />
                  <p className="price text-white gap-1 align-bottom p-1 self-center text-base">{`${item.price}`}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
