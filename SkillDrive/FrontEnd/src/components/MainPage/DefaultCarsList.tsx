import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchDefaultCars } from "../../Actions/carSearchAction";
import { IState } from '../../Interfaces/IState';
import CarThumbnail from '../CarThumbnail/CarThumbnail';
import "./DefaultCarsList.scss";

export default function DefaultCarsList() {
  const dispatch = useDispatch();
  const defaultCarsList = useSelector((state: IState) => state.cars.fetchedCars);

  useEffect(() => {
    dispatch(fetchDefaultCars());
  }, [])

  return (
    <div className='default-cars-list__wrapper'>
      <h2 className='default-cars-list__title'>Рекомендуем поблизости</h2>
      <div className='default-cars-list__variants'>
        {defaultCarsList.map((item) => {
          return (
            <CarThumbnail
              car={item}
              key={item.carId}
            />
          )
        })}
      </div>
    </div>
  )
}
