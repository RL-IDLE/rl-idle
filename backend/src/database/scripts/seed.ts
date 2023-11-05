import { Logger } from '@nestjs/common';
import databaseConfiguration from '../database.configuration';
import * as dotenv from 'dotenv';
import { IItem } from 'src/types/item';
import { env } from '../../env';
import Decimal from 'break_infinity.js';
import { IPrestige } from 'src/types/prestige';
import { beautify } from '../../lib/game';
dotenv.config();

//? basePres (8+8*0.1 x)^(x)
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
    price: Decimal.fromString('50000000').toString(), //? Do not follow the formula
  },
  {
    image: env.BASE_URL + '/public/prestige/Bronze3_rank_icon.webp',
    moneyMult: '8',
    name: 'Bronze III',
    price: Decimal.fromString('250000000').toString(), //? Do not follow the formula
  },
  {
    image: env.BASE_URL + '/public/prestige/Silver1_rank_icon.webp',
    moneyMult: '16',
    name: 'Silver I',
    price: Decimal.fromString('1000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Silver2_rank_icon.webp',
    moneyMult: '32',
    name: 'Silver II',
    price: Decimal.fromString('15000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Silver3_rank_icon.webp',
    moneyMult: '64',
    name: 'Silver III',
    price: Decimal.fromString('250000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Gold1_rank_icon.webp',
    moneyMult: '128',
    name: 'Gold I',
    price: Decimal.fromString('4500000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Gold2_rank_icon.webp',
    moneyMult: '256',
    name: 'Gold II',
    price: Decimal.fromString('85000000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Gold3_rank_icon.webp',
    moneyMult: '512',
    name: 'Gold III',
    price: Decimal.fromString('2000000000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Platinium1_rank_icon.webp',
    moneyMult: '1024',
    name: 'Platinium I',
    price: Decimal.fromString('40000000000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Platinium2_rank_icon.webp',
    moneyMult: '2048',
    name: 'Platinium II',
    price: Decimal.fromString('1000000000000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Platinium3_rank_icon.webp',
    moneyMult: '4096',
    name: 'Platinium III',
    price: Decimal.fromString('30000000000000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Diamond1_rank_icon.webp',
    moneyMult: '8192',
    name: 'Diamond I',
    price: Decimal.fromString('850000000000000000000').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Diamond2_rank_icon.webp',
    moneyMult: '16384',
    name: 'Diamond II',
    price: Decimal.fromString('2.75*10e22').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Diamond3_rank_icon.webp',
    moneyMult: '32768',
    name: 'Diamond III',
    price: Decimal.fromString('9.25*e23').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Champion1_rank_icon.webp',
    moneyMult: '65536',
    name: 'Champion I',
    price: Decimal.fromString('3.25*e25').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Champion2_rank_icon.webp',
    moneyMult: '131072',
    name: 'Champion II',
    price: Decimal.fromString('1.25*e27').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Champion3_rank_icon.webp',
    moneyMult: '262144',
    name: 'Champion III',
    price: Decimal.fromString('4.85e28').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Grand_champion1_rank_icon.webp',
    moneyMult: '524288',
    name: 'Grand Champion I',
    price: Decimal.fromString('2*e30').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Grand_champion2_rank_icon.webp',
    moneyMult: '1048576',
    name: 'Grand Champion II',
    price: Decimal.fromString('8.8*e31').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Grand_champion3_rank_icon.webp',
    moneyMult: '2097152',
    name: 'Grand Champion III',
    price: Decimal.fromString('4*e33').toString(),
  },
  {
    image: env.BASE_URL + '/public/prestige/Supersonic_Legend_rank_icon.webp',
    moneyMult: '4194304',
    name: 'Supersonic Legend',
    price: Decimal.fromString('1.9e35').toString(),
  },
];

const insertUser = async () => {
  const connection = await databaseConfiguration.initialize();

  const globalGainMult = Decimal.fromString('4');
  const ratio = Decimal.fromString('625');
  const items: (Omit<IItem, 'id' | 'price'> & { price?: string })[] = [
    {
      url: env.BASE_URL + '/public/cars/endo--blue.png',
      moneyPerClickMult: '2',
      moneyPerSecond: '0',
      name: 'Click',
      kind: 'click',
      price: Decimal.fromString('20').toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/animus-gp--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('0.1').times(globalGainMult),
      ).toString(),
      name: 'Animus',
      price: Decimal.fromString('20').toString(),
    },
    {
      url: env.BASE_URL + '/public/boosts/SFX_Boost_8BitStandard_0002.ogg',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('0.3').times(globalGainMult),
      ).toString(),
      name: '8Bit',
      kind: 'boost',
      price: Decimal.fromString('200').toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/artemis-gxt--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('1').times(globalGainMult),
      ).toString(),
      name: 'Artemis',
      price: Decimal.fromString('2500').toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/backfire--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('5').times(globalGainMult),
      ).toString(),
      name: 'Backfire',
      price: Decimal.fromString('15000').toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/breakout--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('30').times(globalGainMult),
      ).toString(),
      name: 'Breakout',
    },
    {
      name: 'Alien liquid',
      kind: 'boost',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('70').times(globalGainMult),
      ).toString(),
      url: env.BASE_URL + '/public/boosts/SFX_Boost_AlienLiquid_0004.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/breakout-type-s--blue.png',
      name: 'Breakout S',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('150').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/centio-v17--blue.png',
      name: 'Centio',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('250').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/chikara-gxt--blue.png',
      name: 'Chikara',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('500').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Aurora',
      kind: 'boost',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('1000').times(globalGainMult),
      ).toString(),
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Aurora_0002.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/cyclone--blue.png',
      name: 'Cyclone',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('3000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/delorean-time-machine--blue.png',
      name: 'Delorean',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('8000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/diestro--blue.png',
      name: 'Diestro',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('15000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Beats',
      kind: 'boost',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('20000').times(globalGainMult),
      ).toString(),
      url: env.BASE_URL + '/public/boosts/SFX_Boost_BeatS_0004.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/ecto-1--blue.png',
      name: 'Ecto',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('30000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/endo--blue.png',
      name: 'Endo',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('50000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/gizmo--blue.png',
      name: 'Gizmo',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('90000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Cherry blossom',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('200000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_CherryBlossom_0001.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/grog--blue.png',
      name: 'Grog',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('450000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/guardian-gxt--blue.png',
      name: 'Guardian',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('750000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/hotshot--blue.png',
      name: 'Hotshot',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('1500000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Crystal',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('4500000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Crystal_0002.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/imperator-dt5--blue.png',
      name: 'Imperator',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('8000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/jager-619-rs--blue.png',
      name: 'Jager-619',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('20000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/jurassic-jeep-wrangler--blue.png',
      name: 'Jurassic Jeep',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('45000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Cupid',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('100000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Cupid_0001.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/kitt--blue.png',
      name: 'Kitt',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('350000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/mantis--blue.png',
      name: 'Mantis',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('900000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/marauder--blue.png',
      name: 'Marauder',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('2000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Digital',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('4000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Digital_0001.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/masamune--blue.png',
      name: 'Masamune',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('9000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/maverick-gxt--blue.png',
      name: 'Maverick',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('15000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/merc--blue.png',
      name: 'Merc',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('30000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Grass',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('75000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Grass_0003.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/mudcat-gxt--blue.png',
      name: 'Mudcat',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('140000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/nemesis--blue.png',
      name: 'Nemesis',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('500000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Quasar',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('1000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Quasar_0001.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/nimbus--blue.png',
      name: 'Nimbus',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('2500000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/octane-zsr--blue.png',
      name: 'Octane ZSR',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('5000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/paladin--blue.png',
      name: 'Paladin',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('7500000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Taco',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('10000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Taco_0007.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/ripper--blue.png',
      name: 'Ripper',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('12500000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/road-hog--blue.png',
      name: 'Road Hog',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('15000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'WispySmoke',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('40000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_WispySmoke_0002.ogg',
    },
    {
      url: env.BASE_URL + '/public/cars/road-hog-xl--blue.png',
      name: 'Road Hog XL',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('100000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/samurai--blue.png',
      name: 'Samurai',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('500000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/scarab--blue.png',
      name: 'Scarab',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('10000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Ink',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Ink_0001.ogg',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('25000000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
    },
    {
      url: env.BASE_URL + '/public/cars/takumi--blue.png',
      name: 'Takumi',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('50000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/takumi-rx-t--blue.png',
      name: 'Takumi RX',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('100000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Clown',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Clown_0002.ogg',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('250000000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
    },
    {
      url: env.BASE_URL + '/public/cars/twinzer--blue.png',
      name: 'Twinzer',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('500000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/venom--blue.png',
      name: 'Venom',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('1000000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/werewolf--blue.png',
      name: 'Wereworlf',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('2000000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Bubbles',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Bubbles_0001.ogg',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('5000000000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
    },
    {
      url: env.BASE_URL + '/public/cars/x-devil--blue.png',
      name: 'Devil',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('10000000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/x-devil-mk2--blue.png',
      name: 'Devil MK2',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('20000000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Bass',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_BassBoost_0001.ogg',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('50000000000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
    },
    {
      url: env.BASE_URL + '/public/cars/zippy--blue.png',
      name: 'Zippy',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('100000000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/octane--blue.png',
      name: 'Octane',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('200000000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      url: env.BASE_URL + '/public/cars/fennec--blue.png',
      name: 'Fennec',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('400000000000000000000').times(globalGainMult),
      ).toString(),
    },
    {
      name: 'Alpha',
      url: env.BASE_URL + '/public/boosts/SFX_Boost_Alpha_0001.ogg',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('1000000000000000000000').times(globalGainMult),
      ).toString(),
      kind: 'boost',
    },
    {
      url: env.BASE_URL + '/public/cars/dominus--blue.png',
      name: 'Dominus',
      moneyPerClickMult: '0',
      moneyPerSecond: beautify(
        Decimal.fromString('2000000000000000000000').times(globalGainMult),
      ).toString(),
    },
  ];
  //? Override moneyPerSecond
  const offset = 8;
  const ipRatio = items.length / prestiges.length;
  const itemsWithMoneyPerSecond = items.map((item, i) => {
    if (item.moneyPerSecond === '0' || i < offset) return item;
    const index = Math.floor((i - offset) / ipRatio);
    const previousPrestige =
      prestiges.length > index && index > 0
        ? prestiges[index - 1]
        : {
            image: '',
            moneyMult: '1',
            name: 'Manual',
            price: Decimal.fromString('300000').toString(),
          };
    const nextPrestige = prestiges.length > index + 1 ? prestiges[index] : null;
    const modulo = (i - offset + 0.0001) % ipRatio;
    const diff = Decimal.fromString(
      nextPrestige?.price ??
        Decimal.fromString(previousPrestige.price).times('10').toString(),
    ).minus(previousPrestige.price);
    const ratio = Decimal.fromString(modulo.toString()).div(ipRatio);
    const moneyPerSecond = Decimal.fromString(diff.toString())
      .times(ratio)
      .plus(previousPrestige.price);
    // console.log({
    //   name: item.name,
    //   previousPrestigeName: previousPrestige.name,
    //   previousPrestigePrice: previousPrestige.price,
    //   nextPrestigeName: nextPrestige?.name,
    //   nextPrestigePrice: nextPrestige?.price,
    //   moneyPerSecond,
    //   modulo,
    //   ratio,
    // });
    return {
      ...item,
      moneyPerSecond: beautify(moneyPerSecond).toString(),
    };
  });

  const itemsWithPrice: Omit<IItem, 'id'>[] = itemsWithMoneyPerSecond.map(
    (item, i) => {
      return {
        ...item,
        price:
          item.price ??
          beautify(
            Decimal.fromString(item.moneyPerSecond)
              .times(ratio)
              .times(
                Decimal.fromString('2').pow(
                  Decimal.fromNumber(i).div(items.length / prestiges.length),
                ),
              ),
          ).toString(),
      };
    },
  );

  //? Check that all item have a boost sup to the previous one
  for (let i = 1; i < itemsWithPrice.length - 1; i++) {
    const item = itemsWithPrice[i];
    const nextItem = itemsWithPrice[i + 1];
    if (Decimal.fromString(item.moneyPerSecond).gte(nextItem.moneyPerSecond)) {
      Logger.error(
        `Item ${item.name} have a moneyPerSecond of ${item.moneyPerSecond} and the next one have a moneyPerSecond of ${nextItem.moneyPerSecond}`,
      );
      process.exit(1);
    }
  }

  for (const item of itemsWithPrice) {
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
  //? Delete old items
  const oldItemsName = ['-Devil', '-Devil MK2', 'Ecto 1'];
  for (const oldItemName of oldItemsName) {
    await connection.manager.delete('item', { name: oldItemName });
  }

  Logger.log('Items created');

  await connection.destroy();
};

const insertPrestige = async () => {
  const connection = await databaseConfiguration.initialize();

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
