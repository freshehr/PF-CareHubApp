import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx'
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

  myProfileDetails: any;
  profileForm: FormGroup;
  others: "Wait";
  templateID: any;
  consent: boolean = false;
 
  error_messages = {
    'myName': [
      { type: 'required', message: 'Your name is needed!.' }
    ],
    'myNHSno': [
      { type: 'required', message: 'Your NHS number is needed!.' },
      { type: 'pattern', message: 'Your NHS number must be 10 digits long!' }
    ],
    'myDoctor': [
      { type: 'required', message: 'Your doctor\'s name is needed!.' }
    ],
    'myDoctorsNumber': [
      { type: 'required', message: 'A number is needed!.' }
    ],
    'myBirthday': [
      { type: 'required', message: 'Please tell us your birthday :).' }
    ]
  }

  constructor(private storage: Storage, public network: Network, public alertController: AlertController, private api: ApiService, private router: Router, public formBuilder: FormBuilder, private database:DatabaseService,public platform:Platform) { 
    
    this.profileForm = this.formBuilder.group({
      myName: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myNHSno: new FormControl('',Validators.compose([
        Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required
      ])),
      myDoctor: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myDoctorsNumber: new FormControl('',Validators.compose([
        Validators.required
      ])),
      myBirthday: new FormControl('',Validators.compose([
        Validators.required
      ]))
    });

 
  }

  async noNetworkConnection() {
    const alert = await this.alertController.create({
      header: 'CONNECTION ERROR',
      message: 'You must be able to connect to the CDR in order to continue with onboarding. Please check your internet connection and restart the app.',
    });
    await alert.present();
  }


  ngOnInit() {

    this.storage.set("Connection", 1);
    console.log("consent flag",this.consent);
    this.storage.set("EHR", 0);
    console.log("EHR flag: 0");
    this.presentAlertConfirm()

  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Do you consent to the storage and usage of your data in your personal EHR to be used for medical and/or research purposes?',
      buttons: [
        {
          text: 'No',
          role: 'no',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Consent to EHR? No');
            this.presentAlertConfirmNo()
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Consent to EHR? Yes');
            this.consent = true
            console.log("consent flag",this.consent);
            this.storage.set("EHR", 1);
            console.log("EHR flag set to 1");
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirmNo() {
    const alert = await this.alertController.create({
      message: 'Are you sure? Please note that if you do not consent you will not be able to alter this decision in future.',
      buttons: [
        {
          text: 'No',
          role: 'no',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm no consent? No');
            this.presentAlertConfirm()
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm no consent? Yes');
            this.consent = false
            console.log("consent flag",this.consent)
          }
        }
      ]
    });

    await alert.present();
  }

  checkConnection(){

    console.log("Checking Connection flag....");
    if (this.consent == true){
        this.api.getTemplates()
        .then( () => {
          return this.continueCheck()
    })
    } else{
        this.continueCheck()
    }
  }

  continueCheck(){

    this.storage.get("Connection")
      .then((val) => {
        console.log("val pulled from storage: ",val);
        if (val == 0){
          this.noNetworkConnection()
        }
        else{
          console.log("did that work?");
          this.addToDB()
        }
    });
  
  }


  mydetails() {
    console.log('Name: ', this.profileForm.value.myName);
    console.log('NHS no: ', this.profileForm.value.myNHSno);
    console.log('Doctor: ', this.profileForm.value.myDoctor);
    console.log('Doctors #: ', this.profileForm.value.myDoctorsNumber);
    console.log('Birthday: ', this.profileForm.value.myBirthday);
    console.log('Other_meds: ', this.others)
  }

  addToDB() {

    var myProfileDetailsBetter = [
      this.profileForm.value.myName,
      this.profileForm.value.myNHSno,
      this.profileForm.value.myBirthday,
      this.profileForm.value.myDoctor,
      this.profileForm.value.myDoctorsNumber,
    ]

    this.database.insertData(myProfileDetailsBetter, "profile");
    console.log('Checker: ', myProfileDetailsBetter);

    var myDoc = {
      "doctor_name": this.profileForm.value.myDoctor,
    }
    this.database.insertData(myDoc, "profileDoc");

    if (this.consent == true){
      this.api.getEHRstatus(this.profileForm.value.myNHSno);
      this.router.navigateByUrl('/onboardtreatmentplan');
    }
    else {
      this.router.navigateByUrl('/onboardtreatmentplan');
    }
  

  } 
}
