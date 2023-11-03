import { Logger } from '@nestjs/common';
import databaseConfiguration from '../database.configuration';
import * as dotenv from 'dotenv';
import { IItem } from 'src/types/item';
import { env } from '../../env';
import Decimal from 'break_infinity.js';
import { IPrestige } from 'src/types/prestige';
dotenv.config();

const insertUser = async () => {
  const connection = await databaseConfiguration.initialize();

  const items: Omit<IItem, 'id'>[] = [
    {
      image: env.BASE_URL + '/public/cars/endo--blue.png',
      moneyPerClickMult: '2',
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
      price: Decimal.fromString('200').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/backfire--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('1').toString(),
      name: 'Backfire',
      price: Decimal.fromString('2500').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/breakout--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('3').toString(),
      name: 'Breakout',
      price: Decimal.fromString('8000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/breakout-type-s--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('6').toString(),
      name: 'Breakout S',
      price: Decimal.fromString('20000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/centio-v17--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('15').toString(),
      name: 'Centio',
      price: Decimal.fromString('50000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/chikara-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('30').toString(),
      name: 'Chikara',
      price: Decimal.fromString('150000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/cyclone--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('70').toString(),
      name: 'Cyclone',
      price: Decimal.fromString('450000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/delorean-time-machine--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('250').toString(),
      name: 'Delorean',
      price: Decimal.fromString('1200000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/diestro--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('1000').toString(),
      name: 'Diestro',
      price: Decimal.fromString('5000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/ecto-1--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('3000').toString(),
      name: 'Ecto 1',
      price: Decimal.fromString('30000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/endo--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('8000').toString(),
      name: 'Ecto',
      price: Decimal.fromString('100000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/gizmo--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('15000').toString(),
      name: 'Gizmo',
      price: Decimal.fromString('300000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/grog--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('20000').toString(),
      name: 'Grog',
      price: Decimal.fromString('600000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/guardian-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('30000').toString(),
      name: 'Guardian',
      price: Decimal.fromString('1500000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/hotshot--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('50000').toString(),
      name: 'Hotshot',
      price: Decimal.fromString('4000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/imperator-dt5--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('90000').toString(),
      name: 'Imperator',
      price: Decimal.fromString('10000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/jager-619-rs--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('200000').toString(),
      name: 'Jager-619',
      price: Decimal.fromString('25000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/jurassic-jeep-wrangler--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('450000').toString(),
      name: 'Jurassic Jeep',
      price: Decimal.fromString('80000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/kitt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('750000').toString(),
      name: 'Kitt',
      price: Decimal.fromString('150000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/mantis--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('1500000').toString(),
      name: 'Mantis',
      price: Decimal.fromString('400000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/marauder--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('4500000').toString(),
      name: 'Marauder',
      price: Decimal.fromString('1000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/masamune--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('8000000').toString(),
      name: 'Masamune',
      price: Decimal.fromString('3500000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/maverick-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('20000000').toString(),
      name: 'Maverick',
      price: Decimal.fromString('10000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/merc--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('45000000').toString(),
      name: 'Merc',
      price: Decimal.fromString('20000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/mudcat-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('100000000').toString(),
      name: 'Mudcat',
      price: Decimal.fromString('50000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/nemesis--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('350000000').toString(),
      name: 'Nemesis',
      price: Decimal.fromString('150000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/nimbus--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('900000000').toString(),
      name: 'Nimbus',
      price: Decimal.fromString('350000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/octane-zsr--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('2000000000').toString(),
      name: 'Octane ZSR',
      price: Decimal.fromString('750000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/paladin--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('4000000000').toString(),
      name: 'Paladin',
      price: Decimal.fromString('1500000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/ripper--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('9000000000').toString(),
      name: 'Ripper',
      price: Decimal.fromString('3000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/road-hog--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('15000000000').toString(),
      name: 'Road Hog',
      price: Decimal.fromString('5000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/road-hog-xl--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('30000000000').toString(),
      name: 'Road Hog XL',
      price: Decimal.fromString('12000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/samurai--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('30000000000').toString(),
      name: 'Samurai',
      price: Decimal.fromString('25000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/scarab--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('75000000000').toString(),
      name: 'Scarab',
      price: Decimal.fromString('75000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/takumi--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('140000000000').toString(),
      name: 'Takumi',
      price: Decimal.fromString('200000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/takumi-rx-t--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('500000000000').toString(),
      name: 'Takumi RX',
      price: Decimal.fromString('500000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/twinzer--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('1000000000000').toString(),
      name: 'Twinzer',
      price: Decimal.fromString('2000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/venom--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('2000000000000').toString(),
      name: 'Venom',
      price: Decimal.fromString('8000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/werewolf--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('4000000000000').toString(),
      name: 'Wereworlf',
      price: Decimal.fromString('40000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/x-devil--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('10000000000000').toString(),
      name: '-Devil',
      price: Decimal.fromString('80000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/x-devil-mk2--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('15000000000000').toString(),
      name: '-Devil MK2',
      price: Decimal.fromString('200000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/zippy--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('40000000000000').toString(),
      name: 'Zippy',
      price: Decimal.fromString('400000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/octane--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('100000000000000').toString(),
      name: 'Octane',
      price: Decimal.fromString('1000000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/fennec--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('500000000000000').toString(),
      name: 'Fennec',
      price: Decimal.fromString('50000000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/cars/dominus--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('10000000000000000').toString(),
      name: 'Dominus',
      price: Decimal.fromString('400000000000000000000000').toString(),
    },
  ];
  for (const item of items) {
    try {
      await connection.manager.save('item', item);
    } catch (error) {
      if (error.code !== '23505') {
        Logger.error(error);
      } else {
        //? Update
        await connection.manager.update(
          'item',
          {
            name: item.name,
          },
          item,
        );
      }
    }
  }

  Logger.log('Items created');

  await connection.destroy();
};

const insertPrestige = async () => {
  const connection = await databaseConfiguration.initialize();

  const prestiges: Omit<IPrestige, 'id'>[] = [
    // {
    //   image: env.BASE_URL + '/public/prestige/Unranked_icon.webp',
    //   moneyMult: '1',
    //   name: 'Unranked',
    //   price: Decimal.fromString('0').toString(),
    // },
    {
      image: env.BASE_URL + '/public/prestige/Bronze1_rank_icon.webp',
      moneyMult: '2',
      name: 'Bronze I',
      price: Decimal.fromString('1000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Bronze2_rank_icon.webp',
      moneyMult: '4',
      name: 'Bronze II',
      price: Decimal.fromString('25000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Bronze3_rank_icon.webp',
      moneyMult: '8',
      name: 'Bronze III',
      price: Decimal.fromString('500000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Silver1_rank_icon.webp',
      moneyMult: '16',
      name: 'Silver I',
      price: Decimal.fromString('5000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Silver2_rank_icon.webp',
      moneyMult: '32',
      name: 'Silver II',
      price: Decimal.fromString('30000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Silver3_rank_icon.webp',
      moneyMult: '64',
      name: 'Silver III',
      price: Decimal.fromString('150000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Gold1_rank_icon.webp',
      moneyMult: '128',
      name: 'Gold I',
      price: Decimal.fromString('75000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Gold2_rank_icon.webp',
      moneyMult: '256',
      name: 'Gold II',
      price: Decimal.fromString('255000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Gold3_rank_icon.webp',
      moneyMult: '512',
      name: 'Gold III',
      price: Decimal.fromString('1255000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Platinium1_rank_icon.webp',
      moneyMult: '1024',
      name: 'Platinium I',
      price: Decimal.fromString('5000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Platinium2_rank_icon.webp',
      moneyMult: '2048',
      name: 'Platinium II',
      price: Decimal.fromString('25000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Platinium3_rank_icon.webp',
      moneyMult: '4096',
      name: 'Platinium III',
      price: Decimal.fromString('125000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Diamond1_rank_icon.webp',
      moneyMult: '8192',
      name: 'Diamond I',
      price: Decimal.fromString('575000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Diamond2_rank_icon.webp',
      moneyMult: '16384',
      name: 'Diamond II',
      price: Decimal.fromString('3575000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Diamond3_rank_icon.webp',
      moneyMult: '32768',
      name: 'Diamond III',
      price: Decimal.fromString('25000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Champion1_rank_icon.webp',
      moneyMult: '65536',
      name: 'Champion I',
      price: Decimal.fromString('750000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Champion2_rank_icon.webp',
      moneyMult: '131072',
      name: 'Champion II',
      price: Decimal.fromString('2550000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Champion3_rank_icon.webp',
      moneyMult: '262144',
      name: 'Champion III',
      price: Decimal.fromString('100000000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Grand_Champion1_rank_icon.webp',
      moneyMult: '524288',
      name: 'Grand Champion I',
      price: Decimal.fromString('10000000000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Grand_Champion2_rank_icon.webp',
      moneyMult: '1048576',
      name: 'Grand Champion II',
      price: Decimal.fromString('750000000000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Grand_Champion3_rank_icon.webp',
      moneyMult: '2097152',
      name: 'Grand Champion III',
      price: Decimal.fromString('2500000000000000000000000000').toString(),
    },
    {
      image: env.BASE_URL + '/public/prestige/Supersonic_Legendrank_icon.webp',
      moneyMult: '4194304',
      name: 'Supersonic Legend',
      price: Decimal.fromString('250000000000000000000000000000').toString(),
    },
  ];

  for (const prestige of prestiges) {
    try {
      await connection.manager.save('prestige', prestige);
    } catch (error) {
      if (error.code !== '23505') {
        Logger.error(error);
      } else {
        //? Update
        await connection.manager.update(
          'prestige',
          {
            name: prestige.name,
          },
          prestige,
        );
      }
    }
  }

  Logger.log('Prestiges created');

  await connection.destroy();
};

const main = async () => {
  await insertUser();
  await insertPrestige();
};

main();
