import { Logger } from '@nestjs/common';
import databaseConfiguration from '../database.configuration';
import * as dotenv from 'dotenv';
import { IItem } from 'src/types/item';
import { env } from '../../env';
import Decimal from 'break_infinity.js';
dotenv.config();

const insertUser = async () => {
  const connection = await databaseConfiguration.initialize();

  const items: Omit<IItem, 'id'>[] = [
    {
      image: env.BASE_URL + '/public/cars/endo--blue.png',
      moneyPerClickMult: '1.5',
      moneyPerSecond: '0',
      name: 'Click',
      price: Decimal.fromString('20').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/animus-gp--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('0.1').toString(),
      name: 'Animus',
      price: Decimal.fromString('20').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/artemis-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('0.3').toString(),
      name: 'Artemis',
      price: Decimal.fromString('75').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/backfire--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('1').toString(),
      name: 'Backfire',
      price: Decimal.fromString('300').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/breakout--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('3').toString(),
      name: 'Breakout',
      price: Decimal.fromString('750').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/breakout-type-s--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Breakout S',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/centio-v17--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Centio',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/chikara-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Chikara',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/cyclone--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Cyclone',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/delorean-time-machine--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Delorean',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/diestro--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Diestro',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/ecto-1--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Ecto 1',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/endo--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Ecto',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/gizmo--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Gizmo',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/grog--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Grog',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/guardian-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Guardian',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/hotshot--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Hotshot',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/imperator-dt5--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Imperator',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/jager-619-rs--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Jager-619',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/jurassic-jeep-wrangler--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Jurassic Jeep',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/kitt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Kitt',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/mantis--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Mantis',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/marauder--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Marauder',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/masamune--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Masamune',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/maverick-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Maverick',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/merc--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Merc',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/mudcat-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Mudcat',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/nemesis--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Nemesis',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/nimbus--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Nimbus',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/octane-zsr--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Octane ZSR',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/paladin--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Paladin',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/ripper--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Ripper',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/road-hog--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Road Hog',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/road-hog-xl--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Road Hog XL',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/samurai--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Samurai',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/scarab--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Scarab',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/takumi--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Takumi',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/takumi-rx-t--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Takumi RX',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/twinzer--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Twinzer',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/venom--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Venom',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/werewolf--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Wereworlf',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/x-devil--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'X-Devil',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/x-devil-mk2--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'X-Devil MK2',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/zippy--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Zippy',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/octane--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Octane',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/fennec--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Fennec',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/dominus--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Dominus',
      price: Decimal.fromString('2500').toString(),
    },
  ];
  for (const item of items) {
    await connection.manager.save('item', item);
  }

  Logger.log('Items created');

  await connection.destroy();
};

insertUser();
