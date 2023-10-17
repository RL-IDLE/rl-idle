import { useNavigationStore } from '@/contexts/navigation.store';
import Home from './home/Home';
import Prestige from './prestige/Prestige';
import Shop from './shop/Shop';
import Boost from './boost/Boost';
import Ranking from './ranking/Ranking';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { IPages, pages } from '@/lib/navigation';
import Swiper from 'swiper';

const getPageIndex = (page: IPages) => {
  return pages.filter((p) => !p.disabled).findIndex((p) => p.name === page);
};
const indexToPage = (index: number, withoutDisabled: boolean = false) => {
  if (withoutDisabled) return pages.filter((p) => !p.disabled)[index].name;
  return pages[index].name;
};

export default function Game() {
  const navigationStore = useNavigationStore();
  const [swiper, setSwiper] = useState<Swiper>();

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    swiper.slideTo(getPageIndex(navigationStore.page));
  }, [navigationStore.page, swiper]);

  return (
    <SwiperComponent
      slidesPerView={1}
      className="flex-1 w-screen"
      initialSlide={getPageIndex(navigationStore.page)}
      onSlideChange={(swiper) => {
        navigationStore.setPage(indexToPage(swiper.activeIndex, true));
      }}
      onSwiper={setSwiper}
    >
      {/*eslint-disable-next-line @typescript-eslint/no-unnecessary-condition*/}
      {!pages[0].disabled && (
        <SwiperSlide>
          <Prestige />
        </SwiperSlide>
      )}
      <SwiperSlide>
        <Shop />
      </SwiperSlide>
      <SwiperSlide>
        <Home />
      </SwiperSlide>
      {/*eslint-disable-next-line @typescript-eslint/no-unnecessary-condition*/}
      {!pages[3].disabled && (
        <SwiperSlide>
          <Boost />
        </SwiperSlide>
      )}
      {/*eslint-disable-next-line @typescript-eslint/no-unnecessary-condition*/}
      {!pages[4].disabled && (
        <SwiperSlide>
          <Ranking />
        </SwiperSlide>
      )}
    </SwiperComponent>
  );
}
