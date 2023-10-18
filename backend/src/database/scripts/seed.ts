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
      image: env.BASE_URL + '/public/cars/endo--blue.png',
      moneyPerClickMult: '0',
      moneyPerSecond: Decimal.fromString('0.1').toString(),
      name: 'Endo',
      price: Decimal.fromString('20').toString(),
    },
  ];
  for (const item of items) {
    await connection.manager.save('item', item);
  }

  Logger.log('Items created');

  await connection.destroy();
};

insertUser();
