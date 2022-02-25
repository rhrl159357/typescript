import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useIntersectionObserver from './hooks/useIntersectionObserver';

interface Airline{
  id: number;
  name: string;
  country: string;
  logo: string;
  slogan: String;
  head_quaters: String;
  website: string;
  setablished: string;

}

interface Passenger {
  _id: string;
  name: string;
  trips: number;
  airline: Airline;
  __v:number;
}

interface Props{
  isLastItem: boolean;
  onFetchMorePassengers: () => void;
}

const Passenger: React.FC<Props> = ({isLastItem, onFetchMorePassengers, children}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref,{});
  const isIntersecting = !!entry?.isIntersecting;

  useEffect(() =>{
    isLastItem && isIntersecting && onFetchMorePassengers();
  },[isLastItem, isIntersecting])

  return (
    <div
    ref={ref}
      style={{
        minHeight:'100vh',
        display: 'flex',
        border: '1px dashed #000'
      }}
    >
      {children}
    </div>
  )
}

function App() {
  const [passengers, setPassengers] = useState<Array<Passenger>>([]);
  const [isLast, setIsLast] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const getPassengers = async () => {
    

    const params = {size: 10, page}
    try {
      const res = await axios.get('https://api.instantwebtools.net/v1/passenger', {params})

      const passengers = res.data.data;
      const isLast = res.data.totalPages === page;

      setPassengers(prev => [...prev, ...passengers]);
      setIsLast(isLast);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect (() => {
    !isLast && getPassengers();
  },[page])

  return (
    <div>
      {
        passengers.map((passenger, idx) => (
          <Passenger key={passenger._id}
          isLastItem={passengers.length -1 === idx}
          onFetchMorePassengers={() => setPage(prev => prev+1) }
        >
          {passenger.name}
        </Passenger>
        ))
      }
    </div>
  );
}

export default App;
