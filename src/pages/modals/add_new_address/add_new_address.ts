import {Component} from '@angular/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {NavController, NavParams, ViewController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {NemProvider} from '../../../providers/nem/nem.provider';
import {ConfigProvider} from '../../../providers/config/config.provider';
import {AlertProvider} from '../../../providers/alert/alert.provider';
import {AddressBookProvider} from '../../../providers/address_book/address_book.provider';

import {AddressBookPage} from '../../address_book/address_book';

@Component({
    selector: 'page-add_new_address',
    templateUrl: 'add_new_address.html'
})
export class AddNewAddressPage {
    account: string
    name : string
    address : string

    constructor(public navCtrl: NavController,  private nem: NemProvider, private alert: AlertProvider, private config: ConfigProvider, public translate: TranslateService, private addressBook: AddressBookProvider, private navParams: NavParams, private barcodeScanner: BarcodeScanner, private viewCtrl: ViewController
    ) {
       this.account =  navParams.get('account');
    }

    /**
     * Moves to transfer, by default with mosaic selected
     */

    addAddressToBook(){
        if(this.nem.isFromNetwork(this.address, this.config.defaultNetwork())){
            this.addressBook.addAddress(this.account, this.name, this.address).then(_=>{
                this.navCtrl.push(AddressBookPage, {});
            })
        }
        else{
            this.alert.showAlertDoesNotBelongToNetwork();
        }
    }

    /**
     * Scans Account QR and sets account into this.formData.rawRecipient
     */
    scanQR() {
        this.barcodeScanner.scan().then((barcodeData) => {
            var addresObject = JSON.parse(barcodeData.text);
            this.address = addresObject.data.addr;
        }, (err) => {
            console.log("Error on scan");
        });
    }


    /**
     * Closes View
     */

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
