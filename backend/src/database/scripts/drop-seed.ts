import { Logger } from '@nestjs/common';
import databaseConfiguration from '../database.configuration';
import * as dotenv from 'dotenv';
dotenv.config();

const insertUser = async () => {
  const connection = await databaseConfiguration.initialize();

  //? Drop seed tables
  await connection.manager.query('DROP TABLE IF EXISTS item');

  Logger.log('Items dropped');

  await connection.destroy();
};

insertUser();
