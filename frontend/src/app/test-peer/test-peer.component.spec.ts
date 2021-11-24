import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPeerComponent } from './test-peer.component';

describe('TestPeerComponent', () => {
  let component: TestPeerComponent;
  let fixture: ComponentFixture<TestPeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPeerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
