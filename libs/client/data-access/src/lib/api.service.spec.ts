import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import exp = require('constants');

import { Bike } from '@cpt/shared/domain';
import { createMockBike } from '@cpt/shared/util-testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a list of bike items', (done) => {
    const Bikes: Bike[] = Array.from({ length: 5 }).map(() => createMockBike());
    const httpSpy = jest.spyOn(http, 'get').mockReturnValue(of(Bikes));
    service.getAllBikeItems().subscribe({
      next: (val) => {
        expect(val).toStrictEqual(Bikes);
        expect(val.length).toEqual(Bikes.length);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });

  it('should get a single bike item', (done) => {
    const Bike = createMockBike();
    const httpSpy = jest.spyOn(http, 'get').mockReturnValue(of(Bike));
    service.getBikeById(Bike.id).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(Bike);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a single bike item', (done) => {
    const Bike = createMockBike();
    const httpSpy = jest.spyOn(http, 'post').mockReturnValue(of(Bike));
    service.createBike(Bike).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(Bike);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/bikes`, { ...Bike });
  });

  it('should update a single bike item', (done) => {
    const Bike = createMockBike();
    const httpSpy = jest.spyOn(http, 'patch').mockReturnValue(of(Bike));
    service.updateBike(Bike.id, Bike).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(Bike);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/bikes/${Bike.id}`, { ...Bike });
  });

  it('should update a single bike item', (done) => {
    const Bike = createMockBike();
    const httpSpy = jest.spyOn(http, 'put').mockReturnValue(of(Bike));
    service.createOrUpdateBike(Bike.id, Bike).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(Bike);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/bikes/${Bike.id}`, { ...Bike });
  });

  it('should delete a single bike item', (done) => {
    const Bike = createMockBike();
    const httpSpy = jest.spyOn(http, 'delete').mockReturnValue(of(null));
    service.deleteBike(Bike.id).subscribe({
      next: (val) => {
        expect(val).toBeNull();
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).lastCalledWith(`/api/v1/bikes/${Bike.id}`);
  });
});
