import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxProjectComponent } from './ngx-project.component';

describe('NgxProjectComponent', () => {
  let component: NgxProjectComponent;
  let fixture: ComponentFixture<NgxProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
