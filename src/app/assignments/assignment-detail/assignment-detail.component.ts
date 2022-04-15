import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Assignment } from '../assignment.model';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})

export class AssignmentDetailComponent implements OnInit {
  @ViewChild('stepper') stepper;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  note:FormControl;
  roleUser= '';

  changeStep(index: number) {
    this.stepper.selectedIndex = index;
  }
  // passé sous forme d'attribut HTML
  assignmentTransmis: Assignment;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private dataService:DataService,
    private authService:AuthService
  ) {}
  isProf(){
    if(this.roleUser=='Prof'){
      return true;
    }
  }
  ngOnInit(): void {
    this.dataService.userInfo.subscribe(data =>{
      this.roleUser= data.roleUser
    })
    this.getAssignmentById();
    this.firstFormGroup = this._formBuilder.group({    
      commentaire:[''] 
    });
    this.secondFormGroup = this._formBuilder.group({
      note: ['', [Validators.required,Validators.max(20),Validators.min(0)]]
    });
  }
  showstepper(){
    if(document.getElementById('stepper').hidden){
      document.getElementById('stepper').hidden=false;
    }else{
      document.getElementById('stepper').hidden=true;
    }
  }

  getAssignmentById() {
    // les params sont des string, on va forcer la conversion
    // en number en mettant un "+" devant
    const id: number = +this.route.snapshot.params.id;
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment;
    });
  }
  onAssignmentRendu() {
    this.assignmentTransmis.rendu = true;
    this.assignmentsService
      .updateAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {
        console.log(reponse.message);
        // et on navigue vers la page d'accueil qui affiche la liste
        this.router.navigate(['/home']);
      });

    //this.assignmentTransmis = null;
  }

  onDelete() {

    this.assignmentsService
      .deleteAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {

        

        console.log(reponse.message);

        // on cache l'affichage du détail
        this.assignmentTransmis = null;

        // et on navigue vers la page d'accueil qui affiche la liste
        this.router.navigate(['/home']);
      });
  }

  /*
  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis.id, 'edit'], {
      queryParams: {
        nom:'Michel Buffa',
        metier:"Professeur",
        responsable:"MIAGE"
      },
      fragment:"edition"
    });
  }
  */

  onClickEdit(event) {
    console.log("On edition", event)
    console.log("On edition", this.assignmentTransmis.id)
    this.router.navigate(['/assignment', this.assignmentTransmis.id, 'edit']);
  }

  /*
  isAdmin() {
    return this.authService.admin;
  }
  */
}
