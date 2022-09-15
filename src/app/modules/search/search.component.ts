import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { distinctUntilChanged, debounceTime, first, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']

})
export class SearchComponent implements OnInit {

    // Компонент работает только с параметром маршрута
    // Берем из поля актуальное значение и передаем в маршрут

    currentInputValue = null;
  faSearch = faSearch;
    @ViewChild('searchInput', { static: true })
    inputValue: NgModel;

    constructor(private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.pipe(
            filter(q => !!q.search),
            first()
        ).subscribe(params => {
            this.currentInputValue = params.search;
        })

        this.inputValue.update.pipe(
            distinctUntilChanged(),
            debounceTime(200),
        ).subscribe(a => {
            this.router.navigate([], { queryParams: { search: a } });
        });
    }

}
