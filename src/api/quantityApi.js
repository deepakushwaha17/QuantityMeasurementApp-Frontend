import axiosInstance from './axiosInstance';

const BASE = '/api/v1/quantities';

export const compareApi = (thisQ, thatQ) =>
  axiosInstance.post(`${BASE}/compare`, {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
  }).then(r => r.data);

export const convertApi = (thisQ, thatQ) =>
  axiosInstance.post(`${BASE}/convert`, {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
  }).then(r => r.data);

export const addApi = (thisQ, thatQ) =>
  axiosInstance.post(`${BASE}/add`, {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
  }).then(r => r.data);

export const addWithTargetApi = (thisQ, thatQ, targetQ) =>
  axiosInstance.post(`${BASE}/add-with-target-unit`, {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
    targetQuantityDTO: targetQ,
  }).then(r => r.data);

export const subtractApi = (thisQ, thatQ) =>
  axiosInstance.post(`${BASE}/subtract`, {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
  }).then(r => r.data);

export const subtractWithTargetApi = (thisQ, thatQ, targetQ) =>
  axiosInstance.post(`${BASE}/subtract-with-target-unit`, {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
    targetQuantityDTO: targetQ,
  }).then(r => r.data);

export const divideApi = (thisQ, thatQ) =>
  axiosInstance.post(`${BASE}/divide`, {
    thisQuantityDTO: thisQ,
    thatQuantityDTO: thatQ,
  }).then(r => r.data);
