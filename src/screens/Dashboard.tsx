
import './../App.css'
import { useState, useEffect } from 'react';
import { House } from '@phosphor-icons/react';
import MapGL, { type Driver as MapDriver } from './../components/map'
import TopHeader from './../components/TopHeader'
import DetailPanel, { type DetailPanelEntity } from './../components/DetailPanel'
import { getMockDriverForBus } from '../mockData/index';
import { setPrefillVehicle, triggerBookingForm, triggerExpenseForm } from '../lib/prefill';
// import ErrorBoundary from './components/ErrorBoundary';
// import { useNavigate } from 'react-router-dom';
import { useShuttleSocket } from '../../hooks/useShuttleSocket';

interface DropPoint {
  name: string;
  latitude: number;
  longitude: number;
}

interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  dropPoints: DropPoint[]; 
}


export interface Driver  {
  busID: string; 
  active: boolean; 
  busRoute: Route[];
  coords : Coordinates
}

interface Coordinates {
  latitude: number;
  longitude: number;
  speed?: number;        
  timestamp?: number;    
  heading?: number; 
}

interface Route {
  geometry: GeoJSON.Geometry; 
  distance: number;
  duration: number;
  start: Coordinates;
  end: Coordinates;
  stops: string[];
}


function App() {

    // const navigate = useNavigate();

      const locations: Location[]  = [
            { id: '1', name: 'Main Library', description: 'On Campus', latitude: 6.675033566213408, longitude: -1.5723546778455368,
                
            dropPoints: [ 
                { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
                { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.5675650457295751 },
                { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
                { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
                { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
            ]
            },
            { id: '2', name: 'Brunei', description: 'Hub for student activities', latitude: 6.670465091472612, longitude: -1.5741574445526254, 
            dropPoints: [ 
                { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
                { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
                { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
                { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
                { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 }
            ] 
            },
            { id: '3', name: 'Commercial Area', description: 'On Campus', latitude: 6.682751297721754, longitude: -1.5769726260262382,
            dropPoints: [ 
                { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
                { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.5675650457295751 },
                { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
                { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
                { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
                { name: 'Commerical Area', latitude: 6.682751297721754, longitude: -1.5769726260262382, },
            ]
            },

            { id: '4', name: 'Hall 7', description: 'Hub for student activities', latitude: 6.679295619563862, longitude: -1.572807677030472,
            dropPoints: [ 
                { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
                { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
                // { name: 'Commercial Area', latitude: 6.682751297721754, longitude: -1.5769726260262382, },
                { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
                { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308 }
                
            ]
            },
            { id: '5', name: 'Gaza', description: 'Off Campus', latitude: 6.686603046574587, longitude: -1.556854180379707, 
            dropPoints: [ 
                { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 },
                { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 },
                { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
                // 6.686603046574587, -1.5565200861528035
            ]
            },
            { id: '6', name: 'Medical Village', description: 'Hub for student activities', latitude: 6.6800787890749245, longitude: -1.549747261104641,   
            dropPoints: [ 
                { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
                { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 },
                { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 }
            ] 
            },
            { id: '7', name: 'Pharmacy Busstop', description: 'On Campus', latitude: 6.67480379472123, longitude: -1.5663873751176354,
            dropPoints: [ 
                { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 },
                { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
                { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 }
            ] 
            },
            { id: '8', name: 'Pentecost Busstop', description: 'On Campus', latitude: 6.674545299373284, longitude: -1.5675650457295751,
            dropPoints: [ 
                { name: 'Commercial Area', latitude: 6.682751297721754, longitude: -1.5769726260262382, },
                { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
            
                { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
                { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
                { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
                { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
                { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308 }

            ] 
            },
            { id: '9', name: 'SRC Busstop', description: 'On Campus', latitude: 6.675223889340042, longitude: -1.5678831412482812, 
            dropPoints: [ 
                { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
                { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
                { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
                { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
                { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
            ] 
            },
            { id: '10', name: 'KSB', description: 'Hub for student activities', latitude: 6.669314250173885, longitude: -1.567181795001016,
            dropPoints: [ 
                { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
                { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
                { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
                { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
                { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
                { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
                { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
                { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
                { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308 }
            ] 
            },
            { id: '11', name: 'Conti Busstop', description: 'Hub for student activities', latitude: 6.679644223364716, longitude: -1.572967657880401, 
            dropPoints: [ 
                // { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
                { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
                { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 }
            ]
            },
        ];



    const BASE_CUSTOMER_URL = "https://shuttle-backend-0.onrender.com/api/v1"

    const [searchQuery] = useState('');
    const [, setFilteredLocations] = useState<Location[]>(locations);
    const [] = useState<Location | null>(null)
    const [pickUp] =  useState<Location | null>(null)
    const [dropOff] =  useState<Location | null>(null)
    const [isSelectingDropOff] = useState(false)
    const [] =  useState<Location | null>(null)
    const [, setInputFocused] = useState(false);
    const [] = useState<'busStops' | 'buses'>('busStops');
    const [, setShowLocationList] = useState(false);
    // const [dropPoints, setDropPoints] = useState<DropPoint[]>([]);
    const [] = useState('');
    const [] = useState('');
     const [busRoute, setBusRoute] = useState([])
     const [, setDrivers] = useState<Driver[]>([]);
     const [selectedMapBus, setSelectedMapBus] = useState<MapDriver | null>(null);


     const shuttles = useShuttleSocket();

     ////websocket connect
      useEffect(() => {
            if (Array.isArray(shuttles) && shuttles.length > 0) {
                const mappedDrivers: Driver[] = shuttles
                .map((shuttle: any) => {
                    const innerLocation = shuttle.location?.location || {};
                    
                    type BusRouteItem = { busID: string; busRoute: any[] };
                    
                    /// compared the IDs of the API to the Websocket
                    const matchedRoute = Array.isArray(busRoute)
                    ? (busRoute as BusRouteItem[]).find((route) => {
                        const shuttleId = shuttle.driverId || shuttle.shuttleId || shuttle.id;
                        if (!route.busID || !shuttleId) return false;
                        
                        return route.busID.replace(/\D/g, '') === shuttleId.replace(/\D/g, '');
                        })
                    : undefined;

                    let stops: any[] = [];
                    if (matchedRoute && 
                        Array.isArray(matchedRoute.busRoute) && 
                        matchedRoute.busRoute.length > 0 &&
                        Array.isArray(matchedRoute.busRoute[0].stops)) {
                    stops = matchedRoute.busRoute[0].stops;
                    }

                    return {
                    busID: shuttle.driverId || shuttle.shuttleId || shuttle.id || '',
                    active: shuttle.isActive ?? true,
                    busRoute: stops,
                    coords: {
                        latitude: innerLocation.latitude ?? 0,
                        longitude: innerLocation.longitude ?? 0,
                        speed: innerLocation.speed ?? 0,
                        heading: innerLocation.heading ?? 0,
                        timestamp: innerLocation.timestamp
                        ? new Date(innerLocation.timestamp).getTime()
                        : Date.now(),
                    },
                    };
                })
                .filter((driver) => {
                    return driver.coords.latitude !== 0 || driver.coords.longitude !== 0;
                })
                .reduce((unique: Driver[], driver) => {
                    const numericId = driver.busID.replace(/\D/g, '');
                    const existing = unique.find(d => d.busID.replace(/\D/g, '') === numericId);
                    
            if (!existing) {
            unique.push(driver);
            } else if (
            typeof driver.coords.timestamp === 'number' &&
            typeof existing.coords.timestamp === 'number' &&
            driver.coords.timestamp > existing.coords.timestamp
            ) {
            const index = unique.findIndex(d => d.busID.replace(/\D/g, '') === numericId);
            unique[index] = driver;
            }
                    
                    return unique;
                }, []);

                setDrivers(mappedDrivers);

            }
            }, [shuttles, busRoute]);

        useEffect(() => {
        // If both pickup and dropOff selected → show tabs
        if (pickUp && dropOff) {
            setShowLocationList(false);   // hide location list
            setInputFocused(false);       // close input dropdown
        }
        }, [pickUp, dropOff]);

        /// fetch from API
         useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${BASE_CUSTOMER_URL}/drivers/drivers`);

        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }
        
        const data = await response.json();
        console.log('data', data.drivers)
        setDrivers(data.drivers || [])
        // Store an array of { busID, busRoute } for each driver
        if (Array.isArray(data.drivers)) {
          const busRoutes = data.drivers.map((driver: any) => ({
            busID: driver.busID,
            busRoute: driver.busRoute,
          }));
          setBusRoute(busRoutes);
          console.log('data', data)
          // console.log('selected Routes', busRoute)
        }


      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };

    fetchDrivers();
  }, []);


    // Add this custom hook for handling click outside


        // location component










          // Filter locations based on search query
        useEffect(() => {
            if (searchQuery === '') {
            // If no search query, show all locations or filtered drop points
            if (isSelectingDropOff && pickUp) {
                // Show only valid drop-off points from pick-up location
                const validDropOffPoints = locations.filter((location) =>
                pickUp.dropPoints.some(dp => dp.name === location.name)
                );
                setFilteredLocations(validDropOffPoints);
            } else {
                setFilteredLocations(locations);
            }
            } else {
            // Filter based on search query
            if (isSelectingDropOff && pickUp) {
                // Filter drop-off points based on valid connections from pick-up
                const validDropOffPoints = locations.filter((location) =>
                location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                pickUp.dropPoints.some(dp => dp.name === location.name)
                );
                setFilteredLocations(validDropOffPoints);
            } else {
                // Filter all locations based on search query
                const filterData = locations.filter((location) =>
                location.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredLocations(filterData);
            }
            }
        }, [searchQuery, isSelectingDropOff, pickUp]);



            // Handle location selection
            // const handleLocationSelect = (location: Location) => {
            //     if (!isSelectingDropOff) {
            //     // Selecting pick-up point
            //     setpickUp(location);
            //     setSearchQuery(location.name);
            //     setIsSelectingDropOff(true);
            //     setInputFocused(false);
            //     console.log(pickUp)
                
            //     // Filter locations to only show valid drop points for this pick-up
            //     const validDropOffPoints = locations.filter((loc) =>
            //         location.dropPoints.some(dp => dp.name === loc.name)
            //     );
            //     setFilteredLocations(validDropOffPoints);
            //     } else {
            //     // Selecting drop-off point
            //     setDropOff(location);
            //     setSearchQuery(location.name);
            //     setIsSelectingDropOff(false);
            //     setInputFocused(false);
            //     }
            // };




  







        // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        //   const searchQuery = event.target.value;
        //   setSearchQuery(searchQuery);

        //   if (searchQuery === '') {
        //     setFilteredLocations(locations);
        //   } else if (isSelectingDropOff && pickUp) {
        //     const validDropOffPoints = locations.filter((location) =>
        //       location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        //       pickUpDetails?.dropPoints.some(dp => dp.name === location.name)
        //     );
        //     setFilteredLocations(validDropOffPoints);
        //   } else {
        //     const filterData = locations.filter((location) =>
        //       location.name.toLowerCase().includes(searchQuery.toLowerCase())
        //     );
        //     setFilteredLocations(filterData);
        //   }
        // };



          // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
          //   const searchQuery = event.target.value;
          //   setSearchQuery(searchQuery);

          //   if (searchQuery === '') {
          //     setFilteredLocations(locations);
          //   } else if (isSelectingDropOff && pickUp) {
          //     const validDropOffPoints = locations.filter((location) =>
          //       location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          //       pickUpDetails?.dropPoints.some(dp => dp.name === location.name)
          //     );
          //     setFilteredLocations(validDropOffPoints);
          //   } else {
          //     const filterData = locations.filter((location) =>
          //       location.name.toLowerCase().includes(searchQuery.toLowerCase())
          //     );
          //     setFilteredLocations(filterData);
          //   }
          // };

          


            // const handleLocationSelect = (locationId: string) => {
            //     // Find the selected location
            //     const location = locations.find(loc => loc.id === locationId);
            //     if (location) {
            //         setSelectedLocation(location);
            //         setDropPoints(location.dropPoints); // Filtered drop points
            //     } else {
            //         setSelectedLocation(null);
            //         setDropPoints([]);
            //     }
            //     };




  return (
    <>
      <main className='flex '>
          <section className='flex flex-col w-full '>
              <TopHeader icon={<House size={14} color="black" weight="duotone" />} title="Overview" />

              <main className='flex'>

                <section className='flex-1 min-w-0 h-[calc(100vh-56px)] overflow-hidden relative'>

                <MapGL
                //    locations={locations}
                  pickUp={pickUp}
                  // setPickUp={setPickUp}
                  dropOff={dropOff}
                  // setDropOff={setDropOff}
                  // isSelectingDropOff={isSelectingDropOff}
                  // setIsSelectingDropOff={setIsSelectingDropOff}
                   onSelectBus={(bus) => {
                     setSelectedMapBus(bus);
                     const mock = getMockDriverForBus(bus.busID);
                     setPrefillVehicle(mock?.plateNumber || null);
                   }}
                />

                {selectedMapBus && (() => {
                    const mockBus = getMockDriverForBus(selectedMapBus.busID);
                    const plateNo = mockBus?.plateNumber || selectedMapBus.busID || 'Unknown';
                    const driverName = selectedMapBus.driverName || selectedMapBus.fullName || mockBus?.driverName || 'Unknown Driver';
                    const speedKmh = Math.round((selectedMapBus.coords.speed ?? 0) * 3.6);
                    return (
                      <DetailPanel
                        entity={{
                          title: plateNo,
                          driverName,
                          driverId: mockBus?.driverID || '',
                          driverPhone: selectedMapBus.phoneNumber || mockBus?.phoneNumber,
                          status: selectedMapBus.active ? 'Active' : 'Inactive',
                          timeCheckIn: '07:01 AM',
                          lastUpdated: new Date(selectedMapBus.coords.timestamp ?? Date.now()).toLocaleTimeString(),
                          details: [
                            { label: 'Vehicle Number Plate', value: plateNo },
                            { label: 'Date Added', value: '25th Feb 2026' },
                            { label: 'Distance Covered', value: '420 km' },
                            { label: 'Speed', value: `${speedKmh} km/h` },
                          ],
                          ctaLabel: 'Book Vehicle',
                        } satisfies DetailPanelEntity}
                        onClose={() => setSelectedMapBus(null)}
                        variant="vehicle"
                        onBookVehicle={() => {
                          if (selectedMapBus) { setPrefillVehicle(selectedMapBus.busID); triggerBookingForm(); }
                        }}
                        onLogExpense={() => {
                          if (selectedMapBus) { setPrefillVehicle(selectedMapBus.busID); triggerExpenseForm(); }
                        }}
                      />
                    );
                  })()}

                </section>

              </main>
          </section>
      </main>
    </>
  )
}

export default App
