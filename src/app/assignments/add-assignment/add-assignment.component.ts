import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MatiereService } from 'src/app/shared/matiere.service';
import { Assignment } from '../assignment.model';
import { DataService } from 'src/app/shared/data.service';
import { Matiere } from '../matiere.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
   allMatiere: Matiere[] ;
  //= [
  //   {designation: 'steak-0', image: 'Steak',prof:'jean'},
  //   {designation: 'steak-0', image: 'Steak',prof:'jean'},
  //   {designation: 'steak-0', image: 'Steak',prof:'jean'}
  // ];
  // Pour les champs du formulaire
  nom = '';
  nomDevoir = '';
  dateDeRendu = null;
  note = null;
  remarque = '';
  nomUser= '';
  roleUser= '';
  matieres='';
  saryProf='';
  saryMatiere='';
  divImage= false;
  nomProf='';
  constructor(private assignmentsService:AssignmentsService,
              private matiereService:MatiereService,
              private dataService:DataService,
              private _snackBar: MatSnackBar,
              private router:Router) {}

  ngOnInit(): void {
    this.dataService.userInfo.subscribe(data =>{
      this.nomUser = data.nomUser,
      this.roleUser= data.roleUser
    })
    let m = new Matiere;
    this.matiereService.allMatiere(m).subscribe(data=>{
      this.allMatiere=data
    })
  }
  setImage(imgMatiere,imgProf,nomProf,matiere){
    this.saryProf=imgProf;
    this.saryMatiere=imgMatiere;
    this.nomProf=nomProf;
    this.matieres=matiere;
    this.divImage=true;
  }
  onSubmit(event) {
    if((!this.nomDevoir) || (!this.dateDeRendu)) return;

    let nouvelAssignment = new Assignment();
    nouvelAssignment.nom = this.nomUser;
    nouvelAssignment.prof= this.nomProf;
    nouvelAssignment.imageProf= this.saryProf;
    nouvelAssignment.designation = this.nomDevoir;
    nouvelAssignment.matiere = this.matieres;
    nouvelAssignment.imageMatiere= this.saryMatiere;
    nouvelAssignment.dateDeRendu = this.dateDeRendu;
    nouvelAssignment.note = this.note;
    nouvelAssignment.remarque = this.remarque;
    nouvelAssignment.rendu = false;

    this.assignmentsService.addAssignment(nouvelAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
        this._snackBar.open("Ajout devoir effectuée", "Info", {
          duration: 2000,
        });
         // et on navigue vers la page d'accueil qui affiche la liste
         this.router.navigate(["/home"]);
      });
  }

}
