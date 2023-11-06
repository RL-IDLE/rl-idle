import boostBackground from '@/assets/boost/BoostMeter_Background.png';
import boostFill from '@/assets/boost/BoostMeter_Fill.png';
import boostFillTintable from '@/assets/boost/BoostMeter_FillTintablePortion.png';
import boostGlow from '@/assets/boost/BoostMeter_Glow.png';
import { useClickStore } from '@/contexts/click.store';
import { fullBoostMultiplier, fullBoostNumberOfClicks } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function BoostMeter() {
  const getLast5SecondsClicks = useClickStore(
    (state) => state.getLast5SecondsClicks,
  );
  const setIsFullBoost = useClickStore((state) => state.setFullBoost);
  const isFullBoost = useClickStore((state) => state.isFullBoost);
  const [last5SecondsClick, setLast5SecondsClick] = useState(0);
  const [fullBoostSince, setFullBoostSince] = useState<Date | null>(null);
  const perSecond = last5SecondsClick / 5;
  const fullBoostClickVisual = 12.7;
  const fullBoostClick = fullBoostNumberOfClicks;
  let percentage = perSecond / fullBoostClickVisual;
  if (percentage > 1) percentage = 1;
  let realPercentage = perSecond / fullBoostClick;
  if (realPercentage > 1) realPercentage = 1;

  useEffect(() => {
    // console.log('useEffect', fullBoostSince);
    const it = setInterval(() => {
      const last5SecondsClick = getLast5SecondsClicks();
      setLast5SecondsClick(last5SecondsClick);
      if (
        last5SecondsClick / 5 >= fullBoostNumberOfClicks &&
        fullBoostSince === null
      ) {
        setFullBoostSince(new Date());
      } else if (
        last5SecondsClick / 5 < fullBoostNumberOfClicks &&
        fullBoostSince !== null
      ) {
        setFullBoostSince(null);
      }
    }, 50);
    return () => clearInterval(it);
  }, [getLast5SecondsClicks, fullBoostSince]);

  useEffect(() => {
    //? More than 10 seconds since the last full boost
    const it = setInterval(() => {
      const now = new Date();
      if (fullBoostSince && now.getTime() - fullBoostSince.getTime() > 10000) {
        setIsFullBoost(true);
      } else {
        setIsFullBoost(false);
      }
    }, 100);
    return () => clearInterval(it);
  }, [fullBoostSince, setIsFullBoost]);

  let orangeBoostP = percentage * 100 * 2.3 + 90;
  if (orangeBoostP > 270) orangeBoostP = 270;
  let redBoostP = percentage * 100 * 2.3 + 90;
  if (redBoostP < 150) redBoostP = 150;
  if (redBoostP > 400) redBoostP = 400;

  //? Between 1 and 5 based on the percentage
  const multiplicator = isFullBoost
    ? fullBoostMultiplier
    : Math.floor(1 + realPercentage * 4);

  return (
    <section
      className={cn(
        'absolute bottom-[76px] left-0 w-[120px] h-[120px]',
        '[&>img]:w-[120px] [&>img]:h-[120px] [&>img]:object-contain [&>*]:absolute [&>*]:pointer-events-none [&>*]:select-none [&>*]:user-select-none',
      )}
    >
      <img src={boostBackground} alt="boost background" />
      {/* <img src={boostFill} alt="boost fill" /> */}
      <div
        className="w-[120px] h-[120px]"
        style={{
          background: 'url(' + boostFill + ')',
          backgroundSize: 'contain',
          WebkitMaskImage: `linear-gradient(${orangeBoostP}deg, transparent 50%, black 50%), linear-gradient(90deg, transparent 50%, black 50%)`,
        }}
      ></div>
      <div
        className="w-[120px] h-[120px]"
        style={{
          filter: 'brightness(50%) sepia(100) saturate(100) hue-rotate(40deg)',
          background: 'url(' + boostFillTintable + ')',
          backgroundSize: 'contain',
          WebkitMaskImage: `linear-gradient(${redBoostP}deg, transparent 50%, black 50%)`,
        }}
      />
      <img src={boostGlow} alt="boost glow" />
      <div className="flex justify-center items-center z-10 text-white/90 flex-col leading-4 text-lg w-full h-full">
        <p
          className={cn(
            multiplicator !== fullBoostMultiplier
              ? 'animate-numberUpdate'
              : 'animate-bigNumberUpdate',
          )}
          key={multiplicator}
        >
          x{multiplicator}
        </p>
        <p className="text-white/70 text-[0.6rem]">{perSecond.toFixed(2)}/s</p>
      </div>
    </section>
  );
}
