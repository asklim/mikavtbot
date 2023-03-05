import * as dotenv from 'dotenv'
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import {
    cleanEnv,
    str
} from 'envalid';

dotenv.config();
import 'module-alias/register';

// eslint-disable-next-line node/no-process-env
export default cleanEnv( process.env, {
    PORT: str(),
    BOT_MODE: str({
        choices: ['ON','OFF'],
        default: 'ON'
    }),
    MIKAVBOT_TOKEN: str(),
    MIKAHOMEBOT_TOKEN: str(),
    JWT_SECRET: str(),
});
