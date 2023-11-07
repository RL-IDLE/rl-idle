#!/bin/sh
set -e

npm run migrate:up
npm run seed
npm run start