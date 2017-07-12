import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';

import {ConfigProvider} from '../../providers/config/config.provider';
import {NemProvider} from '../../providers/nem/nem.provider';
import {AddressBookProvider} from '../../providers/address_book/address_book.provider';

import {LoginPage} from '../login/login';
import {AddNewAddressPage} from '../address_book/add_new_address';


@Component({
    selector: 'page-address_book',
    templateUrl: 'address_book.html'
})
export class AddressBookPage {

    storedAddresses : any
    account: string
    constructor(public navCtrl: NavController, private nem: NemProvider, private config: ConfigProvider, public translate: TranslateService, private addressBook: AddressBookProvider, private modalCtrl: ModalController) {

    }

    /**
     * Init view with the agenda
     * @param transaction  transaction object
     */
    ionViewWillEnter() {
        this.nem.getSelectedWallet().then(
            value => {
                if (!value) {
                    this.navCtrl.setRoot(LoginPage);
                }
                else {
                    this.storedAddresses =  [];
                    this.account = value.accounts[0].address;
                    this._getStoredAddresses(this.account);
                }
            }
        )
    }

    /**
     * Retrieves current account stored addresses in addres book
     * @param account address of the account to retrieve it's address book
     */
    private _getStoredAddresses(account) {
        return this.addressBook.getAddresses(account).then(data => {
            this.storedAddresses =  data;
            return data;
        })
    }

    /**
     *  Delete Address
     * @param Id of the address to remove from address book
     */

    public deleteAddress(id) {
        return this.addressBook.deleteAddress(id).then(_ => {
            this._getStoredAddresses(this.account);
        })

    }

    /**
     *  Filters shown addresses
     * @param ev event
     */
    public filterAddresses(event: any){
        this._getStoredAddresses(this.account).then(data => {
            let val = event.target.value;
            if (val && val.trim() != '') {
                this.storedAddresses = data.filter((item) => {
                    return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
                })
            }

        })

    }


    /**
     * Moves to add New Address
     */
    goToAddNewAddress(){
        let modal = this.modalCtrl.create(AddNewAddressPage, {
            account: this.account,
        });
        modal.present();

    }

}
