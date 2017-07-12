import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, AlertController} from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';

import { TranslateService } from '@ngx-translate/core';

import {AccountPage} from '../pages/account/account';
import {TransactionsPage} from '../pages/transactions/transactions';
import {BalancePage} from '../pages/balance/balance';
import {LoginPage} from '../pages/login/login';
import {Network} from '@ionic-native/network';
import {AddressBookPage} from "../pages/address_book/address_book";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) navCtrl: Nav;
    rootPage: any = LoginPage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, network: Network, alertCtrl: AlertController, private translateService: TranslateService, private globalization: Globalization, private sqlite: SQLite) {
        platform.ready().then(() => {
            if (platform.is('cordova')) {

                //Open Address Book database
                this.sqlite.create({
                    name: 'data.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    db.executeSql("CREATE TABLE IF NOT EXISTS address_book (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, name TEXT, address TEXT)", {}).then((data) => {
                        console.log("TABLE CREATED: ", data);
                    }, (error) => {
                        console.error("Unable to execute sql", error);
                    })
                }, (error) => {
                    console.error("Unable to open database", error);
                });
            }
            //Show alert in case there is no internet

            let alert = alertCtrl.create({
                title: 'Your phone is disconnected from internet',
                subTitle: 'Open the app again once you have internet connection',
            });

            network.onDisconnect().subscribe(() => {
                alert.present();
            });

            //pick phone's language
            this.translateService.setDefaultLang('en');
            if (platform.is('cordova')) {

                this.globalization.getPreferredLanguage()
                    .then(language => {

                        if (language.value == 'es') {
                            this.translateService.use('es');
                        }
                        else if (language.value == 'ca') {
                            this.translateService.use('ca');
                        }
                        else {
                            this.translateService.use('en');
                        }

                    })
                    .catch(e => console.log(e));
            }
            else{
                this.translateService.use('en');
            }

            statusBar.styleDefault();
            splashScreen.hide();
        });
    }

    goToBalance(params) {
        if (!params) params = {};
        this.navCtrl.setRoot(BalancePage);
    }

    goToAccount(params) {
        if (!params) params = {};
        this.navCtrl.setRoot(AccountPage);
    }

    goToTransactions(params) {
        if (!params) params = {};
        this.navCtrl.setRoot(TransactionsPage);
    }

    goToAddressBook(params) {
        if (!params) params = {};
        this.navCtrl.setRoot(AddressBookPage);
    }
}
