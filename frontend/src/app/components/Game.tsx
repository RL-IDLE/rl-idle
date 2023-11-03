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
import { useUserStore } from '@/contexts/user.store';
import { socket } from '@/lib/socket';
import { logger } from '@/lib/logger';
import { useGameStore } from '@/contexts/game.store';
import { IWsEvent } from '../../../../backend/src/types/api';
import { livelinessProbeInterval } from '@/lib/constant';
import { env } from '@/env';
import { useItemsStore } from '@/contexts/items.store';

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
  const userId = useUserStore((state) => state.user?.id);
  const loadUser = useGameStore((state) => state.actions.loadUser);
  const items = useItemsStore((state) => state.items);

  useEffect(() => {
    const handleError = (data: unknown) => {
      logger.error(data);
      //? Reload the user
      loadUser();
    };

    if (!userId) return;
    const eventBody: IWsEvent['livelinessProbe']['body'] = {
      type: 'livelinessProbe',
      userId,
    };
    const livelinessRequets = () => {
      socket.emit('events', eventBody);
    };
    const probe = setInterval(livelinessRequets, livelinessProbeInterval);

    socket.on(`error:${userId}`, handleError);

    return () => {
      socket.off(`error:${userId}`, handleError);
      clearInterval(probe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    swiper.slideTo(getPageIndex(navigationStore.page));
  }, [navigationStore.page, swiper]);

  //* Expose some functions to the window for debugging
  useEffect(() => {
    if (env.VITE_ENV !== 'development') return;
    (window as unknown as { reset: unknown }).reset =
      useGameStore.getState().actions.reset;
    (window as unknown as { give: unknown }).give =
      useGameStore.getState().actions.give;
    (window as unknown as { remove: unknown }).remove =
      useGameStore.getState().actions.remove;
    (window as unknown as { givePrestige: unknown }).givePrestige =
      useGameStore.getState().actions.givePrestige;
    (window as unknown as { removePrestige: unknown }).removePrestige =
      useGameStore.getState().actions.removePrestige;
    (window as unknown as { giveItem: unknown }).giveItem =
      useGameStore.getState().actions.giveItem;
    (window as unknown as { removeItem: unknown }).removeItem =
      useGameStore.getState().actions.removeItem;

    //? Wrap all in test object
    (window as unknown as { test: unknown }).test = {
      reset: useGameStore.getState().actions.reset,
      give: useGameStore.getState().actions.give,
      remove: useGameStore.getState().actions.remove,
      givePrestige: useGameStore.getState().actions.givePrestige,
      removePrestige: useGameStore.getState().actions.removePrestige,
      giveItem: useGameStore.getState().actions.giveItem,
      removeItem: useGameStore.getState().actions.removeItem,
    };
  }, []);

  //? Expose items object to simplify giveItem and removeItem
  useEffect(() => {
    if (env.VITE_ENV !== 'development') return;
    (window as unknown as { items: unknown }).items = items.reduce<{
      [name: string]: string;
    }>((acc, item) => {
      acc[item.name] = item.id;
      return acc;
    }, {});
  }, [items]);

  const pageIndex = getPageIndex(navigationStore.page);

  return (
    <>
      <SwiperComponent
        slidesPerView={1}
        className="flex-1 w-screen"
        initialSlide={pageIndex}
        onSlideChange={(swiper) => {
          navigationStore.setPage(indexToPage(swiper.activeIndex, true));
        }}
        onSwiper={setSwiper}
        edgeSwipeThreshold={100}
        //? Do not allow swiping to the left on the first page
        allowSlidePrev={pageIndex !== 0}
        //? Do not allow swiping to the right on the last page
        allowSlideNext={
          pageIndex !== pages.filter((p) => !p.disabled).length - 1
        }
      >
        {/*eslint-disable-next-line @typescript-eslint/no-unnecessary-condition*/}
        {!pages[0].disabled && (
          <SwiperSlide>
            <Prestige />
          </SwiperSlide>
        )}
        <SwiperSlide className="z-10">
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
    </>
  );
}
