import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Assignment } from '../assignment.model';

declare let $: any;

@Component({
  selector: 'app-list-assigment',
  templateUrl: './list-assigment.component.html',
  styleUrls: ['./list-assigment.component.css']
})
export class ListAssigmentComponent implements OnInit {


  done = [];
  assignment: Assignment;
  nom = '';
  matiere = '';
  auteur = '';
  dateRendu = null;
  remarque = null;

  assignmentsRendu = [];
  assignmentsNonRendu = [];
  assignments = [];
  rendu: string;
  note: number;
  page: number = 1;
  limit: number = 10;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;

  iddrag: number;


  @ViewChild('content') content: any;
  @ViewChild('scrollerNon') scrollerNon: CdkVirtualScrollViewport;
  @ViewChild('scrollerOui') scrollerOui: CdkVirtualScrollViewport;


  // on injecte le service de gestion des assignments
  constructor(private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone) { }

  ngOnInit() {
    //console.log('AVANT AFFICHAGE');
    // on regarde s'il y a page= et limit = dans l'URL

    this.getAssignmentsRenduOui()
    this.getAssignmentsRenduNon()
  }

  updatenote(event) {
    // on va modifier l'assignment
    console.log(this.assignment)
    this.assignment.nom = this.nom;
    this.assignment.dateDeRendu = this.dateRendu;
    this.assignment.note = this.note
    this.assignment.remarque = this.remarque
    this.assignment.matiere = this.matiere
    this.assignment.rendu = true;

    this.assignmentsService.updateAssignment(this.assignment)
      .subscribe(message => {
        console.log("drag et rendu");

        // et on navigue vers la page d'accueil
        window.location.reload();

      })
  }

  closemodal() {
    this.assignmentsNonRendu.push(this.done[0])
    this.done = []
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log("Manao drag")
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      let id = JSON.stringify(event.container.data[event.currentIndex]["id"]).replace(/['"]+/g, '')
      $(this.content.nativeElement).modal('show');
      console.log("IIIIDDDD : " + id)
      this.iddrag = parseInt(id);
      this.getAssignmentById();
    }
  }


  getAssignmentById() {
    // les params sont des string, on va forcer la conversion
    // en number en mettant un "+" devant
    const id: number = +this.iddrag;

    console.log('Dans ngOnInit de details, id = ' + id);
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {

      this.assignment = assignment;

      this.nom = assignment.nom;
      this.dateRendu = assignment.dateDeRendu;
      this.note = assignment.note;
      this.remarque = assignment.remarque;
      this.matiere = assignment.matiere;

    });
  }

  getAssignments() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(data => {
        this.assignments = data.docs;
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log("données reçues");
      });
  }

  getAssignmentsRenduOui() {
    this.assignmentsService.getAssignmentsRenduOui("true", this.page, this.limit)
      .subscribe(data => {
        this.assignmentsRendu = this.assignmentsRendu.concat(data.docs);
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log("données reçues");
      });
  }

  getAssignmentsRenduNon() {
    this.assignmentsService.getAssignmentsRenduNon("false", this.page, this.limit)
      .subscribe(data => {
        this.assignmentsNonRendu = this.assignmentsNonRendu.concat(data.docs);
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log("données reçues");
      });
  }

  getAssignmentsScrolling() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(data => {
        this.assignments = this.assignments.concat(data.docs);
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log("données reçues");
      });
  }


  ngAfterViewInit() {
    // Appeler automatiquement apres l'affichage

    // ecouter zavatra
    this.scrollerOui
      .elementScrolled()
      .pipe(
        map(event => {
          return this.scrollerOui.measureScrollOffset('bottom');
        }),
        pairwise(),
        filter(([y1, y2]) => (y2 < y1 && y2 < 80)),
        throttleTime(200)
      )
      .subscribe(dist => {

        this.ngZone.run(() => {
          if (this.hasNextPage) {
            this.page = this.nextPage
            this.getAssignmentsRenduOui();
          }
        });


      });


    this.scrollerNon
      .elementScrolled()
      .pipe(
        map(event => {
          return this.scrollerNon.measureScrollOffset('bottom');
        }),
        pairwise(),
        filter(([y1, y2]) => (y2 < y1 && y2 < 80)),
        throttleTime(200)
      )
      .subscribe(dist => {

        this.ngZone.run(() => {
          if (this.hasNextPage) {
            this.page = this.nextPage
            this.getAssignmentsRenduNon();
          }
        });


      });

  }

  onDeleteAssignment(event) {
    console.log("Tonga delete le zavatra " + event);
    // event = l'assignment à supprimer

    //this.assignments.splice(index, 1);
    this.assignmentsService.deleteAssignment(event)
      .subscribe(message => {
        console.log(message);
      })
  }

  premierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: 1,
        limit: this.limit,
      }
    });
  }

  pageSuivante() {
    /*
    this.page = this.nextPage;
    this.getAssignments();*/
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.nextPage,
        limit: this.limit,
      }
    });
  }


  pagePrecedente() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.prevPage,
        limit: this.limit,
      }
    });
  }

  dernierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.totalPages,
        limit: this.limit,
      }
    });
  }


}