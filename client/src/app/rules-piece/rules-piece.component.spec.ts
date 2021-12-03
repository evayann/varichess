import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesPieceComponent } from './rules-piece.component';

describe('RulesPieceComponent', () => {
  let component: RulesPieceComponent;
  let fixture: ComponentFixture<RulesPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RulesPieceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
