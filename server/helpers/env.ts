import 'module-alias/register';
// import * as dotenv from 'dotenv';
// // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config();

import 'dotenv/config';
import {
    cleanEnv,
    str,
    port
} from 'envalid';

const defaultToken = '1234567890:defaultDEFAULTdefaultDEFAULTdefault';
const specs = {
    NODE_ENV: str({default: 'undefined'}),
    PORT: port({ default: 3569 }),
    BOT_MODE: str({
        choices: ['ON','OFF'],
        default: 'ON'
    }),
    MIKAVBOT_TOKEN: str({
        devDefault: defaultToken
    }),
    MIKAHOMEBOT_TOKEN: str({
        default: defaultToken
    }),
    JWT_SECRET: str(),
    SHOW_STARTUP_INFO: str({
        choices: ['YES','NO'],
        default: 'YES'
    }),
};

const env = cleanEnv( process.env, specs );

export default env;
