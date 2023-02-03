
/* Main Firebase export */

import { initializeApp, getApps, getApp } from "firebase/app";
import { configDefault } from '@utils/constants/init_constants';

export const initFirebase = async () => {
   if(getApps().length===0) {
      // This check prevents us from initializing more than one app.
      initializeApp(configDefault);
    };
};
