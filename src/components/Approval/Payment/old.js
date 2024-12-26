var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, Platform, IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer } from '@ionic-native/document-viewer';
/**
 * Generated class for the AdvpaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AdvpaymentPage = /** @class */ (function () {
    function AdvpaymentPage(actionSheetCtrl, transfer, document, plt, file, fileOpener, navCtrl, alertCtrl, navParams, viewCtrl, loading, restProvider, toastCtrl) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.transfer = transfer;
        this.document = document;
        this.plt = plt;
        this.file = file;
        this.fileOpener = fileOpener;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.loading = loading;
        this.restProvider = restProvider;
        this.toastCtrl = toastCtrl;
        this.shownGroup = null;
        this.billamount_per = 0;
        // data_table_bills_temp:any;
        this.taxes_table = [];
        this.temptaxes_table = [];
        this.chqData = [];
        this.slabtax_table = [];
        this.chequestatus = "";
        this.orders = [];
        this.ownbank = [];
        this.favourof = [];
        this.cb_value = false;
        this.partylink = [];
        this.favourOfTxtVec = [];
        //   taxCurrency:any;
        this.cheque_no = [];
        this.OwnBankDetails = [];
        this.chqNoVec = [];
        this.partyBankDetails = [];
        this.taxCurrency = [];
        this.stIdIndex = 0;
        this.stAmtIndex = 0;
        this.stActualPaidIndex = 0;
        this.no_for_cheq = [];
        this.favour_of = [];
        this.actual_amt = 0.0;
        this.tdsamount1 = 0.0;
        this.bills_selected_to_pay_table = [];
        this.adjustment_table = [];
        this.datafor = "Approval";
        this.fillOrderDetails_heading = [];
        this.isChargeDeleted = false;
        this.additionalChargesHeading_view = [];
        this.additionalChargesData_view = [];
        this.billNoIndex = 0;
        this.partyNameIndex = 0;
        this.actAmtIndex = 0;
        this.availIndx = 0;
        this.billCurrIndex = 0;
        this.tdsIndex = 0;
        this.ordertotalAmtIndex = 0;
        this.totIndex = 0;
        this.payAmtIndex = 0;
        this.ordertotAmtBefConvIndex = 0;
        this.actualPaidIndex = 0;
        this.remBalIndex = 0;
        this.tk_bank = [{ value: "Bank Transfer" }, { value: "Cash" }, { value: "Cheque" }, { value: "Demand Draft" }, { value: "RTGS/NEFT" }];
        this.chargesActAmtIndex = 0;
        this.chargesCurrIndex = 0;
        this.chargesNoIndex = 0;
        this.chargestotalAmtIndex = 0;
        this.chargestotAmtBefConvIndex = 0;
        this.chargesActualPaidIndex = 0;
        this.chargesremBalIndex = 0;
        this.adjtotalAmtIndex = 0;
        this.adjtotAmtBefConvIndex = 0;
        this.chargespayAmtIndex = 0;
        this.chargesbillNoIndex = 0;
        this.isAdjustmentDeleted = false;
        this.adjustmentsData_view = [];
        this.adjustmentsHeading_view = [];
        this.header_table = ["BUYER_ID", " DEPT", " NAME", " BUYER_CODE", " CONT_PERSON"];
        this.bank_header_table = ["Bank A/c No", " Account Holder Name", "Account Type", "Bank Name", "State", "Country", "Available Balance", "Effective Balance", "Minimum Balance", " Currency"];
        this.header_party_table = ["Bank A/C No", "Party Name", "Account Holder Name", "Bank Name", "Branch Name", "Country", "Currency", "Swift No"];
        this.header_table_adjustments = ["Adjustment ID", "Adjustment Name", "Adjustment Type", "Description", "Amount", "Remarks"];
        this.header_table_slabtaxs = ["Party Name", "Party Type", "Dept Name", "Tax Name", "Rate", "Tax Amount", "Already Paid ", "Slab", "Bill Amount", "ST Paid", "Applied ST"];
        this.data_table = [];
        this.header_table_bills = ["Bill No", " Bill Date", " Party Bill No", " Party Name", " Bill Value", "Discount", "Charges Amt", "Adjustment Amt", "Total Bill Amt", "Debit Amt", "Passed Amt", "Payable Amt", "Actual Amt", "Already Paid", "Charges Paid", "TDS Amount", "Remaining Balance", "Currency", "Due Date", "Bill Status"];
        this.taxHeading_view = [];
        this.taxDate_view = [];
        this.loadpage();
    }
    AdvpaymentPage.prototype.loadpage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var load, b, dumTrans_name, key, i, j, slab, j_1, adjustmentsData_1, adjustmentsData_2, sql1, sql, dql3, tempobj, taxcurrencysql, sstbilldata, party_namesql, tempobj, Party_Name;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        load = this.loading.create({ content: 'Please wait...' });
                        return [4 /*yield*/, load.present()];
                    case 1:
                        _a.sent();
                        this.transtype = this.navParams.data.trans_name;
                        this.user_id = this.restProvider.USER_ID;
                        this.TRANS_ID = this.navParams.data;
                        this.transdetail_obj = JSON.parse(this.TRANS_ID.Approval_Details);
                        b = JSON.parse(this.transdetail_obj.transobj);
                        this.transObject = b;
                        this.payment_id = b[0];
                        this.pay_details = b[1];
                        this.pay_info = b[2];
                        this.pay_mode_details = b[3];
                        this.adv_pay = b[4];
                        this.actual_paid = b[1].PAID_AMT;
                        this.voucher_no = b[1].VOUCHER_NO;
                        this.payment_mode_details = b[1].PAYMENT_MODE;
                        /*let due_date = new Date(this.task.DUE_DATE);
                                 due_date.setDate(due_date.getDate()+1);
                                 this.task.DUE_DATE = due_date.toISOString();*/
                        this.type = this.transObject[4][0].ORDER_TYPE;
                        this.payment_date = this.transObject[1].PAYMENT_DATE;
                        this.PARTY_CURRENCY = this.transObject[1].PARTY_CURRENCY;
                        this.billamount_per = this.transObject[1].PAYMENT_PERCENT;
                        this.EXCHANGE_RATE = this.transObject[1].EXCHANGE_RATE;
                        this.narration = this.transObject[3].COMMENTS;
                        this.PAID_TO = this.transObject[3].PAID_TO;
                        this.favour_of.push(this.transObject[1].PARTY_NAME);
                        this.no = this.transObject[3].REFERENCE_NUMBER;
                        this.REFERENCE_NUMBER = this.no;
                        this.no_for_cheq.push(this.transObject[3].REFERENCE_NUMBER);
                        this.CURRENCY = this.transObject[1].CURRENCY;
                        this.remarks = this.transObject[1].REMARKS;
                        this.CANCEL_PAYMENT_REMARKS = this.transObject[1].CANCEL_PAYMENT_REMARKS;
                        this.CANCEL_PAYMENT_FLEXI1 = this.transObject[1].CANCEL_PAYMENT_FLEXI1;
                        this.CANCEL_PAYMENT_FLEXI2 = this.transObject[1].CANCEL_PAYMENT_FLEXI2;
                        this.INSTRUCTIONS = this.transObject[1].INSTRUCTIONS;
                        if (this.INSTRUCTIONS == null || this.INSTRUCTIONS == undefined || this.INSTRUCTIONS == "" && this.transtype == "CancelPayment") {
                            this.INSTRUCTIONS = this.transObject[15].INSTRUCTIONS;
                        }
                        this.pay_date = this.transObject[3].PAYMENT_DATE;
                        dumTrans_name = this.transtype;
                        if (dumTrans_name == "AddPayment") {
                            this.trans_name = "Add Advance Payment" + " - " + this.payment_id;
                        }
                        else if (dumTrans_name == "ModPayment") {
                            this.trans_name = "Modify Advance Payment" + " - " + this.payment_id;
                        }
                        else if (dumTrans_name == "CancelPayment") {
                            this.trans_name = "Cancel Advance Payment" + " - " + this.payment_id;
                        }
                        this.pay_details = b[1];
                        this.pay_info = b[2];
                        this.pay_mode_details = b[3];
                        this.adv_pay = b[4];
                        for (i = 0; i < this.adv_pay.length; i++) {
                            if (!this.orders.includes(this.adv_pay[i].PO_SO_JO_NO)) {
                                this.orders.push(this.adv_pay[i].PO_SO_JO_NO);
                            }
                        }
                        this.data_table_slabtaxes = b[9];
                        for (j = 0; j < this.data_table_slabtaxes.length; j++) {
                            slab = [];
                            slab.push(this.data_table_slabtaxes[j][1]);
                            slab.push(this.data_table_slabtaxes[j][2]);
                            slab.push(this.data_table_slabtaxes[j][3]);
                            slab.push(this.data_table_slabtaxes[j][4]);
                            slab.push(this.data_table_slabtaxes[j][5]);
                            slab.push(this.data_table_slabtaxes[j][6]);
                            slab.push(this.data_table_slabtaxes[j][7]);
                            slab.push(this.data_table_slabtaxes[j][8]);
                            slab.push(this.data_table_slabtaxes[j][9]);
                            slab.push(this.data_table_slabtaxes[j][10]);
                            if (this.data_table_slabtaxes[j][11] == true || this.data_table_slabtaxes[j][11] == 'Y' || this.data_table_slabtaxes[j][11] == 'y') {
                                slab.push(true);
                            }
                            else {
                                slab.push(false);
                            }
                            this.slabtax_table.push(slab);
                        }
                        for (j_1 = 0; j_1 < this.slabtax_table.length; j_1++) {
                            this.totslab = +this.slabtax_table[8];
                        }
                        if (!(this.transtype != "ModPayment")) return [3 /*break*/, 3];
                        adjustmentsData_1 = [];
                        return [4 /*yield*/, this.restProvider.get("/approval/getPaidAdjustmentDetails?payment_id=" + this.payment_id).then(function (result_adj) {
                                console.log(result_adj);
                                adjustmentsData_1 = result_adj;
                                _this.adjustment_table = adjustmentsData_1;
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        adjustmentsData_2 = [];
                        adjustmentsData_2 = this.transObject[12];
                        if (!(this.transObject[12] == null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.restProvider.get("/approval/getPaidAdjustmentDetails?payment_id=" + this.payment_id).then(function (result_adj) {
                                console.log(result_adj);
                                adjustmentsData_2 = result_adj;
                                _this.adjustment_table = adjustmentsData_2;
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this.adjustment_table = adjustmentsData_2;
                        _a.label = 6;
                    case 6:
                        //  this.calculateRembal();
                        this.payment_mode = this.transObject[3].PAYMENT_MODE;
                        console.log("payment mode ", this.payment_mode);
                        if (!(this.payment_mode_details == "Cheque")) return [3 /*break*/, 8];
                        sql1 = "select status,coalesce(Ac_payee,'') as Ac_payee  from cheque_details where cheque_no='" + this.transObject[3].REFERENCE_NUMBER + "' and account_no='" + this.transObject[1].ACCOUNT_NO + "'";
                        return [4 /*yield*/, this.restProvider.get("/approval/loadVectorwithContents?sql=" + sql1).then(function (result1) {
                                console.log(result1);
                                _this.chqNoVec = result1;
                                console.log(_this.chqNoVec);
                                if (_this.chqNoVec[0][1] == "Y") {
                                    _this.cb_value = true;
                                }
                            })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!(this.payment_mode_details == "Cheque" || this.payment_mode_details == "Demand Draft")) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.restProvider.get("/approval/getFavourOfObject?payment_id=" + this.payment_id).then(function (result15) {
                                console.log(result15);
                                _this.favourOfTxtVec = result15;
                            })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (!(this.chqNoVec != null || this.chqNoVec.length > 0)) return [3 /*break*/, 12];
                        sql = "select cheque_no from cheque_details c,bank_account_details b where" +
                            " (lower(c.status) ='available' or lower(c.status) ='re-use') and c.account_no='" + this.transObject[1].ACCOUNT_NO + "' and " +
                            " c.account_no=b.account_no and b.status='Active' order by cheque_no";
                        return [4 /*yield*/, this.restProvider.get("/approval/loadVectorwithContents?sql=" + sql).then(function (result2) {
                                console.log("any", result2);
                                _this.cheque_no = result2;
                            })];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        if (!(this.transObject[1].PAYMENT_MODE == "Bank Transfer" || this.transObject[1].PAYMENT_MODE == "RTGS/NEFT")) return [3 /*break*/, 14];
                        dql3 = "select bad.account_no,bad.party_name, bad.account_holder_name,coalesce( bm.bank_name,'-') as bank_name,coalesce( bm.branch_name,'-') as branch_name, coalesce(bm.country,'-') as country, bad.currency, bm.swift_code from " +
                            "bank_account_details bad left join  bank_master bm on bm.bank_id = bad.bank_id where " + "(bad.account_no||':::'||bad.bank_id||':::'||bad.party_name='" + this.transObject[3].PARTY_ACCOUNT_NO + "' or bad.account_no='" + this.transObject[3].PARTY_ACCOUNT_NO + "' )" + " and bad.account_category='Party' ";
                        tempobj = {};
                        tempobj.Query = dql3;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadVectorwithContentsjson/", tempobj).then(function (taxcurrency) {
                                _this.partyBankDetails = taxcurrency;
                            })];
                    case 13:
                        _a.sent();
                        //                         var sql3="select bad.account_no,bad.party_name, bad.account_holder_name,coalesce( bm.bank_name,'-') as bank_name,coalesce( bm.branch_name,'-') as branch_name, coalesce(bm.country,'-') as country, bad.currency, bm.swift_code from " +
                        //             "bank_account_details bad left join bank_master bm  on bm.bank_id = bad.bank_id where bad.account_no='" + this.transObject[3].PARTY_ACCOUNT_NO + "' and bad.account_category='Party' ";
                        //           await this.restProvider.get("/approval/loadVectorwithContents?sql="+sql3).then((result3) => {
                        //      console.log(result3);
                        //       = result3;
                        // });
                        if (this.PAID_TO == "" && this.transObject[1].PAYMENT_MODE == "Bank Transfer") {
                            this.PAID_TO = this.partyBankDetails[0][1];
                        }
                        _a.label = 14;
                    case 14: return [4 /*yield*/, this.restProvider.get("/approval/getBillsBankDetailsadv?accountNo=" + this.transObject[1].ACCOUNT_NO).then(function (result4) {
                            console.log(result4);
                            _this.OwnBankDetails = result4;
                        })];
                    case 15:
                        _a.sent();
                        taxcurrencysql = "select TAX_CURRENCY from financial_cycle  where rownum =1";
                        return [4 /*yield*/, this.restProvider.get("/approval/loadContents?sql=" + taxcurrencysql).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                _this.taxCurrency = taxcurrency;
                            })];
                    case 16:
                        _a.sent();
                        sstbilldata = {};
                        party_namesql = "select party_name from a_payment_details where payment_id = " + this.payment_id;
                        tempobj = {};
                        tempobj.Query = party_namesql;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj).then(function (taxcurrency) {
                                _this.party_name = taxcurrency[0];
                            })];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.convertNumberToWords()];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, this.getotherdetails()];
                    case 19:
                        _a.sent();
                        load.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.convertNumberToWords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restProvider.get("/approval/getAmountInWords?amount=" + parseFloat(this.actual_paid) + "&currency=" + this.CURRENCY).then(function (result41) {
                            console.log(result41);
                            var amount = {};
                            amount = result41;
                            _this.amountinwords = amount.strWords;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ionViewDidEnter() {
    //   this.toggleGroup(1);
    // }
    AdvpaymentPage.prototype.toggleGroup = function (group) {
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
        }
        else {
            this.shownGroup = group;
        }
    };
    ;
    AdvpaymentPage.prototype.isGroupShown = function (group) {
        return this.shownGroup === group;
    };
    ;
    /*    dismiss() {
          this.viewCtrl.dismiss();
        }*/
    AdvpaymentPage.prototype.onSelectChange = function (selectedValue) {
        this.payment_mode = selectedValue;
        console.log('Selected', this.payment_mode);
    };
    AdvpaymentPage.prototype.updateCbValue = function () {
        console.log('Something new state:' + this.cb_value);
    };
    AdvpaymentPage.prototype.viewDetailedpdf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var load, message, toast, createpdf, result1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        load = this.loading.create({ content: 'Downloading File.Please wait...' });
                        load.present();
                        message = "If the pdf/file not opened properly please check the cache location in local file manager ";
                        toast = this.toastCtrl.create({ message: message, duration: 2500, position: 'bottom' });
                        toast.present(toast);
                        createpdf = {};
                        createpdf.tranObject = JSON.parse(this.transdetail_obj.transobj);
                        createpdf.trans_id = this.transdetail_obj.trans_id;
                        createpdf.company_id = 1;
                        return [4 /*yield*/, this.restProvider.post("/approval/billspay_printDetailedPdf", createpdf).then(function (result) {
                                result1 = result;
                                var path = null;
                                if (_this.plt.is('ios')) {
                                    path = _this.file.documentsDirectory;
                                }
                                else if (_this.plt.is('android')) {
                                    path = _this.file.dataDirectory;
                                }
                                var fileName = result[1];
                                var transfer = _this.transfer.create();
                                var apiurl = _this.restProvider.apiUrl;
                                var fileName_temp = fileName.split("__")[0];
                                var options = {
                                    title: fileName_temp
                                    // ,
                                    // documentView:{closeLabel:''},
                                    // navigationView:{closeLabel:''},
                                    // email:{enabled:true},
                                    // print:{enabled:true},
                                    // openWith:{enabled:true},
                                    // bookmarks:{enabled:false},
                                    // search:{enabled:false},
                                    // autoClose:{onPause:false}
                                };
                                transfer.download(apiurl + "/approval/pdffile/" + fileName + "", path + fileName).then(function (entry) {
                                    var url = entry.toURL();
                                    _this.fileOpener.open(url, 'application/pdf')
                                        .then(function () { return console.log('File is opened'); })
                                        .catch(function (e) { return console.log('Error opening file', e); });
                                });
                            })];
                    case 1:
                        _a.sent();
                        load.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.alertButtonClick = function () {
        console.log("alert button 1 clicked");
    };
    AdvpaymentPage.prototype.alert_view = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Select an option',
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'PrintPDF',
                    handler: function () {
                        console.log('PrintPDF clicked');
                        _this.viewpdf();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    AdvpaymentPage.prototype.viewpdf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var load, message, toast, createpdf, result1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        load = this.loading.create({ content: 'Downloading File.Please wait...' });
                        load.present();
                        message = "If the pdf/file not opened properly please check the cache location in local file manager ";
                        toast = this.toastCtrl.create({ message: message, duration: 2500, position: 'bottom' });
                        toast.present(toast);
                        createpdf = {};
                        createpdf.tranObject = JSON.parse(this.transdetail_obj.transobj);
                        createpdf.trans_id = this.transdetail_obj.trans_id;
                        return [4 /*yield*/, this.restProvider.post("/approval/advancePaymentPdf", createpdf).then(function (result) {
                                result1 = result;
                                var path = null;
                                if (_this.plt.is('ios')) {
                                    path = _this.file.documentsDirectory;
                                }
                                else if (_this.plt.is('android')) {
                                    path = _this.file.externalCacheDirectory;
                                }
                                var fileName = result[1];
                                var transfer = _this.transfer.create();
                                var apiurl = _this.restProvider.apiUrl;
                                var fileName_temp = fileName.split("__")[0];
                                var options = {
                                    title: fileName_temp
                                    // ,
                                    // documentView:{closeLabel:''},
                                    // navigationView:{closeLabel:''},
                                    // email:{enabled:true},
                                    // print:{enabled:true},
                                    // openWith:{enabled:true},
                                    // bookmarks:{enabled:false},
                                    // search:{enabled:false},
                                    // autoClose:{onPause:false}
                                };
                                transfer.download(apiurl + "/approval/pdffile/" + fileName + "", path + fileName).then(function (entry) {
                                    var url = entry.toURL();
                                    _this.fileOpener.open(url, 'application/pdf')
                                        .then(function () { return console.log('File is opened'); })
                                        .catch(function (e) { return console.log('Error opening file', e); });
                                });
                            })];
                    case 1:
                        _a.sent();
                        load.dismiss();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.sourceTaxDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var load, sttaxHeading, sttaxtotal, sthideCols, steditCols, insuffParyVect, modDetType, aTotAmt, updatestobj, taxCurrencysql, stdata, stdata1, stdata, stdata1, allchargesbillData, allbillData, months, pay, payDate, colnIndex, allchargesbillData, chargescolnIndex, staxData, bildete, resultst, stresult4_1, row1, fxRate, billCurrency, fx, fxsql, fx, fxsql, totTds, tdsData, i, data_row;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        load = this.loading.create({
                            content: 'Please wait...'
                        });
                        sttaxHeading = [];
                        sttaxtotal = [];
                        sthideCols = [];
                        steditCols = [];
                        insuffParyVect = [];
                        modDetType = "";
                        updatestobj = {};
                        taxCurrencysql = "select TAX_CURRENCY from financial_cycle  where rownum =1";
                        return [4 /*yield*/, this.restProvider.get("/approval/loadContents?sql=" + taxCurrencysql).then(function (taxCurrencysqlresult) {
                                console.log("any", taxCurrencysqlresult);
                                _this.taxCurrency = taxCurrencysqlresult;
                            })];
                    case 1:
                        _a.sent();
                        if (!(this.transtype == "ModPayment")) return [3 /*break*/, 4];
                        modDetType = "oldDetails";
                        if (!(modDetType == "oldDetails")) return [3 /*break*/, 3];
                        stdata = {};
                        stdata1 = {};
                        stdata1.payment_id = this.payment_id;
                        stdata1.billData = this.orderDetails_view;
                        stdata1.bill_no = this.transObject[2][0].BILL_PO_SO_JO_NO;
                        stdata1.allchargesData = this.additionalChargesData_view;
                        stdata1.type = this.type;
                        return [4 /*yield*/, this.restProvider.post("/approval/getCancelPaymentDataadvance", stdata1).then(function (stresult4) {
                                console.log("getCancelPaymentDataadvance" + stresult4);
                                var samdata = stresult4;
                                stdata = samdata.staxData;
                                _this.actualAmtSt = samdata.aTotAmt;
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 8];
                    case 4:
                        if (!(this.transtype == "DelPayment" || this.transtype == "CancelPayment")) return [3 /*break*/, 6];
                        stdata = {};
                        stdata1 = {};
                        stdata1.payment_id = this.payment_id;
                        stdata1.billData = this.orderDetails_view;
                        stdata1.bill_no = this.transObject[2][0].BILL_PO_SO_JO_NO;
                        stdata1.allchargesData = this.additionalChargesData_view;
                        stdata1.type = this.type;
                        allchargesbillData = this.additionalChargesData_view;
                        return [4 /*yield*/, this.restProvider.post("/approval/getCancelPaymentDataadvance", stdata1).then(function (stresult4) {
                                console.log("getCancelPaymentDataadvance" + stresult4);
                                var samdata = stresult4;
                                stdata = samdata.staxData;
                                _this.actualAmtSt = samdata.aTotAmt;
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        allbillData = [];
                        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        allbillData = this.orderDetails_view;
                        pay = new Date(this.payment_date);
                        payDate = pay.getDate() + "-" + months[pay.getUTCMonth()] + "-" + pay.getFullYear();
                        colnIndex = [];
                        colnIndex.push(this.partyNameIndex + "");
                        colnIndex.push(this.billNoIndex + "");
                        colnIndex.push(this.actAmtIndex + "");
                        colnIndex.push(this.billCurrIndex + "");
                        allchargesbillData = this.additionalChargesData_view;
                        chargescolnIndex = [];
                        chargescolnIndex.push(this.partyNameIndex + "");
                        chargescolnIndex.push(this.chargesNoIndex + "");
                        chargescolnIndex.push(this.chargesActAmtIndex + "");
                        chargescolnIndex.push(this.chargesCurrIndex + "");
                        staxData = [];
                        bildete = {};
                        bildete.billData = this.orderDetails_view;
                        bildete.callFrom = "MakeAdvancePayment";
                        bildete.partylinkName = this.orderDetails_view[0][1];
                        bildete.paymentId = this.payment_id;
                        bildete.transType = this.transtype;
                        bildete.paymentDate = payDate;
                        bildete.colIndexes = colnIndex;
                        bildete.chargesData = this.additionalChargesData_view;
                        bildete.chargescolnIndex = chargescolnIndex;
                        bildete.type = this.type;
                        bildete.partyCurrency = this.partyCurrency;
                        return [4 /*yield*/, this.restProvider.post("/approval/getCalculateSTadvance", bildete).then(function (stresult44) {
                                console.log("calculateST" + stresult44);
                                resultst = stresult44;
                                staxData = stresult44;
                                stresult4_1 = stresult44;
                                if (stresult44[1].toString() != [].toString()) {
                                    _this.actualAmtSt = stresult44[1];
                                }
                                else {
                                    _this.actualAmtSt = stresult44[0];
                                }
                            })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        row1 = [];
                        allbillData = this.orderDetails_view;
                        row1 = allbillData[0];
                        fxRate = 1;
                        billCurrency = row1[this.billCurrIndex];
                        this.billCurrency_data = billCurrency;
                        if (!(billCurrency == (this.taxCurrency[0]))) return [3 /*break*/, 9];
                        fxRate = 1;
                        return [3 /*break*/, 13];
                    case 9:
                        fx = [];
                        fxsql = "select xrate from exchange_master where currency1='" + billCurrency + "' and " + "currency2=(select TAX_CURRENCY from financial_cycle  where rownum =1 )";
                        return [4 /*yield*/, this.restProvider.get("/approval/loadContents?sql=" + fxsql).then(function (fxresult1) {
                                console.log(fxresult1);
                                fx = fxresult1;
                            })];
                    case 10:
                        _a.sent();
                        if (!(fx.length > 0)) return [3 /*break*/, 11];
                        fxRate = (fx[0].toString());
                        return [3 /*break*/, 13];
                    case 11:
                        fx = [];
                        fxsql = "select 1/xrate from exchange_master where currency1=(select TAX_CURRENCY from financial_cycle  where rownum =1)" + " and currency2='" + billCurrency + "'";
                        return [4 /*yield*/, this.restProvider.get("/approval/loadContents?sql=" + fxsql).then(function (fxresult1) {
                                console.log(fxresult1);
                                fx = fxresult1;
                            })];
                    case 12:
                        _a.sent();
                        if (fx.length > 0) {
                            fxRate = (fx[0].toString());
                        }
                        else {
                            console.log("Tax Currency not added in exchange master. Please add and then proceed the payment");
                            //jmi1.setEnabled(false);
                            //              return [];
                        }
                        _a.label = 13;
                    case 13:
                        totTds = 0;
                        tdsData = this.taxDate_view;
                        //        for(Object obj:tdsData){
                        for (i = 0; i < (this.taxDate_view.length); i++) {
                            data_row = [];
                            //   Vector row=(Vector)obj;
                            data_row.push(this.taxDate_view[i]);
                            if (data_row[0][12]) {
                                totTds = Number(totTds) + Number(data_row[0][5]);
                            }
                        }
                        this.jtf_tds = (Number(totTds) * Number(fxRate)).toFixed(4);
                        // jLabel_tds.setText("TDS Amount ("+taxCurrency[0]+"):");
                        // jLabel_billAmtSt.setText("Actual Amount - Slab Tax Amount ("+billCurrency+"):");
                        if (insuffParyVect.length > 0) {
                            console.log("Bill Value of these parties '" + insuffParyVect + "' insufficient for deducting slab tax amount, " + " so slab tax will be deducted from next payment.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AdvpaymentPage');
    };
    AdvpaymentPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    AdvpaymentPage.prototype.getotherdetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, datafor, transIdPrev, transIdPrev_sql, tempobj, currtId, tempobj, orderData, chargesData, adjustmentsData, actTaxData, tmpact, j, tempobj1, tmp_value_tax_amount, letval, letval1, tempobj1, tmp_value_tax_amount, letval, letval1, tempobj1, tmp_value_tax_amount, letval, letval1, j, tempobj1, tmp_value_tax_amount, letval, letval1, j, tempobj1, tmp_value_tax_amount, letval, letval1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [];
                        datafor = "Approval";
                        if (!(this.transtype == "ModPayment")) return [3 /*break*/, 2];
                        transIdPrev_sql = "select max(trans_id) from transaction_list where identification like " +
                            "'%Adv Pay for payment_id=" + this.payment_id + ",%' and status='approve'";
                        tempobj = {};
                        tempobj.Query = transIdPrev_sql;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                //  this.taxCurrency = taxcurrency;
                            })];
                    case 1:
                        _a.sent();
                        currtId = transIdPrev > 0 ? transIdPrev[0].toString().trim() : "0";
                        /*          if(currtId.trim().equalsIgnoreCase(transObj.get(transObjlength-1).toString().trim())){
                                    datafor="Approval";    //New Details that is data from approval tables
                                  }else{
                                    datafor="ModOrView";  //Old Details that is data from main tables
                                  }*/
                        datafor = "Approval"; //New Details that is data from approval tables
                        _a.label = 2;
                    case 2:
                        tempobj = {};
                        tempobj.payment_id = this.payment_id;
                        tempobj.type = this.type;
                        tempobj.orders = this.orders;
                        tempobj.datafor = datafor;
                        //getAdvPayOrderDetailsForMIS
                        // getAdvPayOrderDetails
                        return [4 /*yield*/, this.restProvider.post("/approval/getAdvPayOrderDetails", tempobj).then(function (result) {
                                console.log(result);
                                var a = {};
                                a = result;
                                a = JSON.parse(a.result);
                                orderData = a;
                            })];
                    case 3:
                        //getAdvPayOrderDetailsForMIS
                        // getAdvPayOrderDetails
                        _a.sent();
                        tmpact = 0.00;
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < orderData.length)) return [3 /*break*/, 11];
                        if (!(this.type == 'PO')) return [3 /*break*/, 6];
                        tempobj1 = {};
                        tempobj1.Query = "select sum(tax_amount) from a_advance_tds_details where payment_id = " + this.payment_id + " and inclusive_tax = 'N' and po_so_jo_no =" + orderData[j][0] + " and reference_no =" + orderData[j][2] + " group by reference_no";
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj1).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                tmp_value_tax_amount = taxcurrency;
                            })];
                    case 5:
                        _a.sent();
                        if (tmp_value_tax_amount.length > 0) {
                            letval = Number(orderData[j][15]) + Number(tmp_value_tax_amount[0]);
                            orderData[j][15] = parseFloat(letval).toFixed(4);
                        }
                        letval1 = Number(orderData[j][15]) - Number(orderData[j][17]) - Number(orderData[j][18]) - Number(orderData[j][19]);
                        orderData[j][20] = parseFloat(letval1).toFixed(4);
                        tmpact = tmpact + Number(orderData[j][16]);
                        _a.label = 6;
                    case 6:
                        if (!(this.type == 'JO')) return [3 /*break*/, 8];
                        tempobj1 = {};
                        tempobj1.Query = "select sum(tax_amount) from a_advance_tds_details where payment_id = " + this.payment_id + " and inclusive_tax = 'N' and po_so_jo_no =" + orderData[j][0] + " and reference_no =" + orderData[j][2] + " and jo_mat_no =" + orderData[j][6] + " group by reference_no";
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj1).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                tmp_value_tax_amount = taxcurrency;
                            })];
                    case 7:
                        _a.sent();
                        if (tmp_value_tax_amount.length > 0) {
                            letval = Number(orderData[j][15]) + Number(tmp_value_tax_amount[0]);
                            orderData[j][15] = parseFloat(letval).toFixed(4);
                        }
                        letval1 = Number(orderData[j][15]) - Number(orderData[j][17]) - Number(orderData[j][18]) - Number(orderData[j][19]);
                        orderData[j][20] = parseFloat(letval1).toFixed(4);
                        tmpact = tmpact + Number(orderData[j][16]);
                        _a.label = 8;
                    case 8:
                        if (!(this.type == 'SO')) return [3 /*break*/, 10];
                        tempobj1 = {};
                        tempobj1.Query = "select sum(tax_amount) from a_advance_tds_details where payment_id = " + this.payment_id + " and inclusive_tax = 'N' and po_so_jo_no =" + orderData[j][0] + "and reference_no =" + orderData[j][2] + "group by reference_no";
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj1).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                tmp_value_tax_amount = taxcurrency;
                            })];
                    case 9:
                        _a.sent();
                        if (tmp_value_tax_amount.length > 0) {
                            letval = Number(orderData[j][12]) + Number(tmp_value_tax_amount[0]);
                            orderData[j][12] = parseFloat(letval).toFixed(4);
                        }
                        letval1 = Number(orderData[j][12]) - Number(orderData[j][14]) - Number(orderData[j][15]) - Number(orderData[j][16]);
                        orderData[j][17] = parseFloat(letval1).toFixed(4);
                        tmpact = tmpact + Number(orderData[j][13]);
                        _a.label = 10;
                    case 10:
                        j++;
                        return [3 /*break*/, 4];
                    case 11:
                        this.actual_amt = parseFloat(tmpact).toFixed(4);
                        // getAdvPayChargesDetailsForMIS
                        // getAdvPayChargesDetails
                        return [4 /*yield*/, this.restProvider.post("/approval/getAdvPayChargesDetails", tempobj).then(function (result) {
                                console.log(result);
                                var a = {};
                                a = result;
                                a = JSON.parse(a.result);
                                chargesData = a;
                            })];
                    case 12:
                        // getAdvPayChargesDetailsForMIS
                        // getAdvPayChargesDetails
                        _a.sent();
                        if (!(this.type == 'PO' || this.type == 'SO')) return [3 /*break*/, 16];
                        j = 0;
                        _a.label = 13;
                    case 13:
                        if (!(j < chargesData.length)) return [3 /*break*/, 16];
                        tempobj1 = {};
                        tmp_value_tax_amount = [];
                        tempobj1.Query = "select  sum(tax_amount) from a_advance_tds_details_charges atd left join service_master sm on sm.service_id=atd.service_id left join material_type_master mtm on \n" +
                            "mtm.category=atd.material_service_category and upper(mtm.type)=upper(atd.material_service_type) and upper(mtm.uom)=upper(atd.uom)\n" +
                            "where coalesce(mtm.type,sm.service_type) is not null and  coalesce(mtm.type,sm.service_type) = '" + chargesData[j][4] + "' and  coalesce(mtm.uom,sm.uom) = '" + chargesData[j][5] + "' and \n" +
                            "coalesce(mtm.category,sm.service_category)  = '" + chargesData[j][3] + "'and coalesce(atd.service_id||'','0') = ( case when atd.service_id is not null  then\n" +
                            " '" + chargesData[j][2] + "' else '0' end ) and  atd.inclusive_tax = 'N' and atd.payment_id = " + this.payment_id;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj1).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                tmp_value_tax_amount = taxcurrency;
                            })];
                    case 14:
                        _a.sent();
                        letval = Number(chargesData[j][11]) + Number(tmp_value_tax_amount[0]);
                        chargesData[j][11] = parseFloat(letval).toFixed(4);
                        letval1 = Number(chargesData[j][11]) - Number(chargesData[j][13]) - Number(chargesData[j][14]) - Number(chargesData[j][15]);
                        chargesData[j][16] = parseFloat(letval1).toFixed(4);
                        _a.label = 15;
                    case 15:
                        j++;
                        return [3 /*break*/, 13];
                    case 16:
                        if (!(this.type == 'JO')) return [3 /*break*/, 20];
                        j = 0;
                        _a.label = 17;
                    case 17:
                        if (!(j < chargesData.length)) return [3 /*break*/, 20];
                        tempobj1 = {};
                        tmp_value_tax_amount = [];
                        tempobj1.Query = " select sum(tax_amount) from a_advance_tds_details_charges atd LEFT JOIN service_master sm ON sm.service_id=atd.service_id where atd.payment_id = 3614 and atd.inclusive_tax = 'N' and atd.service_id = 11 ;";
                        tempobj1.Query = "select  sum(tax_amount) from a_advance_tds_details_charges atd left join service_master sm on sm.service_id=atd.service_id left join material_type_master mtm on \n" +
                            "mtm.category=atd.material_service_category and upper(mtm.type)=upper(atd.material_service_type) and upper(mtm.uom)=upper(atd.uom)\n" +
                            "where coalesce(mtm.type,sm.service_type) is not null and  coalesce(mtm.type,sm.service_type) = '" + chargesData[j][6] + "' and  coalesce(mtm.uom,sm.uom) = '" + chargesData[j][7] + "' and \n" +
                            "coalesce(mtm.category,sm.service_category)  = '" + chargesData[j][5] + "'and coalesce(atd.service_id||'','0') = ( case when atd.service_id is not null  then\n" +
                            " '" + chargesData[j][4] + "' else '0' end ) and  atd.inclusive_tax = 'N' and atd.payment_id = " + this.payment_id;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj1).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                tmp_value_tax_amount = taxcurrency;
                            })];
                    case 18:
                        _a.sent();
                        letval = Number(chargesData[j][13]) + Number(tmp_value_tax_amount[0]);
                        chargesData[j][13] = parseFloat(letval).toFixed(4);
                        letval1 = Number(chargesData[j][13]) - Number(chargesData[j][15]) - Number(chargesData[j][16]) - Number(chargesData[j][17]);
                        chargesData[j][18] = parseFloat(letval1).toFixed(4);
                        _a.label = 19;
                    case 19:
                        j++;
                        return [3 /*break*/, 17];
                    case 20: 
                    // getAdvPayAdjustmentDetailsForMIS
                    // getAdvPayAdjustmentsDetails
                    return [4 /*yield*/, this.restProvider.post("/approval/getAdvPayAdjustmentsDetails", tempobj).then(function (result) {
                            console.log(result);
                            var a = {};
                            a = result;
                            a = JSON.parse(a.result);
                            adjustmentsData = a;
                        })];
                    case 21:
                        // getAdvPayAdjustmentDetailsForMIS
                        // getAdvPayAdjustmentsDetails
                        _a.sent();
                        return [4 /*yield*/, this.restProvider.post("/approval/getOrderTaxProfileAdvPay", tempobj).then(function (result) {
                                console.log(result);
                                var a = {};
                                a = result;
                                a = JSON.parse(a.result);
                                actTaxData = a;
                            })];
                    case 22:
                        _a.sent();
                        data.push(this.pay_details.PAYMENT_MODE);
                        data.push(this.pay_details.VOUCHER_NO);
                        data.push(this.pay_details.PAYMENT_PERCENT);
                        data.push(this.pay_details.ACCOUNT_NO);
                        data.push(this.pay_mode_details.PARTY_ACCOUNT_NO);
                        data.push(this.pay_details.EXCHANGE_RATE);
                        data.push(this.pay_details.PAID_AMT);
                        data.push(this.pay_mode_details.REFERENCE_NUMBER);
                        data.push(this.pay_mode_details.PAID_TO);
                        data.push((this.pay_mode_details.PAYMENT_DATE));
                        data.push(this.pay_mode_details.COMMENTS);
                        data.push((this.pay_details.PAYMENT_DATE));
                        data.push(this.pay_details.REMARKS);
                        return [4 /*yield*/, this.fillOrderDetails(orderData, "")];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, this.fillAdditionalChargesTableDetails(chargesData, this.partyCurrency)];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, this.fillAdjustmentsTableDetails(adjustmentsData, this.partyCurrency)];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, this.getDataWithTax(orderData)];
                    case 26:
                        _a.sent();
                        //this.getChargesWithTax(chargesData);
                        return [4 /*yield*/, this.fillTaxTableDetails(actTaxData)];
                    case 27:
                        //this.getChargesWithTax(chargesData);
                        _a.sent();
                        return [4 /*yield*/, this.sourceTaxDetails()];
                    case 28:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.validatePaymentInApproval = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isPaymentInApproval, isPaymentInApproval_sql, tempobj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isPaymentInApproval = [];
                        isPaymentInApproval_sql = "select trans_id from transaction_list where status='initiated' and trans_name in ('AddPayment','ModPayment','DelPayment','CancelPayment') " +
                            "and identification like '%payment_id=" + this.payment_id + ",%'";
                        tempobj = {};
                        tempobj.Query = isPaymentInApproval_sql;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadContentsjson/", tempobj).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                isPaymentInApproval = taxcurrency[0];
                            })];
                    case 1:
                        _a.sent();
                        if (isPaymentInApproval.length > 0) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    AdvpaymentPage.prototype.fillOrderDetails = function (orderDetails, partyCurrency1) {
        return __awaiter(this, void 0, void 0, function () {
            var appFlag, mode, heading, totalCol, editCols, hideCols, title, dataFor, temp_obj, currVect, sql_curr, i, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appFlag = 1;
                        mode = 3;
                        heading = [];
                        totalCol = [];
                        editCols = [];
                        hideCols = [];
                        title = "";
                        heading.push(this.type + " No");
                        if (!(orderDetails.length == 0 && mode != 0)) return [3 /*break*/, 6];
                        dataFor = "";
                        if (!(mode == 1)) return [3 /*break*/, 1];
                        dataFor = "ModOrView";
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(mode == 3)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validatePaymentInApproval()];
                    case 2:
                        if (_a.sent()) { //If waiting for approval then show data from temp tables
                            dataFor = "Approval";
                        }
                        else {
                            dataFor = "ModOrView";
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (appFlag == 1) {
                            dataFor = "Approval";
                        }
                        _a.label = 4;
                    case 4:
                        temp_obj = {};
                        temp_obj.payment_id = this.payment_id;
                        temp_obj.type = this.type;
                        temp_obj.orders = this.orders;
                        temp_obj.datafor = dataFor;
                        return [4 /*yield*/, this.restProvider.post("/approval/getAdvPayOrderDetails", temp_obj).then(function (stresult4) {
                                console.log("getAdvPayOrderDetails" + stresult4);
                                orderDetails = stresult4;
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(orderDetails.length > 0 && partyCurrency1.trim().length <= 0)) return [3 /*break*/, 10];
                        if (!(this.type == "PO")) return [3 /*break*/, 8];
                        sql_curr = "select currency from supplier where name='" + orderDetails[0][1].toString().trim() + "'";
                        return [4 /*yield*/, this.restProvider.get("/approval/loadContents?sql=" + sql_curr).then(function (taxcurrency) {
                                console.log(taxcurrency);
                                currVect = taxcurrency;
                            })];
                    case 7:
                        _a.sent();
                        //var currVect=fInter.LoadContents("select currency from supplier where name='"+((Vector)orderDetails[0])[1].toString().trim()+"'");
                        if (currVect.length > 0) {
                            this.partyCurrency = currVect[0].toString().trim();
                        }
                        else {
                            this.partyCurrency = orderDetails[0][16].toString().trim();
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        if (this.type == "JO") {
                            this.partyCurrency = orderDetails[0][21].toString().trim();
                        }
                        else if (this.type == "SO") {
                            this.partyCurrency = orderDetails[0][18].toString().trim(); //currency id
                        }
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (partyCurrency1.trim().length > 0) {
                            this.partyCurrency = partyCurrency1;
                        }
                        _a.label = 11;
                    case 11:
                        if (this.type == "PO") {
                            heading.push("Supplier Name");
                            heading.push("Mat No");
                            heading.push("Color");
                            heading.push("Size");
                            heading.push("Ref No");
                            heading.push("Type");
                            heading.push("Material Specification");
                            heading.push("Qty");
                            heading.push("UOM");
                            heading.push("Price/UOM");
                            //Additional Charges Changes Tamizhini JAN 14
                            heading.push("Discount %");
                            heading.push("Discount(PO)");
                            heading.push("Discount(" + this.partyCurrency + ")");
                            heading.push("Total Amount (PO)");
                            heading.push("Total Amount (" + this.partyCurrency + ")");
                            heading.push("Payable Amt");
                            heading.push("Advance Amt");
                            heading.push("Advance Paid");
                            heading.push("TDS Amount");
                            heading.push("Remaining Balance");
                            heading.push("Currency");
                            //heading.push("Select");
                            title = "Materials for Advance Payment";
                            this.billCurrIndex = heading.indexOf("Currency");
                            this.partyNameIndex = heading.indexOf("Supplier Name");
                            // totalCol.add("Total Amount (PO)");
                            // totalCol.add("Total Amount ("+this.partyCurrency+")");
                            this.ordertotAmtBefConvIndex = heading.indexOf("Total Amount (PO)");
                            this.ordertotalAmtIndex = heading.indexOf("Total Amount (" + this.partyCurrency + ")");
                            this.totIndex = heading.indexOf("Total Amount (PO)");
                            // tooltipMsgconv="Total Amount in Supplier Currency";
                            // tooltipMsg="Total Amount in PO Currency";
                        }
                        else if (this.type == "JO") {
                            heading.push("Unit Name"); //1
                            heading.push("Job Id"); //2
                            heading.push("Work Center"); //3
                            heading.push("Process"); //4
                            heading.push("Item No");
                            heading.push("Mat No"); //5
                            heading.push("Material Specification"); //6
                            heading.push("Qty"); //7
                            heading.push("UOM");
                            heading.push("Rate"); //8
                            //Additional Charges Changes Tamizhini JAN 14
                            heading.push("Discount %");
                            heading.push("Discount(JO)");
                            heading.push("Discount(" + this.partyCurrency + ")");
                            heading.push("Total Amount (JO)");
                            heading.push("Total Amount (" + this.partyCurrency + ")");
                            heading.push("Payable Amt");
                            heading.push("Advance Amt");
                            heading.push("Advance Paid");
                            heading.push("TDS Amount");
                            heading.push("Remaining Balance");
                            heading.push("Currency");
                            //  heading.push("Select");
                            title = "Jobs for Advance Payment";
                            this.billCurrIndex = heading.indexOf("Currency");
                            this.partyNameIndex = heading.indexOf("Unit Name");
                            // totalCol.add("Total Amount (JO)");
                            // totalCol.add("Total Amount ("+this.partyCurrency+")");
                            this.ordertotAmtBefConvIndex = heading.indexOf("Total Amount (JO)");
                            this.ordertotalAmtIndex = heading.indexOf("Total Amount (" + this.partyCurrency + ")");
                            this.totIndex = heading.indexOf("Total Amount (JO)");
                            // tooltipMsgconv="Total Amount in Unit Currency";
                            // tooltipMsg="Total Amount in JO Currency";
                        }
                        else if (this.type == "SO") {
                            heading.push("Service Provider");
                            heading.push("Service Id");
                            heading.push("Service Type");
                            heading.push("SO Description");
                            heading.push("Additional Details");
                            heading.push("Qty");
                            heading.push("Rate");
                            heading.push("Discount %");
                            heading.push("Discount(SO)");
                            heading.push("Discount(" + this.partyCurrency + ")");
                            heading.push("Total Amount (SO)");
                            heading.push("Total Amount (" + this.partyCurrency + ")");
                            heading.push("Payable Amt");
                            heading.push("Advance Amt");
                            heading.push("Advance Paid");
                            heading.push("TDS Amount");
                            heading.push("Remaining Balance");
                            heading.push("Currency");
                            // heading.push("Select");
                            //hideCols.add("Service Id");  //Hidden Column
                            title = "Services for Advance Payment";
                            this.billCurrIndex = heading.indexOf("Currency");
                            this.partyNameIndex = heading.indexOf("Service Provider");
                            // totalCol.add("Total Amount (SO)");
                            // totalCol.add("Total Amount ("+this.partyCurrency+")");
                            this.ordertotAmtBefConvIndex = heading.indexOf("Total Amount (SO)");
                            this.ordertotalAmtIndex = heading.indexOf("Total Amount (" + this.partyCurrency + ")");
                            this.totIndex = heading.indexOf("Total Amount (SO)");
                            // tooltipMsgconv="Total Amount in Service Provider Currency";
                            // tooltipMsg="Total Amount in SO Currency";
                        }
                        this.remBalIndex = heading.indexOf("Remaining Balance"); //total Value calculation finance phase IV
                        this.billNoIndex = heading.indexOf(this.type + " No");
                        this.actAmtIndex = heading.indexOf("Advance Amt");
                        this.payAmtIndex = heading.indexOf("Payable Amt");
                        this.actualPaidIndex = heading.indexOf("Advance Paid");
                        //hideCols.add("Select");
                        // totalCol.add("Qty");
                        // totalCol.add("Advance Amt");
                        // totalCol.add("Payable Amt");
                        // totalCol.add("Remaining Balance");
                        // editCols.add(heading.indexOf("Payable Amt") + "");
                        this.title_view = title;
                        this.orderDetails_view = orderDetails;
                        this.heading_view = heading;
                        //  sst_orderDetails.setTable(orderDetails, heading, "Order_Planning", title, false, hideCols, totalCol, [], renderer, THIS, editCols);
                        if (orderDetails.length != 0 && mode != 0) {
                            for (i = 0; i < orderDetails.length; i++) {
                                row = orderDetails[i];
                                //dinesh commented
                                //     double discountPercent=Double.parseDouble(row.get(this.heading_view.indexOf("Discount %")).toString());
                                // row.set(this.heading_view.indexOf("Discount %"), numberFormat(2, discountPercent));
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //finance Phase 4 Tamizhini JAN 2019
    AdvpaymentPage.prototype.fillAdditionalChargesTableDetails = function (additionalChargesData, partyCurrency) {
        return __awaiter(this, void 0, void 0, function () {
            var mode, appFlag, additionalChargesHeading, additionalChargestotal, additionalChargeseditCols, dataFor, tempobj, hideCols;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mode = 3;
                        appFlag = 1;
                        additionalChargesHeading = [];
                        additionalChargestotal = [];
                        additionalChargeseditCols = [];
                        additionalChargesHeading = [];
                        if (!(!this.isChargeDeleted && additionalChargesData.length == 0 && mode != 0)) return [3 /*break*/, 6];
                        dataFor = "";
                        if (!(mode == 1)) return [3 /*break*/, 1];
                        dataFor = "ModOrView";
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(mode == 3)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validatePaymentInApproval()];
                    case 2:
                        if (_a.sent()) { //If waiting for approval then show data from temp tables
                            dataFor = "Approval";
                        }
                        else {
                            dataFor = "ModOrView";
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (appFlag == 1) {
                            dataFor = "Approval";
                        }
                        _a.label = 4;
                    case 4:
                        // try {  
                        if (!this.isChargeDeleted)
                            tempobj = {};
                        tempobj.payment_id = this.payment_id;
                        tempobj.type = this.type;
                        tempobj.orders = this.orders;
                        tempobj.datafor = dataFor;
                        return [4 /*yield*/, this.restProvider.post("/approval/getAdvPayChargesDetails", tempobj).then(function (result) {
                                console.log(result);
                                console.log(result);
                                var a = {};
                                a = result;
                                a = JSON.parse(a.result);
                                additionalChargesData = a;
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        hideCols = [];
                        if (this.type == ("PO")) {
                            additionalChargesHeading.push(this.type + " No");
                            additionalChargesHeading.push("Mat No");
                            additionalChargesHeading.push("SID");
                            additionalChargesHeading.push("Service/Material Category");
                            additionalChargesHeading.push("Service/Material Type");
                            additionalChargesHeading.push("Uom");
                            additionalChargesHeading.push("Expense Type");
                            additionalChargesHeading.push("Description");
                            additionalChargesHeading.push("Qty");
                            additionalChargesHeading.push("Rate");
                            additionalChargesHeading.push("Amount");
                            additionalChargesHeading.push("Total Amount(" + this.partyCurrency + ")");
                            additionalChargesHeading.push("Payable Amount"); //Added for Finance Phase II
                            additionalChargesHeading.push("Advance Amount");
                            this.chargesActAmtIndex = additionalChargesHeading.indexOf("Advance Amount");
                            //taxtotal.add("TDS Amount");
                            additionalChargesHeading.push("Advance Paid");
                            additionalChargesHeading.push("TDS Amount");
                            additionalChargesHeading.push("Remaining Balance");
                            additionalChargesHeading.push("Currency");
                            additionalChargesHeading.push("Select");
                            this.chargesCurrIndex = additionalChargesHeading.indexOf("Currency");
                            this.chargesNoIndex = additionalChargesHeading.indexOf(this.type + " No");
                            additionalChargeseditCols.push(additionalChargesHeading.indexOf("Payable Amount") + "");
                            //additionalChargeseditCols.push(additionalChargesHeading.indexOf("Select") + "");
                            //  tdsIndex=taxHeading.indexOf("TDS Amount");
                            //hideCols.add("Discount");
                            //hideCols.add("Profile Id");
                            //  hideCols.add("Charge Id");
                            //  hideCols.add("Enforce Deduction");
                            this.chargestotalAmtIndex = additionalChargesHeading.indexOf("Total Amount(" + this.partyCurrency + ")");
                            this.chargestotAmtBefConvIndex = additionalChargesHeading.indexOf("Amount");
                            hideCols.push("Mat No");
                        }
                        else if (this.type == ("JO")) {
                            additionalChargesHeading.push(this.type + " No");
                            additionalChargesHeading.push("Job Id");
                            additionalChargesHeading.push("Item No");
                            additionalChargesHeading.push("Mat No");
                            additionalChargesHeading.push("SID");
                            additionalChargesHeading.push("Service/Material Category");
                            additionalChargesHeading.push("Service/Material Type");
                            additionalChargesHeading.push("Uom");
                            additionalChargesHeading.push("Expense Type");
                            additionalChargesHeading.push("Description");
                            additionalChargesHeading.push("Qty");
                            additionalChargesHeading.push("Rate");
                            additionalChargesHeading.push("Amount");
                            additionalChargesHeading.push("Total Amount(" + this.partyCurrency + ")");
                            additionalChargesHeading.push("Payable Amount"); //Added for Finance Phase II
                            additionalChargesHeading.push("Advance Amount");
                            this.chargesActAmtIndex = additionalChargesHeading.indexOf("Advance Amount");
                            //taxtotal.add("TDS Amount");
                            additionalChargesHeading.push("Advance Paid");
                            additionalChargesHeading.push("TDS Amount");
                            additionalChargesHeading.push("Remaining Balance");
                            additionalChargesHeading.push("Currency");
                            additionalChargesHeading.push("Select");
                            this.chargesCurrIndex = additionalChargesHeading.indexOf("Currency");
                            this.chargesNoIndex = additionalChargesHeading.indexOf(this.type + " No");
                            additionalChargeseditCols.push(additionalChargesHeading.indexOf("Payable Amount") + "");
                            //additionalChargeseditCols.push(additionalChargesHeading.indexOf("Select") + "");
                            this.chargestotalAmtIndex = additionalChargesHeading.indexOf("Total Amount(" + this.partyCurrency + ")");
                            this.chargestotAmtBefConvIndex = additionalChargesHeading.indexOf("Amount");
                            hideCols.push("Job Id");
                            hideCols.push("Item No");
                            hideCols.push("Mat No");
                        }
                        else if (this.type == ("SO")) {
                            additionalChargesHeading.push(this.type + " No");
                            additionalChargesHeading.push("Service Id");
                            additionalChargesHeading.push("SID");
                            additionalChargesHeading.push("Service/Material Category");
                            additionalChargesHeading.push("Service/Material Type");
                            additionalChargesHeading.push("Uom");
                            additionalChargesHeading.push("Expense Type");
                            additionalChargesHeading.push("Description");
                            additionalChargesHeading.push("Qty");
                            additionalChargesHeading.push("Rate");
                            additionalChargesHeading.push("Amount");
                            additionalChargesHeading.push("Total Amount(" + this.partyCurrency + ")");
                            additionalChargesHeading.push("Payable Amount"); //Added for Finance Phase II
                            additionalChargesHeading.push("Advance Amount");
                            this.chargesActAmtIndex = additionalChargesHeading.indexOf("Advance Amount");
                            //taxtotal.add("TDS Amount");
                            additionalChargesHeading.push("Advance Paid");
                            additionalChargesHeading.push("TDS Amount");
                            additionalChargesHeading.push("Remaining Balance");
                            additionalChargesHeading.push("Currency");
                            additionalChargesHeading.push("Select");
                            this.chargesCurrIndex = additionalChargesHeading.indexOf("Currency");
                            this.chargesNoIndex = additionalChargesHeading.indexOf(this.type + " No");
                            additionalChargeseditCols.push(additionalChargesHeading.indexOf("Payable Amount") + "");
                            //additionalChargeseditCols.push(additionalChargesHeading.indexOf("Select") + "");
                            this.chargestotalAmtIndex = additionalChargesHeading.indexOf("Total Amount(" + this.partyCurrency + ")");
                            this.chargestotAmtBefConvIndex = additionalChargesHeading.indexOf("Amount");
                            hideCols.push("Service Id");
                        }
                        this.chargesActualPaidIndex = additionalChargesHeading.indexOf("Advance Paid");
                        this.chargesremBalIndex = additionalChargesHeading.indexOf("Remaining Balance"); //total Value calculation finance phase IV
                        this.chargesbillNoIndex = additionalChargesHeading.indexOf(this.type + " No");
                        additionalChargestotal.push("Amount");
                        additionalChargestotal.push("Total Amount(" + this.partyCurrency + ")");
                        additionalChargestotal.push("Payable Amount");
                        additionalChargestotal.push("Advance Amount");
                        additionalChargestotal.push("TDS Amount");
                        additionalChargestotal.push("Remaining Balance");
                        this.chargespayAmtIndex = additionalChargesHeading.indexOf("Payable Amount");
                        //AdditionalChargesTableCellRenderer renderer = new AdditionalChargesTableCellRenderer();
                        this.additionalChargesHeading_view = additionalChargesHeading;
                        this.additionalChargesData_view = additionalChargesData;
                        return [2 /*return*/];
                }
            });
        });
    };
    //finance Phase 4 Tamizhini JAN 2019
    AdvpaymentPage.prototype.fillAdjustmentsTableDetails = function (adjustmentsData, partyCurrency) {
        return __awaiter(this, void 0, void 0, function () {
            var adjustmentsheading, adjustmentstotal, hideCols, adjustmentseditCols, mode, appFlag, dataFor, tempobj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adjustmentsheading = [];
                        adjustmentstotal = [];
                        hideCols = [];
                        adjustmentseditCols = [];
                        mode = 3;
                        appFlag = 1;
                        if (!(adjustmentsData.length == 0 && mode != 0 && !this.isAdjustmentDeleted)) return [3 /*break*/, 2];
                        dataFor = "";
                        if (mode == 1) {
                            dataFor = "ModOrView";
                        }
                        else if (mode == 3) {
                            if (this.validatePaymentInApproval()) { //If waiting for approval then show data from temp tables
                                dataFor = "Approval";
                            }
                            else {
                                dataFor = "ModOrView";
                            }
                        }
                        else if (appFlag == 1) {
                            dataFor = "Approval";
                        }
                        tempobj = {};
                        tempobj.payment_id = this.payment_id;
                        tempobj.type = this.type;
                        tempobj.orders = this.orders;
                        tempobj.datafor = dataFor;
                        return [4 /*yield*/, this.restProvider.post("/approval/getAdvPayAdjustmentsDetails", tempobj).then(function (result) {
                                console.log(result);
                                var a = {};
                                a = result;
                                a = JSON.parse(a.result);
                                adjustmentsData = a;
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.isAdjustmentDeleted = false;
                        adjustmentsheading.push(this.type + " No");
                        adjustmentsheading.push("Adjustment ID");
                        //adjustmentsheading.push("Adjustment Category");
                        // adjustmentsheading.push("Type");
                        adjustmentsheading.push("Adjustment Name");
                        adjustmentsheading.push("Adjustment Type");
                        adjustmentsheading.push("Description");
                        adjustmentsheading.push("Amount");
                        adjustmentsheading.push("Remarks");
                        //adjustmentstotal.push("Amount");
                        //adjustmentseditCols.push(adjustmentseditCols.indexOf("Amount")+"");
                        //adjustmentseditCols.push(adjustmentseditCols.indexOf("Remarks")+"");
                        hideCols.push("Adjustment Category");
                        hideCols.push("Type");
                        this.adjtotalAmtIndex = adjustmentseditCols.indexOf("Amount");
                        // AdjustmentsTableCellRenderer renderer = new AdjustmentsTableCellRenderer();
                        this.adjustmentsData_view = adjustmentsData;
                        this.adjustmentsHeading_view = adjustmentsheading;
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.fillTaxTableDetails = function (taxData) {
        var taxHeading = [];
        var taxtotal = [];
        var hideCols = [];
        var taxeditCols = [];
        taxHeading = [];
        taxHeading.push(this.type + " No");
        taxHeading.push("Tax Name");
        // taxHeading.push("Discount");
        taxHeading.push("Rate");
        taxHeading.push("Tax Amount"); //finance phase iv changing the position change in additional charges delete calculation also
        //taxHeading.add("TDS Amount");
        taxHeading.push("TDS Amount");
        taxHeading.push("Paid Tax Amt");
        taxHeading.push("Remaining Tax Amt");
        //  taxHeading.push("Profile Id");
        //taxHeading.push("Charge Id");
        //   taxHeading.push("Enforce Deduction");  //Added for Finance Phase II
        taxHeading.push("Inclusive Tax"); //Added for Finance Phase IV
        taxHeading.push("Apply TDS");
        taxtotal.push("Tax Amount");
        //taxtotal.add("TDS Amount");
        taxtotal.push("TDS Amount");
        //taxeditCols.add(taxHeading.indexOf("TDS Amount") + "");
        //taxeditCols.add(taxHeading.indexOf("TDS Amount") + "");
        taxeditCols.push(taxHeading.indexOf("Apply TDS") + "");
        this.tdsIndex = taxHeading.indexOf("TDS Amount");
        hideCols.push("Discount");
        hideCols.push("Profile Id");
        hideCols.push("Charge Id");
        hideCols.push("Enforce Deduction");
        this.taxHeading_view = taxHeading;
        this.taxDate_view = taxData[1];
    };
    AdvpaymentPage.prototype.getDataWithTax = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var hmOrderRefAmt, orders, i, row, orderNo, key, refNo, refNo, joMat, joItem, refNo, i, row, orderNo, totalAmt, advAmt, advPaid, tdsAmt, key, refNo, refNo, joMat, joItem, refNo, p_id, cIdVec, pIdDateVec, tempobj, poDate, pIdCIdVec, tempobj, j, pIdCIdVec, tempobj, j, taxData, j, taxRow, taxCId, k, remBal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hmOrderRefAmt = {};
                        orders = [];
                        orders.push((data[0][this.heading_view.indexOf(this.type + " No")].toString()));
                        for (i = 0; i < data.length; i++) {
                            row = data[i];
                            orderNo = row[(this.heading_view.indexOf(this.type + " No"))].toString();
                            key = "";
                            if (this.type == ("PO")) {
                                refNo = row[(this.heading_view.indexOf("Mat No"))].toString();
                                key = orderNo + ":" + refNo;
                            }
                            else if (this.type == ("JO")) {
                                refNo = row[(this.heading_view.indexOf("Job Id"))].toString();
                                joMat = row[(this.heading_view.indexOf("Mat No"))].toString();
                                joItem = row[(this.heading_view.indexOf("Item No"))].toString();
                                key = orderNo + ":" + refNo + ":" + joMat + ":" + joItem;
                            }
                            else if (this.type == ("SO")) {
                                refNo = row[(this.heading_view.indexOf("Service Id"))].toString();
                                key = orderNo + ":" + refNo;
                            }
                            // if (hmOrderRefAmt.containsKey(key)) {
                            //   hmOrderRefAmt.put(key, hmOrderRefAmt.get(key) + 
                            //       Double.parseDouble(row[(ordertotalAmtIndex).toString()));
                            // } else {
                            //   hmOrderRefAmt.put(key, Double.parseDouble(row[(ordertotalAmtIndex).toString()));
                            // }
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < data.length)) return [3 /*break*/, 9];
                        row = data[i];
                        orderNo = row[(this.heading_view.indexOf(this.type + " No"))].toString();
                        totalAmt = row[(this.ordertotalAmtIndex)];
                        advAmt = row[(this.heading_view.indexOf("Advance Amt"))];
                        advPaid = row[(this.heading_view.indexOf("Advance Paid"))];
                        tdsAmt = row[(this.heading_view.indexOf("TDS Amount"))];
                        key = "";
                        if (this.type == ("PO")) {
                            refNo = row[(this.heading_view.indexOf("Mat No"))].toString();
                            key = orderNo + ":" + refNo;
                        }
                        else if (this.type == ("JO")) {
                            refNo = row[(this.heading_view.indexOf("Job Id"))].toString();
                            joMat = row[(this.heading_view.indexOf("Mat No"))].toString();
                            joItem = row[(this.heading_view.indexOf("Item No"))].toString();
                            key = orderNo + ":" + refNo + ":" + joMat + ":" + joItem;
                        }
                        else if (this.type == ("SO")) {
                            refNo = row[(this.heading_view.indexOf("Service Id"))].toString();
                            key = orderNo + ":" + refNo;
                        }
                        p_id = 0;
                        cIdVec = [];
                        if (!(this.type == ("PO"))) return [3 /*break*/, 3];
                        tempobj = {};
                        tempobj.Query = "select p_id, to_char(\"DATE\", 'DD-MON-YY') from company_purchases_mat where po_no=" + orderNo;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadVectorwithContentsjson/", tempobj).then(function (result2) {
                                pIdDateVec = result2;
                            })];
                    case 2:
                        _a.sent();
                        // var pIdDateVec = fInter.LoadVectorwithContents("select p_id, to_char(\"DATE\", 'DD-MON-YY') from company_purchases_mat where po_no=" + orderNo);
                        p_id = (pIdDateVec[0])[0].toString();
                        poDate = (pIdDateVec[0])[1].toString();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(this.type == ("JO"))) return [3 /*break*/, 5];
                        tempobj = {};
                        tempobj.Query = "select distinct profile_id, charge_id from jo_tax where jo_id=" + orderNo;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadVectorwithContentsjson/", tempobj).then(function (result2) {
                                pIdCIdVec = result2;
                            })];
                    case 4:
                        _a.sent();
                        //  Vector pIdCIdVec = fInter.LoadVectorwithContents("select distinct profile_id, charge_id from jo_tax where jo_id=" + orderNo);
                        if (pIdCIdVec != null && pIdCIdVec.length > 0) {
                            p_id = parseInt((pIdCIdVec[0])[0].toString());
                            for (j = 0; j < pIdCIdVec.length; j++) {
                                cIdVec.push((pIdCIdVec[j])[1].toString());
                            }
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        if (!(this.type == ("SO"))) return [3 /*break*/, 7];
                        tempobj = {};
                        tempobj.Query = "select distinct profile_id, charge_id from so_tax where so_id=" + orderNo;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadVectorwithContentsjson/", tempobj).then(function (result2) {
                                pIdCIdVec = result2;
                            })];
                    case 6:
                        _a.sent();
                        // Vector pIdCIdVec = fInter.LoadVectorwithContents("select distinct profile_id, charge_id from so_tax where so_id=" + orderNo);
                        if (pIdCIdVec != null && pIdCIdVec.length > 0) {
                            p_id = (pIdCIdVec[0])[0];
                            for (j = 0; j < pIdCIdVec.length; j++) {
                                cIdVec.push((pIdCIdVec[j])[1].toString());
                            }
                        }
                        _a.label = 7;
                    case 7:
                        taxData = [];
                        // taxData = calculateTax(p_id, totalAmt, totalAmt, key, hmOrderRefAmt);
                        //Vector taxData = calculateTax(p_id, totalAmt, hmOrderRefAmt, key);
                        for (j = 0; j < taxData.length; j++) {
                            taxRow = taxData[j];
                            taxCId = parseInt(taxRow[5].toString());
                            for (k = 0; k < cIdVec.length; k++) {
                                if (parseInt(cIdVec[k].toString()) == taxCId) {
                                    if (taxRow[(7)].toString() == ("N"))
                                        totalAmt += (taxRow[3].toString());
                                    // NumberFormat nf = NumberFormat.getInstance();
                                    // nf.setMaximumFractionDigits(4);
                                    // nf.setMinimumFractionDigits(2);
                                    row.set(this.ordertotalAmtIndex, (totalAmt).replace(",", ""));
                                    remBal = totalAmt - advAmt - advPaid - tdsAmt;
                                    if (remBal.replace(",", "") == ("-0.00")) {
                                        remBal = 0.00;
                                    }
                                    //commented for negative tX    if(remBal<0)
                                    //              remBal=0.00d;
                                    row.set(this.ordertotalAmtIndex, (totalAmt).replace(",", ""));
                                    row.set(this.heading_view.indexOf("Remaining Balance"), (remBal).replace(",", ""));
                                }
                            }
                        }
                        //}
                        this.fillOrderDetails(data, this.partyCurrency);
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.approvecheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var responce, messageshow, message, toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        responce = {};
                        return [4 /*yield*/, this.restProvider.get("/approval/validateIfBankAccountApproved?trans_id=" + this.transdetail_obj.trans_id).then(function (result) {
                                console.log(result);
                                responce = result;
                            })];
                    case 1:
                        _a.sent();
                        messageshow = responce.ErrorCode;
                        message = responce.Message;
                        if (!(messageshow == "false")) return [3 /*break*/, 3];
                        //     if(this.transtype == "CancelPayment" ){
                        // if(this.CANCEL_PAYMENT_REASON == null){
                        //   let datamsg  = "please enter the Approval instruction";
                        //               let toast = this.toastCtrl.create({message: datamsg , duration: 4000, position: 'bottom'});
                        //               toast.present(toast);
                        // }
                        // else{
                        // await this.approve();
                        // }
                        //     }
                        //     else{
                        return [4 /*yield*/, this.approve()];
                    case 2:
                        //     if(this.transtype == "CancelPayment" ){
                        // if(this.CANCEL_PAYMENT_REASON == null){
                        //   let datamsg  = "please enter the Approval instruction";
                        //               let toast = this.toastCtrl.create({message: datamsg , duration: 4000, position: 'bottom'});
                        //               toast.present(toast);
                        // }
                        // else{
                        // await this.approve();
                        // }
                        //     }
                        //     else{
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("cannot reject");
                        toast = this.toastCtrl.create({ message: message, duration: 2500, position: 'bottom' });
                        toast.present(toast);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.approve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isFinalLevel, isReject, refNoVec_result_1, oldChqData_1, refNoVec, row_1, confirm_1, chq2, isFinalLevel, isReject, refNoVec_result_2, oldChqData_2, refNoVec, row_2, confirm_2, chq2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.chequestatus = "";
                        if (!(this.transtype == "ModPayment")) return [3 /*break*/, 8];
                        if (!(this.navParams.data.level + 1 == this.navParams.data.levelfinal)) return [3 /*break*/, 6];
                        isFinalLevel = (this.navParams.data.levelfinal == this.navParams.data.level + 1) ? true : false;
                        isReject = false;
                        oldChqData_1 = [];
                        return [4 /*yield*/, this.restProvider.get("/approval/getupdateChequeStatus?isFinalLevel=" + isFinalLevel + "&isReject=" + isReject + "&transType=" + this.navParams.data.trans_name + "&payment_id=" + this.transObject[0] + "&bankAccNo=" + this.transObject[1].ACCOUNT_NO + "&chqStatusdef=" + this.chequestatus + "&chqNo1=" + this.no + "&payment_mode=" + this.transObject[3].PAYMENT_MODE).then(function (result1561) {
                                console.log(result1561);
                                refNoVec_result_1 = result1561;
                            })];
                    case 1:
                        _a.sent();
                        refNoVec = refNoVec_result_1;
                        if (!(refNoVec.length > 0)) return [3 /*break*/, 5];
                        row_1 = refNoVec[0];
                        if (!(row_1[3] != null && row_1[3] != "Printed")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.alertCtrl.create({
                                title: 'cheque status?',
                                message: 'Do you want to use cheque ?',
                                buttons: [
                                    {
                                        text: 'Re-Use',
                                        handler: function () {
                                            _this.chequestatus = "Re-Use";
                                            console.log('Re-Use clicked');
                                            var chq2 = [];
                                            chq2.push(row_1[0]); // Old cheque No.
                                            chq2.push(_this.chequestatus); // Old cheque No. status
                                            chq2.push(row_1[1]); // Old cheque No.'s Account No.
                                            chq2.push(row_1[2] == null ? "" : row_1[2]); // Old cheque No.'s narration/comments
                                            oldChqData_1.push(chq2);
                                            _this.chqData = oldChqData_1;
                                            console.log("chqdata from updatecheqstatus", _this.chqData);
                                            _this.approvefinal();
                                        }
                                    },
                                    {
                                        text: 'Cancelled',
                                        handler: function () {
                                            _this.chequestatus = "Cancelled";
                                            var chq2 = [];
                                            chq2.push(row_1[0]); // Old cheque No.
                                            chq2.push(_this.chequestatus); // Old cheque No. status
                                            chq2.push(row_1[1]); // Old cheque No.'s Account No.
                                            chq2.push(row_1[2] == null ? "" : row_1[2]); // Old cheque No.'s narration/comments
                                            oldChqData_1.push(chq2);
                                            _this.chqData = oldChqData_1;
                                            console.log("chqdata from updatecheqstatus", _this.chqData);
                                            _this.approvefinal();
                                            console.log('Cancelled clicked');
                                        }
                                    }
                                ]
                            })];
                    case 2:
                        confirm_1 = _a.sent();
                        return [4 /*yield*/, confirm_1.present()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this.chequestatus = "Cancelled";
                        chq2 = [];
                        chq2.push(row_1[0]); // Old cheque No.
                        chq2.push(this.chequestatus); // Old cheque No. status
                        chq2.push(row_1[1]); // Old cheque No.'s Account No.
                        chq2.push(row_1[2] == null ? "" : row_1[2]); // Old cheque No.'s narration/comments
                        oldChqData_1.push(chq2);
                        this.chqData = oldChqData_1;
                        console.log("chqdata from updatecheqstatus", this.chqData);
                        this.approvefinal();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        this.approvefinal();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 15];
                    case 8:
                        isFinalLevel = (this.navParams.data.levelfinal == this.navParams.data.level + 1) ? true : false;
                        isReject = false;
                        oldChqData_2 = [];
                        return [4 /*yield*/, this.restProvider.get("/approval/getupdateChequeStatus?isFinalLevel=" + isFinalLevel + "&isReject=" + isReject + "&transType=" + this.navParams.data.trans_name + "&payment_id=" + this.transObject[0] + "&bankAccNo=" + this.transObject[1].ACCOUNT_NO + "&chqStatusdef=" + this.chequestatus + "&chqNo1=" + this.no + "&payment_mode=" + this.transObject[3].PAYMENT_MODE).then(function (result1561) {
                                console.log(result1561);
                                refNoVec_result_2 = result1561;
                            })];
                    case 9:
                        _a.sent();
                        refNoVec = refNoVec_result_2;
                        if (!(refNoVec.length > 0)) return [3 /*break*/, 14];
                        row_2 = refNoVec[0];
                        if (!(row_2[3] != null && row_2[3] != "Printed")) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.alertCtrl.create({
                                title: 'cheque status?',
                                message: 'Do you want to use cheque ?',
                                buttons: [
                                    {
                                        text: 'Re-Use',
                                        handler: function () {
                                            _this.chequestatus = "Re-Use";
                                            console.log('Re-Use clicked');
                                            var chq2 = [];
                                            chq2.push(row_2[0]); // Old cheque No.
                                            chq2.push(_this.chequestatus); // Old cheque No. status
                                            chq2.push(row_2[1]); // Old cheque No.'s Account No.
                                            chq2.push(row_2[2] == null ? "" : row_2[2]); // Old cheque No.'s narration/comments
                                            oldChqData_2.push(chq2);
                                            _this.chqData = oldChqData_2;
                                            console.log("chqdata from updatecheqstatus", _this.chqData);
                                            _this.approvefinal();
                                        }
                                    },
                                    {
                                        text: 'Cancelled',
                                        handler: function () {
                                            _this.chequestatus = "Cancelled";
                                            console.log('Cancelled clicked');
                                            var chq2 = [];
                                            chq2.push(row_2[0]); // Old cheque No.
                                            chq2.push(_this.chequestatus); // Old cheque No. status
                                            chq2.push(row_2[1]); // Old cheque No.'s Account No.
                                            chq2.push(row_2[2] == null ? "" : row_2[2]); // Old cheque No.'s narration/comments
                                            oldChqData_2.push(chq2);
                                            _this.chqData = oldChqData_2;
                                            console.log("chqdata from updatecheqstatus", _this.chqData);
                                            _this.approvefinal();
                                        }
                                    }
                                ]
                            })];
                    case 10:
                        confirm_2 = _a.sent();
                        return [4 /*yield*/, confirm_2.present()];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        this.chequestatus = "Cancelled";
                        chq2 = [];
                        chq2.push(row_2[0]); // Old cheque No.
                        chq2.push(this.chequestatus); // Old cheque No. status
                        chq2.push(row_2[1]); // Old cheque No.'s Account No.
                        chq2.push(row_2[2] == null ? "" : row_2[2]); // Old cheque No.'s narration/comments
                        oldChqData_2.push(chq2);
                        this.chqData = oldChqData_2;
                        console.log("chqdata from updatecheqstatus", this.chqData);
                        this.approvefinal();
                        _a.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        this.chqData = oldChqData_2;
                        console.log("chqdata from updatecheqstatus", this.chqData);
                        this.approvefinal();
                        _a.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.approvefinal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempobj, tempobj, amountVec, availBal, pendingPayBal, odAmt, paidAmt, finalBal, odApplicable, cross_confirm, cross_confirm, cross_confirm;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempobj = {};
                        tempobj.Query = "select po_so_jo_no,reference_no,jo_mat_no,jo_item_no,profile_id,charge_id,tax_amount,tds_amount,tds_applied,order_type,tax_rate,inclusive_tax from a_advance_tds_details where payment_id = " + this.payment_id;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadVectorwithContentsjson/", tempobj).then(function (result2) {
                                _this.taxPayDetails = result2;
                            })];
                    case 1:
                        _a.sent();
                        tempobj = {};
                        tempobj.Query = "select po_so_jo_no,service_id,reference_no,mat_no,item_no,material_service_category,material_service_type,uom,profile_id,charge_id,tax_amount,tds_amount,tds_applied,order_type,tax_rate,inclusive_tax from a_advance_tds_details_charges where payment_id = " + this.payment_id;
                        return [4 /*yield*/, this.restProvider.post("/approval/loadVectorwithContentsjson/", tempobj).then(function (result2) {
                                _this.additionaltaxPayDetails = result2;
                            })];
                    case 2:
                        _a.sent();
                        if (!(this.transtype == "AddPayment" || this.transtype == "ModPayment")) return [3 /*break*/, 16];
                        amountVec = [];
                        return [4 /*yield*/, this.restProvider.get("/approval/toContinueOnMinBalCrossed?account_no=" + this.transObject[1].ACCOUNT_NO + "&payment_id=" + this.payment_id).then(function (result) {
                                console.log(result);
                                amountVec = result;
                            })];
                    case 3:
                        _a.sent();
                        if (!(amountVec != null && amountVec.length > 0)) return [3 /*break*/, 14];
                        availBal = amountVec[0][0];
                        pendingPayBal = amountVec[0][1];
                        odAmt = amountVec[0][3] == null ? 0 : amountVec[0][3];
                        paidAmt = this.actual_paid == "" ? "0" : this.actual_paid;
                        finalBal = parseFloat(availBal) - parseFloat(paidAmt) + parseFloat(pendingPayBal);
                        if (!(finalBal < 0)) return [3 /*break*/, 12];
                        odApplicable = amountVec[0][2] == null ? "N" : amountVec[0][2];
                        if (!(odApplicable == "Y")) return [3 /*break*/, 9];
                        if (!((parseInt(odAmt) + finalBal) >= 0)) return [3 /*break*/, 6];
                        cross_confirm = this.alertCtrl.create({
                            title: 'Confirm',
                            message: 'Actual Paid amount is crossing the Minimum Available so will use the OD amount. Do you want to continue?',
                            buttons: [
                                {
                                    text: 'Yes',
                                    handler: function () {
                                        _this.approvefinalblock();
                                        console.log("Yes clicked");
                                        return true;
                                        //    cross_confirm.dismiss(true);
                                    }
                                },
                                {
                                    text: 'No',
                                    handler: function () {
                                        //    return false;
                                        //      cross_confirm.dismiss(false);
                                    }
                                }
                            ]
                        });
                        return [4 /*yield*/, cross_confirm.present()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, cross_confirm.onDidDismiss(function (data) {
                                console.log('Yes/No', data);
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        cross_confirm = this.alertCtrl.create({
                            title: 'Confirm',
                            message: 'Actual Paid amount is crossing the Bank Account Available Balance. \nPlease select a different Bank Account for payment or enter a lesser Amount.',
                            buttons: [
                                {
                                    text: 'Yes',
                                    handler: function () {
                                        _this.approvefinalblock();
                                        console.log("Yes clicked");
                                        return true;
                                        //  cross_confirm.dismiss(true);
                                    }
                                },
                                {
                                    text: 'No',
                                    handler: function () {
                                        //     return false;
                                        //cross_confirm.dismiss(false);
                                    }
                                }
                            ]
                        });
                        return [4 /*yield*/, cross_confirm.present()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        cross_confirm = this.alertCtrl.create({
                            title: 'Confirm',
                            message: 'Actual Paid amount is crossing the Bank Account Available Balance. \nPlease select a different Bank Account for payment or enter a lesser Amount.',
                            buttons: [
                                {
                                    text: 'Yes',
                                    handler: function () {
                                        _this.approvefinalblock();
                                        console.log("Yes clicked");
                                        return true;
                                        //cross_confirm.dismiss(true);
                                    }
                                },
                                {
                                    text: 'No',
                                    handler: function () {
                                        //       return false;
                                        // cross_confirm.dismiss(false);
                                    }
                                }
                            ]
                        });
                        return [4 /*yield*/, cross_confirm.present()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        this.approvefinalblock();
                        return [2 /*return*/, true];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        this.approvefinalblock();
                        return [2 /*return*/, true];
                    case 15: return [3 /*break*/, 18];
                    case 16: return [4 /*yield*/, this.approvefinalblock()];
                    case 17:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.cheque_no_value = function (cheque) {
        console.log("selected item", cheque);
    };
    AdvpaymentPage.prototype.approvefinalblock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var responce, messageshow, message, pay_details, pay_info, adv_adjustment, pay_mode_details, adv_pay, adv_additional_charges, approval_minAmt, payment_adjustments, cont, tempdata, status_1, message_1, toast, message_2, toast, transObj, data_vec, approve_send_obj, cont, cont1, tempdata, status_2, message_3, toast, message_4, toast, transObj, transIdPrev_1, gui_current_level, current_level_1, current_level_sql, data_vec_1, temp_obj_data, approve_send_obj, cont, status_3, toast, toast, transObj, gui_current_level, current_level_2, current_level_sql, message_5, toast, data_vec_2, temp_obj_data, approve_send_obj, cont, status_4, toast, toast, transObj, gui_current_level, current_level_3, current_level_sql, message_6, toast, data_vec_3, temp_obj_data, approve_send_obj, toast;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        responce = {};
                        return [4 /*yield*/, this.restProvider.get("/approval/validateIfBankAccountApproved?trans_id=" + this.transdetail_obj.trans_id).then(function (result) {
                                console.log(result);
                                responce = result;
                            })];
                    case 1:
                        _a.sent();
                        messageshow = responce.ErrorCode;
                        message = responce.Message;
                        if (!(messageshow == "false")) return [3 /*break*/, 23];
                        console.log(this.cheque_no_value);
                        pay_details = {};
                        /* var load = this.loading.create({content: 'Please wait...'});
                          load.present(); */
                        pay_details = this.transObject[1];
                        console.log("pay details", pay_details);
                        pay_info = this.transObject[2];
                        adv_adjustment = [];
                        pay_mode_details = {};
                        pay_mode_details = this.transObject[3];
                        adv_pay = this.transObject[4];
                        adv_additional_charges = this.transObject[10];
                        approval_minAmt = {};
                        payment_adjustments = this.transObject[11];
                        if (this.transObject.length > 11 && this.transObject[11] != null) {
                            adv_adjustment = this.transObject[11];
                        }
                        if (!(this.transtype == "AddPayment")) return [3 /*break*/, 5];
                        cont = 0;
                        tempdata = void 0;
                        if (!(cont == 0)) return [3 /*break*/, 4];
                        console.log("AddPayment transaction ");
                        console.log("Checking has condition changed ");
                        status_1 = 1;
                        return [4 /*yield*/, this.restProvider.get("/approval/getHasConditionChanged?trans_id=" + this.transdetail_obj.trans_id).then(function (status_result) {
                                console.log(status_result);
                                status_1 = status_result;
                            })];
                    case 2:
                        _a.sent();
                        console.log("Status found after has condition changed: status=" + status_1);
                        if (status_1 == 0) {
                            message_1 = "There is no Chain Conditions satisfied. You should reject this transaction.";
                            toast = this.toastCtrl.create({ message: message_1, duration: 2500, position: 'bottom' });
                            toast.present(toast);
                            // load.dismiss();
                            return [2 /*return*/];
                        }
                        if (status_1 == 2) {
                            message_2 = "This transaction has been sent to correct approver due to change in condition";
                            toast = this.toastCtrl.create({ message: message_2, duration: 2500, position: 'bottom' });
                            toast.present(toast);
                            //  load.dismiss();
                            return [2 /*return*/];
                        }
                        if (status_1 != 1) {
                            return [2 /*return*/];
                        }
                        /*
                        var transobj1 :any = [];
                                  pay_details.INSTRUCTIONS = "Payment Approved";
                                  transobj1.splice(0,0,this.payment_id);
                                  transobj1.splice(1,0,pay_details);
                                  transobj1.splice(2,0,pay_info);
                                  transobj1.splice(3,0,pay_mode_details);
                                  transobj1.splice(4,0,null);
                                  transobj1.splice(5,0,approval_minAmt);
                                  transobj1.splice(6,0,this.user_id);
                        if (this.transObject[7].length > 0) {
                                    transobj1.splice(7,0, this.transObject[7]);
                                  } else {
                                    transobj1.splice(7,0,[]);
                                  }
                                  transobj1.splice(8,0, {});
                        if(this.transObject[9].length>0){
                                    transobj1.splice(9,0,this.transObject[9]);
                                  }else{
                                    transobj1.splice(9,0,[]);
                                  }
                        
                                   transobj1.splice(10,0,null);// advance additional charges
                                   transobj1.splice(11,0,payment_adjustments); // advance adjustment
                                   transobj1.splice(12,0,null); //charges tax
                                   transobj1.splice(13,0,"0");
                               
                        
                                    console.log("Payment_id from Vector transObj = ---->>>..............." + this.payment_id);
                                  console.log("going to call approve method .....transObj" + transobj1 + "....\n");
                                  
                                   let gui_current_level= this.navParams.data.level;
                                   let current_level:any;
                                   let current_level_sql="select no_of_levels, current_level from transaction_list where trans_id=" + this.transdetail_obj.trans_id;
                                              await this.restProvider.get("/approval/loadVectorwithContents?sql="+current_level_sql).then((result_3) => {
                             console.log("tax curr_level :"+result_3);
                             current_level = result_3[0][1];
                        
                        
                                 });
                        
                        
                                    if(gui_current_level != current_level){
                                      let message= "Sorry! Approval level has been changed.";
                                      let toast = this.toastCtrl.create({message: message , duration: 2500, position: 'bottom'});
                                       toast.present(toast);
                                      
                                    }
                        
                        let data_vec = [];
                                    let temp_obj_data={};
                                    data_vec.push(this.payment_id);
                                    data_vec.push(pay_details);
                                    data_vec.push(pay_info);
                                    data_vec.push(pay_mode_details);
                                    data_vec.push(null);
                                    data_vec.push(approval_minAmt);
                        
                                    if (this.chqData.length > 0) {
                                      
                                      data_vec.push(this.chqData);
                                    }
                        
                        let approve_send_obj:any={};
                          approve_send_obj.trans_id=this.transdetail_obj.trans_id;
                            approve_send_obj.app_id=this.transdetail_obj.appid;
                            approve_send_obj.tranObject=transobj1;
                            approve_send_obj.message="Approved";
                            approve_send_obj.data_vec=data_vec;
                            approve_send_obj.company_id=this.restProvider.companyid
                            approve_send_obj.handler=this.transdetail_obj.handler;
                            approve_send_obj.gui_current_level = this.navParams.data.level;
                        
                        await this.restProvider.post("/approval/approveTransaction",approve_send_obj).then(result => {
                        console.log(result);
                        var responce :any={};
                        responce = result;
                        
                                  var messageshow = responce.ErrorCode;
                                  let toast = this.toastCtrl.create({message: messageshow , duration: 2500, position: 'bottom'});
                        
                                      toast.present(toast);
                                   //   load.dismiss();
                          this.viewCtrl.dismiss();
                                  });
                        
                        }
                                */
                        pay_details.INSTRUCTIONS = "Payment Approved";
                        transObj = [];
                        transObj.push(this.payment_id);
                        transObj.push(pay_details);
                        transObj.push(pay_info);
                        transObj.push(pay_mode_details);
                        transObj.push(adv_pay);
                        transObj.push(approval_minAmt);
                        transObj.push(this.user_id);
                        if (this.taxPayDetails.length > 0) {
                            transObj.push(this.taxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push({});
                        //newly added on 28/01/2016 source tax 
                        if (this.transObject[9].length > 0) {
                            transObj.push(this.transObject[9]);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push(adv_additional_charges);
                        transObj.push(adv_adjustment);
                        if (this.additionaltaxPayDetails.length > 0) {
                            transObj.push(this.additionaltaxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        //end newly added on 28/01/2016 source tax
                        transObj.push("0");
                        data_vec = [];
                        data_vec.push(this.payment_id);
                        data_vec.push(pay_details);
                        data_vec.push(pay_info);
                        data_vec.push(pay_mode_details);
                        data_vec.push(adv_pay);
                        data_vec.push(approval_minAmt);
                        if (this.chqData.length > 0) {
                            data_vec.push(this.chqData);
                        }
                        approve_send_obj = {};
                        approve_send_obj.trans_id = this.transdetail_obj.trans_id;
                        approve_send_obj.app_id = this.transdetail_obj.appid;
                        approve_send_obj.tranObject = transObj;
                        approve_send_obj.message = "Approved";
                        approve_send_obj.data_vec = data_vec;
                        approve_send_obj.company_id = this.restProvider.companyid;
                        approve_send_obj.handler = this.transdetail_obj.handler;
                        approve_send_obj.gui_current_level = this.navParams.data.level;
                        return [4 /*yield*/, this.restProvider.post("/approval/approveTransaction", approve_send_obj).then(function (result) {
                                console.log(result);
                                var responce = {};
                                responce = result;
                                var messageshow = responce.ErrorCode;
                                var toast = _this.toastCtrl.create({ message: messageshow, duration: 2500, position: 'bottom' });
                                toast.present(toast);
                                //   load.dismiss();
                                _this.viewCtrl.dismiss();
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 12];
                    case 5:
                        if (!(this.transtype == "ModPayment")) return [3 /*break*/, 12];
                        cont = 0;
                        cont1 = 0;
                        tempdata = void 0;
                        if (!(cont == 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.checkPayStatus("Modify")];
                    case 6:
                        if (_a.sent()) {
                            cont1 = 1;
                        }
                        _a.label = 7;
                    case 7:
                        if (!(cont == 0 && cont1 == 0)) return [3 /*break*/, 12];
                        console.log("ModPayment transaction ");
                        console.log("Checking has condition changed ");
                        status_2 = 1;
                        return [4 /*yield*/, this.restProvider.get("/approval/getHasConditionChanged?trans_id=" + this.transdetail_obj.trans_id).then(function (status_result) {
                                console.log(status_result);
                                status_2 = status_result;
                            })];
                    case 8:
                        _a.sent();
                        console.log("Status found after has condition changed: status=" + status_2);
                        if (status_2 == 0) {
                            message_3 = "There is no Chain Conditions satisfied. You should reject this transaction.";
                            toast = this.toastCtrl.create({ message: message_3, duration: 2500, position: 'bottom' });
                            toast.present(toast);
                            return [2 /*return*/];
                        }
                        if (status_2 == 2) {
                            message_4 = "This transaction has been sent to correct approver due to change in condition";
                            toast = this.toastCtrl.create({ message: message_4, duration: 2500, position: 'bottom' });
                            toast.present(toast);
                            return [2 /*return*/];
                        }
                        if (status_2 != 1) {
                            return [2 /*return*/];
                        }
                        transObj = [];
                        transObj.push(this.payment_id);
                        transObj.push(pay_details);
                        transObj.push(pay_info);
                        transObj.push(pay_mode_details);
                        transObj.push(adv_pay);
                        transObj.push(approval_minAmt);
                        transObj.push(this.user_id);
                        if (this.taxPayDetails.length > 0) {
                            transObj.push(this.taxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push({});
                        //newly added on 28/01/2016 source tax 
                        if (this.transObject[9].length > 0) {
                            transObj.push(this.transObject[9]);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push(adv_additional_charges);
                        transObj.push(adv_adjustment);
                        if (this.additionaltaxPayDetails.length > 0) {
                            transObj.push(this.additionaltaxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        //let transIdPrev_sql="select max(trans_id) from transaction_list where identification like '%Bill Pay for payment_id="+this.payment_id+",%' and status='approve'";
                        return [4 /*yield*/, this.restProvider.get("/approval/transIdPrevadv?payment_id=" + this.payment_id).then(function (result_3t) {
                                console.log("transIdPrev :" + result_3t);
                                transIdPrev_1 = result_3t;
                            })];
                    case 9:
                        //let transIdPrev_sql="select max(trans_id) from transaction_list where identification like '%Bill Pay for payment_id="+this.payment_id+",%' and status='approve'";
                        _a.sent();
                        transObj.splice(13, 0, transIdPrev_1.length > 0 ? transIdPrev_1[0] : "0");
                        gui_current_level = this.navParams.data.level;
                        current_level_sql = "select no_of_levels, current_level from transaction_list where trans_id=" + this.transdetail_obj.trans_id;
                        return [4 /*yield*/, this.restProvider.get("/approval/loadVectorwithContents?sql=" + current_level_sql).then(function (result_3) {
                                console.log("tax curr_level :" + result_3);
                                current_level_1 = result_3[0][1];
                            })];
                    case 10:
                        _a.sent();
                        data_vec_1 = [];
                        temp_obj_data = {};
                        data_vec_1.push(this.payment_id);
                        data_vec_1.push(pay_details);
                        data_vec_1.push(pay_info);
                        data_vec_1.push(pay_mode_details);
                        data_vec_1.push(adv_pay);
                        data_vec_1.push(approval_minAmt);
                        if (this.chqData.length > 0) {
                            data_vec_1.push(this.chqData);
                        }
                        approve_send_obj = {};
                        approve_send_obj.trans_id = this.transdetail_obj.trans_id;
                        approve_send_obj.app_id = this.transdetail_obj.appid;
                        approve_send_obj.tranObject = transObj;
                        approve_send_obj.message = "Approved";
                        approve_send_obj.data_vec = data_vec_1;
                        approve_send_obj.company_id = this.restProvider.companyid;
                        approve_send_obj.handler = this.transdetail_obj.handler;
                        approve_send_obj.gui_current_level = this.navParams.data.level;
                        return [4 /*yield*/, this.restProvider.post("/approval/approveTransaction", approve_send_obj).then(function (result) {
                                console.log(result);
                                var responce = {};
                                responce = result;
                                var messageshow = responce.ErrorCode;
                                var toast = _this.toastCtrl.create({ message: messageshow, duration: 2500, position: 'bottom' });
                                toast.present(toast);
                                // load.dismiss();
                                _this.viewCtrl.dismiss();
                            })];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        if (!(this.transtype == "DelPayment")) return [3 /*break*/, 17];
                        cont = 0;
                        return [4 /*yield*/, this.checkPayStatus("Delete")];
                    case 13:
                        if (_a.sent()) {
                            cont = 1;
                        }
                        if (!(cont == 0)) return [3 /*break*/, 17];
                        console.log("DelPayment transaction ");
                        console.log("Checking has condition changed ");
                        status_3 = 1;
                        return [4 /*yield*/, this.restProvider.get("/approval/getHasConditionChanged?trans_id=" + this.transdetail_obj.trans_id).then(function (status_result) {
                                console.log(status_result);
                                status_3 = status_result;
                            })];
                    case 14:
                        _a.sent();
                        console.log("Status found after has condition changed: status=" + status_3);
                        if (status_3 == 0) {
                            toast = this.toastCtrl.create({ message: "There is no Chain Conditions satisfied. You should reject this transaction.", duration: 2500, position: 'bottom' });
                            toast.present(toast);
                        }
                        if (status_3 == 2) {
                            toast = this.toastCtrl.create({ message: "This transaction has been sent to correct approver due to change in condition", duration: 2500, position: 'bottom' });
                            toast.present(toast);
                            return [2 /*return*/];
                        }
                        if (status_3 != 1) {
                            return [2 /*return*/];
                        }
                        transObj = [];
                        transObj.push(this.payment_id);
                        transObj.push(pay_details);
                        transObj.push(pay_info);
                        transObj.push(pay_mode_details);
                        transObj.push(adv_pay);
                        transObj.push(approval_minAmt);
                        transObj.push(this.user_id);
                        if (this.taxPayDetails.length > 0) {
                            transObj.push(this.taxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push({});
                        //newly added on 28/01/2016 source tax 
                        if (this.transObject[9].length > 0) {
                            transObj.push(this.transObject[9]);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push(adv_additional_charges);
                        transObj.push(adv_adjustment);
                        if (this.additionaltaxPayDetails.length > 0) {
                            transObj.push(this.additionaltaxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        //end newly added on 28/01/2016 source tax
                        transObj.push("0");
                        gui_current_level = this.navParams.data.level;
                        current_level_sql = "select no_of_levels, current_level from transaction_list where trans_id=" + this.transdetail_obj.trans_id;
                        return [4 /*yield*/, this.restProvider.get("/approval/loadVectorwithContents?sql=" + current_level_sql).then(function (result_3) {
                                console.log("tax curr_level :" + result_3);
                                current_level_2 = result_3[0][1];
                            })];
                    case 15:
                        _a.sent();
                        if (gui_current_level != current_level_2) {
                            message_5 = "Sorry! Approval level has been changed.";
                            toast = this.toastCtrl.create({ message: message_5, duration: 2500, position: 'bottom' });
                            toast.present(toast);
                        }
                        data_vec_2 = [];
                        temp_obj_data = {};
                        data_vec_2.push(this.payment_id);
                        data_vec_2.push(pay_details);
                        data_vec_2.push(pay_info);
                        data_vec_2.push(pay_mode_details);
                        data_vec_2.push(adv_pay);
                        data_vec_2.push(approval_minAmt);
                        //            Vector chqData = updateChequeStatus((no_of_level == current_level+1) ? true : false, false);
                        if (this.chqData.length > 0) {
                            data_vec_2.push(this.chqData);
                        }
                        approve_send_obj = {};
                        approve_send_obj.trans_id = this.transdetail_obj.trans_id;
                        approve_send_obj.app_id = this.transdetail_obj.appid;
                        approve_send_obj.tranObject = transObj;
                        approve_send_obj.message = "Approved";
                        approve_send_obj.data_vec = data_vec_2;
                        approve_send_obj.company_id = this.restProvider.companyid;
                        approve_send_obj.handler = this.transdetail_obj.handler;
                        approve_send_obj.gui_current_level = this.navParams.data.level;
                        return [4 /*yield*/, this.restProvider.post("/approval/approveTransaction", approve_send_obj).then(function (result) {
                                console.log(result);
                                var responce = {};
                                responce = result;
                                var messageshow = responce.ErrorCode;
                                var toast = _this.toastCtrl.create({ message: messageshow, duration: 2500, position: 'bottom' });
                                toast.present(toast);
                                //   load.dismiss();
                                _this.viewCtrl.dismiss();
                            })];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17:
                        if (!(this.transtype == "CancelPayment")) return [3 /*break*/, 22];
                        cont = 0;
                        return [4 /*yield*/, this.checkPayStatus("Cancel")];
                    case 18:
                        if (_a.sent()) {
                            cont = 1;
                        }
                        if (!(cont == 0)) return [3 /*break*/, 22];
                        console.log("CancelPayment transaction ");
                        console.log("Checking has condition changed ");
                        status_4 = 1;
                        return [4 /*yield*/, this.restProvider.get("/approval/getHasConditionChanged?trans_id=" + this.transdetail_obj.trans_id).then(function (status_result) {
                                console.log(status_result);
                                status_4 = status_result;
                            })];
                    case 19:
                        _a.sent();
                        console.log("Status found after has condition changed: status=" + status_4);
                        if (status_4 == 0) {
                            toast = this.toastCtrl.create({ message: "There is no Chain Conditions satisfied. You should reject this transaction.", duration: 2500, position: 'bottom' });
                            toast.present(toast);
                            return [2 /*return*/];
                        }
                        if (status_4 == 2) {
                            toast = this.toastCtrl.create({ message: "This transaction has been sent to correct approver due to change in condition", duration: 2500, position: 'bottom' });
                            toast.present(toast);
                            return [2 /*return*/];
                        }
                        if (status_4 != 1) {
                            return [2 /*return*/];
                        }
                        pay_details.PAYMENT_STATUS = "Cancelled";
                        transObj = [];
                        transObj.push(this.payment_id);
                        transObj.push(pay_details);
                        transObj.push(pay_info);
                        transObj.push(pay_mode_details);
                        transObj.push(adv_pay);
                        transObj.push(approval_minAmt);
                        transObj.push(this.user_id);
                        if (this.taxPayDetails.length > 0) {
                            transObj.push(this.taxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push({});
                        //newly added on 28/01/2016 source tax 
                        if (this.transObject[9].length > 0) {
                            transObj.push(this.transObject[9]);
                        }
                        else {
                            transObj.push([]);
                        }
                        transObj.push(adv_additional_charges);
                        transObj.push(adv_adjustment);
                        if (this.additionaltaxPayDetails.length > 0) {
                            transObj.push(this.additionaltaxPayDetails);
                        }
                        else {
                            transObj.push([]);
                        }
                        //end newly added on 28/01/2016 source tax
                        transObj.push("0");
                        gui_current_level = this.navParams.data.level;
                        current_level_sql = "select no_of_levels, current_level from transaction_list where trans_id=" + this.transdetail_obj.trans_id;
                        return [4 /*yield*/, this.restProvider.get("/approval/loadVectorwithContents?sql=" + current_level_sql).then(function (result_3) {
                                console.log("tax curr_level :" + result_3);
                                current_level_3 = result_3[0][1];
                            })];
                    case 20:
                        _a.sent();
                        if (gui_current_level != current_level_3) {
                            message_6 = "Sorry! Approval level has been changed.";
                            toast = this.toastCtrl.create({ message: message_6, duration: 2500, position: 'bottom' });
                            toast.present(toast);
                        }
                        data_vec_3 = [];
                        temp_obj_data = {};
                        data_vec_3.push(this.payment_id);
                        data_vec_3.push(pay_details);
                        data_vec_3.push(pay_info);
                        data_vec_3.push(pay_mode_details);
                        data_vec_3.push(adv_pay);
                        data_vec_3.push(approval_minAmt);
                        //            Vector chqData = updateChequeStatus((no_of_level == current_level+1) ? true : false, false);
                        if (this.chqData.length > 0) {
                            data_vec_3.push(this.chqData);
                        }
                        approve_send_obj = {};
                        approve_send_obj.trans_id = this.transdetail_obj.trans_id;
                        approve_send_obj.app_id = this.transdetail_obj.appid;
                        approve_send_obj.tranObject = transObj;
                        approve_send_obj.message = "Approved";
                        approve_send_obj.data_vec = data_vec_3;
                        approve_send_obj.company_id = this.restProvider.companyid;
                        approve_send_obj.handler = this.transdetail_obj.handler;
                        approve_send_obj.gui_current_level = this.navParams.data.level;
                        return [4 /*yield*/, this.restProvider.post("/approval/approveTransaction", approve_send_obj).then(function (result) {
                                console.log(result);
                                var responce = {};
                                responce = result;
                                var messageshow = responce.ErrorCode;
                                var toast = _this.toastCtrl.create({ message: messageshow, duration: 2500, position: 'bottom' });
                                toast.present(toast);
                                //  load.dismiss();
                                _this.viewCtrl.dismiss();
                            })];
                    case 21:
                        _a.sent();
                        _a.label = 22;
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        console.log("cannot reject");
                        toast = this.toastCtrl.create({ message: message, duration: 2500, position: 'bottom' });
                        toast.present(toast);
                        _a.label = 24;
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.checkPayStatus = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var payStatus, payStatusVec, payment_status_sql, message, toast, message, toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payStatus = "";
                        payment_status_sql = "select payment_status from payment_details where payment_id=" + this.payment_id;
                        return [4 /*yield*/, this.restProvider.get("/approval/loadContents?sql=" + payment_status_sql).then(function (result_1) {
                                console.log(result_1);
                                payStatusVec = result_1;
                            })];
                    case 1:
                        _a.sent();
                        if (payStatusVec.length > 0) {
                            payStatus = payStatusVec[0];
                        }
                        if (action == "Modify") {
                            if (payStatus == "Cleared") {
                                message = "This payment has been cleared and hence cannot Modify the payment.";
                                toast = this.toastCtrl.create({ message: message, duration: 2500, position: 'bottom' });
                                toast.present(toast);
                                return [2 /*return*/, true];
                            }
                        }
                        else if (action == "Delete") {
                            if (payStatus == "Cleared") {
                                message = "This payment has been cleared and hence cannot delete the payment.";
                                toast = this.toastCtrl.create({ message: message, duration: 2500, position: 'bottom' });
                                toast.present(toast);
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    AdvpaymentPage.prototype.rejectcheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //   if(this.transtype == "CancelPayment" ){
                    // if(this.CANCEL_PAYMENT_REASON == null){
                    //   let datamsg  = "please enter the Approval instruction";
                    //               let toast = this.toastCtrl.create({message: datamsg , duration: 4000, position: 'bottom'});
                    //               toast.present(toast);
                    // }
                    // else{
                    // await this.reject();
                    // }
                    //     }
                    //else{
                    return [4 /*yield*/, this.reject()];
                    case 1:
                        //   if(this.transtype == "CancelPayment" ){
                        // if(this.CANCEL_PAYMENT_REASON == null){
                        //   let datamsg  = "please enter the Approval instruction";
                        //               let toast = this.toastCtrl.create({message: datamsg , duration: 4000, position: 'bottom'});
                        //               toast.present(toast);
                        // }
                        // else{
                        // await this.reject();
                        // }
                        //     }
                        //else{
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.reject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var messageshow, message, alert_1, toast;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.restProvider.get("/approval/validateIfBankAccountApproved?trans_id=" + this.transdetail_obj.trans_id).then(function (result) {
                            console.log(result);
                            var responce = {};
                            responce = result;
                            messageshow = responce.ErrorCode;
                            message = responce.Message;
                        })];
                    case 1:
                        _a.sent();
                        if (!(messageshow == "false")) return [3 /*break*/, 3];
                        alert_1 = this.alertCtrl.create({
                            title: 'Reject',
                            message: 'Please enter the reason to Reject',
                            inputs: [{
                                    name: 'title',
                                    placeholder: 'Reason'
                                },],
                            buttons: [{
                                    text: 'Cancel',
                                    handler: function () {
                                        console.log('Cancel clicked');
                                    }
                                }, {
                                    text: 'Save',
                                    handler: function (data) {
                                        _this.save_reject(data);
                                    }
                                }]
                        });
                        return [4 /*yield*/, alert_1.present()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.log(message);
                        toast = this.toastCtrl.create({
                            message: message,
                            duration: 2500,
                            position: 'bottom'
                        });
                        toast.present(toast);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.save_reject = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var toast, load_1, refNoVec_result_3, isFinalLevel, isReject, cont_alert, refNoVec, row_3, confirm_3, oldChqData, chq2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(data.title);
                        if (!(data.title == "" || data.title == null || data.title == undefined)) return [3 /*break*/, 1];
                        console.log("Please enter the reason to Reject");
                        toast = this.toastCtrl.create({
                            message: "Please enter the reason to Reject",
                            duration: 2500,
                            position: 'bottom'
                        });
                        toast.present(toast);
                        return [3 /*break*/, 3];
                    case 1:
                        load_1 = this.loading.create({
                            content: 'Please wait...'
                        });
                        load_1.present();
                        // pay_details.INSTRUCTIONS = reason.trim();
                        //Vector chqData = updateChequeStatus(true, true);
                        this.transObject[1].INSTRUCTIONS = data.title;
                        isFinalLevel = true;
                        isReject = true;
                        cont_alert = 0;
                        return [4 /*yield*/, this.restProvider.get("/approval/getupdateChequeStatus?isFinalLevel=" + isFinalLevel + "&isReject=" + isReject + "&transType=" + this.navParams.data.trans_name + "&payment_id=" + this.transObject[0] + "&bankAccNo=" + this.transObject[1].ACCOUNT_NO + "&chqStatusdef=" + this.chequestatus + "&chqNo1=" + this.no + "&payment_mode=" + this.transObject[3].PAYMENT_MODE).then(function (result1561) {
                                console.log(result1561);
                                refNoVec_result_3 = result1561;
                            })];
                    case 2:
                        _a.sent();
                        refNoVec = refNoVec_result_3;
                        if (refNoVec.length > 0) {
                            row_3 = refNoVec[0];
                            if (row_3[3] != null && row_3[3] != "Printed") {
                                confirm_3 = this.alertCtrl.create({
                                    title: 'cheque status?',
                                    message: 'Do you want to use cheque ?',
                                    buttons: [
                                        {
                                            text: 'Re-Use',
                                            handler: function () {
                                                _this.chequestatus = "Re-Use";
                                                var oldChqData = [];
                                                var chq2 = [];
                                                chq2.push(row_3[0]); // Old cheque No.
                                                chq2.push(_this.chequestatus); // Old cheque No. status
                                                chq2.push(row_3[1]); // Old cheque No.'s Account No.
                                                chq2.push(row_3[2] == null ? "" : row_3[2]); // Old cheque No.'s narration/comments
                                                oldChqData.push(chq2);
                                                _this.chqData = oldChqData;
                                                _this.reject_final(data, load_1);
                                                console.log("chqdata from updatecheqstatus", _this.chqData);
                                                console.log('Re-Use clicked');
                                            }
                                        },
                                        {
                                            text: 'Cancelled',
                                            handler: function () {
                                                _this.chequestatus = "Cancelled";
                                                var oldChqData = [];
                                                var chq2 = [];
                                                chq2.push(row_3[0]); // Old cheque No.
                                                chq2.push(_this.chequestatus); // Old cheque No. status
                                                chq2.push(row_3[1]); // Old cheque No.'s Account No.
                                                chq2.push(row_3[2] == null ? "" : row_3[2]); // Old cheque No.'s narration/comments
                                                oldChqData.push(chq2);
                                                _this.chqData = oldChqData;
                                                _this.reject_final(data, load_1);
                                                console.log("chqdata from updatecheqstatus", _this.chqData);
                                                console.log('Cancelled clicked');
                                            }
                                        }
                                    ]
                                });
                                confirm_3.present();
                            }
                            else {
                                this.chequestatus = "Cancelled";
                                oldChqData = [];
                                chq2 = [];
                                chq2.push(row_3[0]); // Old cheque No.
                                chq2.push(this.chequestatus); // Old cheque No. status
                                chq2.push(row_3[1]); // Old cheque No.'s Account No.
                                chq2.push(row_3[2] == null ? "" : row_3[2]); // Old cheque No.'s narration/comments
                                oldChqData.push(chq2);
                                this.chqData = oldChqData;
                                this.reject_final(data, load_1);
                                console.log("chqdata from updatecheqstatus", this.chqData);
                            }
                        }
                        else {
                            this.reject_final(data, load_1);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdvpaymentPage.prototype.reject_final = function (data, load) {
        return __awaiter(this, void 0, void 0, function () {
            var responce, messageshow, message, reject_send_obj, toast;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        responce = {};
                        return [4 /*yield*/, this.restProvider.get("/approval/validateIfBankAccountApproved?trans_id=" + this.transdetail_obj.trans_id).then(function (result) {
                                console.log(result);
                                responce = result;
                            })];
                    case 1:
                        _a.sent();
                        messageshow = responce.ErrorCode;
                        message = responce.Message;
                        if (!(messageshow == "false")) return [3 /*break*/, 3];
                        reject_send_obj = {};
                        reject_send_obj.app_id = this.transdetail_obj.appid;
                        reject_send_obj.trans_id = this.transdetail_obj.trans_id;
                        reject_send_obj.bankAccNo = this.transObject[1].ACCOUNT_NO;
                        reject_send_obj.tranObject = this.transObject;
                        reject_send_obj.chqStatus = this.chequestatus;
                        reject_send_obj.payment_id = this.transObject[0];
                        reject_send_obj.user_id = this.restProvider.USER_ID;
                        reject_send_obj.message = data.title;
                        reject_send_obj.handler = this.transdetail_obj.handler;
                        reject_send_obj.trans_type = this.navParams.data.trans_name;
                        reject_send_obj.gui_current_level = this.navParams.data.level;
                        console.log(reject_send_obj);
                        return [4 /*yield*/, this.restProvider.post("/approval/rejectTransaction", reject_send_obj).then(function (result) {
                                console.log(result);
                                var responce = {};
                                responce = result;
                                var messageshow = responce.ErrorCode;
                                if (messageshow.includes("Payment rejected successfully.")) {
                                    var update_send_obj = {};
                                    update_send_obj.tranObject = _this.transObject;
                                    update_send_obj.trans_type = _this.navParams.data.trans_name;
                                    update_send_obj.user_id = _this.restProvider.USER_ID;
                                    update_send_obj.trans_id = _this.transdetail_obj.trans_id;
                                    var chqData_vec = [];
                                    if (_this.chqData.length > 0) {
                                        chqData_vec.push(_this.chqData);
                                    }
                                    else {
                                        chqData_vec.push("noData");
                                    }
                                    _this.restProvider.post("/approval/updateRejectPayStatus/" + [chqData_vec], update_send_obj).then(function (result11) {
                                        if (result11 == true) {
                                            var toast = _this.toastCtrl.create({
                                                message: messageshow,
                                                duration: 2500,
                                                position: 'bottom'
                                            });
                                            toast.present(toast);
                                            load.dismiss();
                                            _this.viewCtrl.dismiss();
                                            console.log("updateRejectPayStatus updated");
                                        }
                                    });
                                }
                                else {
                                    var toast = _this.toastCtrl.create({
                                        message: messageshow,
                                        duration: 2500,
                                        position: 'bottom'
                                    });
                                    toast.present(toast);
                                    load.dismiss();
                                    _this.viewCtrl.dismiss();
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("cannot reject");
                        toast = this.toastCtrl.create({ message: message, duration: 2500, position: 'bottom' });
                        toast.present(toast);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        ViewChild('numbertowords'),
        __metadata("design:type", Object)
    ], AdvpaymentPage.prototype, "numbertowords", void 0);
    AdvpaymentPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-advpayment',
            templateUrl: 'advpayment.html',
        }),
        __metadata("design:paramtypes", [ActionSheetController, FileTransfer, DocumentViewer, Platform, File, FileOpener, NavController, AlertController, NavParams, ViewController, LoadingController, RestProvider, ToastController])
    ], AdvpaymentPage);
    return AdvpaymentPage;
}());
export { AdvpaymentPage };
//# sourceMappingURL=advpayment.js.map