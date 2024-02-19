import {AfterViewInit, Component} from '@angular/core';
import {Flight} from "../model/flight";
import {SelectionModel} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {FlightFacadeService} from "../service/flight.facade";
import {Router} from "@angular/router";

@Component({
    selector: 'app-flight-list-view',
    templateUrl: './flight-list-view.component.html',
    styleUrl: './flight-list-view.component.css',
})
export class FlightListViewComponent implements AfterViewInit {
  isLoading = false;
  flightList$: BehaviorSubject<Flight[]>;
  dataSource: MatTableDataSource<Flight> = new MatTableDataSource<Flight>([]);
  selection = new SelectionModel<Flight>(false, []);
  displayedColumns: string[] = [
        'select',
        'name',
        'airline',
        'class',
        'seatNumber',
        'departureDate',
        'arrivalDate',
        'nonStop',
        'details'
    ];

  constructor(private flightFacadeService: FlightFacadeService) {
      this.flightList$ = flightFacadeService.getFlightList();
      this.flightList$.subscribe(flights => {
          this.dataSource.data = flights;
      });
  }

  ngAfterViewInit(): void {
    this.getAllFlights();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Flight): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  removeFlight(): void {
    const flight = this.selection.selected[0];

    if (flight) {
      this.flightFacadeService.deleteFlight(flight.id);
        this.selection.clear();
        this.getAllFlights();
    }
  }

  getAllFlights(): void {
      this.flightFacadeService.getFlights();
  }

  getFlight(id: string): void {
      this.flightFacadeService.getFlight(id);
  }
}
