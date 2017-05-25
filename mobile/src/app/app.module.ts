import { NgModule } from '@angular/core';
// , ErrorHandler
import { IonicApp, IonicModule } from 'ionic-angular';
//, IonicErrorHandler
import { MyApp } from './app.component';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserService } from "../providers/UserService";
import { PlaceService } from '../providers/PlaceService';
import { MenuService } from '../providers/MenuService';
import { OrderPage } from '../pages/order/order';
import { BasketPage } from '../pages/basket/basket';
import { Storage } from '@ionic/storage';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

import { AnimateItemSliding } from '../components/animate-item-sliding/animate-item-sliding';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyCSjgYwi3EewjnCFCm564udfsurD5RIUkM",
  authDomain: "follower-5350e.firebaseapp.com",
  databaseURL: "https://follower-5350e.firebaseio.com",
  storageBucket: "follower-5350e.appspot.com",
  messagingSenderId: "340331802320"
};

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '4bdb8b69'
  },
  // 'auth': {
  //   'facebook': {
  //     'scope': ['user_friends']
  //   }
  // },
  'push': {
    'sender_id': '340331802320',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434',
	      'sound':true,
      	'vibrate':true
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    OrderPage,
    BasketPage,
    AnimateItemSliding
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    OrderPage,
    BasketPage
  ],
  providers: [ UserService, PlaceService, MenuService, Storage ]
})
export class AppModule {}
