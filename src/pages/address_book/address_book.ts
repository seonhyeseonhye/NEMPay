import {Component} from '@angular/core';

import {NavController, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {ConfigProvider} from '../../providers/config/config.provider';
import {NemProvider} from '../../providers/nem/nem.provider';
import {AlertProvider} from '../../providers/alert/alert.provider';

import {TransferPage} from '../transfer/transfer';
import {LoginPage} from '../login/login';

@Component({
    selector: 'page-address_book',
    templateUrl: 'address_book.html'
})
export class AddressBookPage {

    constructor(public navCtrl: NavController, private nem: NemProvider, private loading: LoadingController, private config: ConfigProvider, public translate: TranslateService, private alert: AlertProvider) {


    }


    /**
     * Retrieves current account stored addresses in addres book
     */
    public getBalance() {

        this.nem.getSelectedWallet().then(
            value => {

                if (!value) {
                    if (refresher) refresher.complete();
                    this.navCtrl.setRoot(LoginPage);
                }
                else {

                    let loader = this.loading.create({
                        content: "Please wait..."
                    });

                    if (!refresher) loader.present();

                    this.nem.getBalance(value.accounts[0].address, this.config.defaultNetwork()).then(
                        value => {
                            this.balance = value.data;
                            console.log(this.balance);
                            if (refresher) {
                                refresher.complete();
                            }
                            else{
                                loader.dismiss();
                            }
                        })
                }
            }
        )
    }


    /**
     * Moves to transfer, by default with mosaic selected
     */
    goToTransfer(){
        if(this._checkIfSelectedMosaicIsTransferable(this.selectedMosaic)){
            this.navCtrl.push(TransferPage, {
                selectedMosaic: this.selectedMosaic.mosaicId.namespaceId + ':' + this.selectedMosaic.mosaicId.name,
                quantity: this.selectedMosaic.quantity,
            });
        }
        else{
            this.alert.showMosaicNotTransferable();
        }

    }
}
