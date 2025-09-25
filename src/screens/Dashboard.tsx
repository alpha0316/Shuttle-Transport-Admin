
import './../App.css'
import { useState, useEffect, useRef, useMemo } from 'react';
import MapGL from './../components/map'
// import ErrorBoundary from './components/ErrorBoundary';
// import { useNavigate } from 'react-router-dom';

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

interface LocationListProps {
  searchQuery: string;
  selectedLocation: Location | null;
  locations: Location[];
  isSelectingDropOff: boolean;
  handleDropOffPointClick: (location: Location) => void;
  handleStartPointClick: (location: Location) => void;
  isMobile: boolean;
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

    const busStops = [
        {
            id: 1,
            name: "Brunei",
            color: "bg-green-600/30",
            dotColor: "bg-green-600",
            waiting: "10+ waiting",
        },
        {
            id: 2,
            name: "Main Library",
            color: "bg-amber-50",
            dotColor: "bg-amber-400",
            waiting: "5 waiting",
        },
        {
            id: 3,
            name: "Casley Hayford",
            color: "bg-amber-50",
            dotColor: "bg-amber-400",
            waiting: "20+ waiting",
        },
        {
            id: 4,
            name: "Pentecost Bus Stop",
            color: "bg-red-500/10",
            dotColor: "bg-red-500",
            waiting: "10+ waiting",
        },
        {
            id: 5,
            name: "KSB",
            color: "bg-green-600/30",
            dotColor: "bg-green-600",
            waiting: "10+ waiting",
        },
        {
            id: 6,
            name: "Hall 7",
            color: "bg-green-600/30",
            dotColor: "bg-green-600",
            waiting: "10+ waiting",
        },
            {
            id: 7,
            name: "Brunei",
            color: "bg-green-600/30",
            dotColor: "bg-green-600",
            waiting: "10+ waiting",
        },
            {
            id: 8,
            name: "Commercial Area",
            color: "bg-green-600/30",
            dotColor: "bg-green-600",
            waiting: "10+ waiting",
        },
            {
            id: 9,
            name: "Conti Bus stop",
            color: "bg-green-600/30",
            dotColor: "bg-green-600",
            waiting: "10+ waiting",
        },
            {
            id: 10,
            name: "Gaza",
            color: "bg-green-600/30",
            dotColor: "bg-green-600",
            waiting: "10+ waiting",
        },
        ];



    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
    const [pickUp, setpickUp] =  useState<Location | null>(null)
    const [dropOff, setDropOff] =  useState<Location | null>(null)
    const [isSelectingDropOff, setIsSelectingDropOff] = useState(false)
    const [pickUpDetails, setpickUpDetail] =  useState<Location | null>(null)
    const [inputFocused, setInputFocused] = useState(false);
    const [activeTab, setActiveTab] = useState<'busStops' | 'buses'>('busStops');
    const [showLocationList, setShowLocationList] = useState(false);
    // const [dropPoints, setDropPoints] = useState<DropPoint[]>([]);



    


    const [pickupInputValue, setPickupInputValue] = useState('');
    const [dropoffInputValue, setDropoffInputValue] = useState('');


        

        useEffect(() => {
        // If both pickup and dropOff selected → show tabs
        if (pickUp && dropOff) {
            setShowLocationList(false);   // hide location list
            setInputFocused(false);       // close input dropdown
        }
        }, [pickUp, dropOff]);


    // Add this custom hook for handling click outside
        function useClickOutside(ref: unknown, callback: unknown) {
        useEffect(() => {
            function handleClickOutside(event: { target: any; }) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
            }
            
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, callback]);
        }


        // location component
        const LocationList: React.FC<LocationListProps> = ({  
                selectedLocation,
                locations,
                isSelectingDropOff,
                handleDropOffPointClick,
                handleStartPointClick,
                searchQuery,
                // onSelectLocation,
                }) => {

                const [, setIsVisible] = useState(true);
                const wrapperRef = useRef(null);

                useClickOutside(wrapperRef, () => setIsVisible(false));

                // inside LocationList, make this accessible via props
                useEffect(() => {
                if (inputFocused) {
                    setIsVisible(true);
                }
                }, [inputFocused]);


            
                const baseList = isSelectingDropOff
                ? selectedLocation?.dropPoints ?? []   // safe default
                : locations ?? []

                    // if no search query, show full list immediately
                    const filteredLocations = searchQuery.trim() === ''
                    ? baseList
                    : baseList.filter((location) =>
                        location.name.toLowerCase().includes(searchQuery.toLowerCase())
                        );


                // Handles click events automatically
                const handleLocationClick = (location: DropPoint) => {
                    if (isSelectingDropOff) {
                    handleDropOffPointClick(location);
                    } else {
                    handleStartPointClick(location);
                    }
                    onSelectLocation?.();
                };

                // if (!isVisible) return null;

                return (
                    <div
                    ref={wrapperRef}
                    className="rounded-lg flex flex-col p-3 gap-3 overflow-y-auto max-h-[80vh] md:max-h-[calc(95vh-220px)] w-[360px]"
                    >
                {filteredLocations.length === 0 && searchQuery.trim() !== '' ? (
                    <p>No Bus stop found. Select closest bus stop</p>
                    ) : (
                        filteredLocations.map((location) => (
                        <div
                            key={location.id}
                            style={{
                            borderRadius: 16,
                            border:
                                selectedLocation?.id === location.id
                                ? '1px solid rgba(0,0,0,0.5)'
                                : '1px solid rgba(0,0,0,0.1)',
                            display: 'flex',
                            padding: 12,
                            alignItems: 'center',
                            gap: 16,
                            width: '100%',
                            justifyContent: 'flex-start',
                            cursor: 'pointer',
                            backgroundColor:
                                selectedLocation?.id === location.id ? '#F0F8FF' : '#f4f4f4f',
                            transition: 'bottom 0.3s ease-in-out',
                            }}
                            onClick={() => handleLocationClick(location)}
                        >
                            {/* svg icon omitted for brevity */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <p style={{ fontSize: 14, margin: 0, textAlign: 'left' }}>
                                {location.name}
                            </p>
                            <p
                                style={{
                                fontSize: 12,
                                margin: 0,
                                color: 'rgba(0,0,0,0.6)',
                                textAlign: 'left',
                                }}
                            >
                                {location.description}
                            </p>
                            </div>
                        </div>
                        ))
                    )}
                    </div>
                );
                };


         const filteredBusStops = useMemo(() => {
            // Collect all drop point names from the pickup location
            const dropPointNames = pickUp?.dropPoints?.map((dp) => dp.name) || [];

            // If both pickUp & dropOff selected → show pickUp, dropPoints, dropOff
            if (pickUp && dropOff) {
                return [
                // The pickup stop
                // ...busStops.filter((stop) => stop.name === pickUp.name),

                // Any bus stops that match the drop points of pickup
                ...busStops.filter((stop) => dropPointNames.includes(stop.name)),

                // The dropOff stop
                // ...busStops.filter((stop) => stop.name === dropOff.name),
                ];
            }

            // If only pickUp selected → show pickUp + its drop points + others
            if (pickUp) {
                return [
                ...busStops.filter((stop) => stop.name === pickUp.name),
                ...busStops.filter((stop) => dropPointNames.includes(stop.name)),
                ];
            }

            // If only dropOff selected → show it
            if (dropOff) {
                return [
                ...busStops.filter((stop) => stop.name === dropOff.name),
                ];
            }

            // else show everything
            return busStops;
            }, [pickUp, dropOff, busStops]);



            const BusStopCard = ({ name, color, dotColor, waiting }) => {
                return (
                    <>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                        <div className={`w-5 p-1.5 ${color} rounded-[50px] inline-flex justify-start items-center gap-2.5`}>
                            <div className={`w-2.5 h-2 relative ${dotColor} rounded-3xl`} />
                        </div>
                        <p className="text-black text-sm font-normal">{name}</p>
                        </div>

                        <div className="flex gap-2 items-center p-1 bg-neutral-50 rounded-xl">
                        <div className="flex">
                            <img src="../src/assets/memoji.png" alt="at" />
                            <img src="../src/assets/memoji2.png" alt="at" />
                            <img src="../src/assets/memoji3.png" alt="at" />
                        </div>
                        <p className="text-black/50 text-xs font-normal">{waiting}</p>
                        </div>
                    </div>

                    <div className="relative left-2 w-0 h-5 origin-top-left outline-1 outline-offset-[-0.50px] outline-black/10"></div>
                    </>
                );
                };





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

            const handleStartPointClick = (location: Location) => {
                console.log('Selected pickup:', location);

                setpickUp(location);
                setSelectedLocation(location);
                setpickUpDetail(location);
                setDropOff(null);

                // Update inputs
                setPickupInputValue(location.name);
                setDropoffInputValue('');

                // Switch mode: only allow drop-off selection from this location’s dropPoints
                setIsSelectingDropOff(true);
                setInputFocused(false); // close dropdown
            };


           const handleDropOffPointClick = (location: Location) => {
                console.log('Selected dropoff:', location);

                setSelectedLocation(location);
                setDropOff(location);
                setDropoffInputValue(location.name);

                // Done selecting, reset back to normal (show all again if needed)
                setIsSelectingDropOff(false);
                setInputFocused(false);
            };

  
            const handleSearch = (event: React.ChangeEvent<HTMLInputElement>, inputType: 'pickup' | 'dropoff') => {
                    const searchValue = event.target.value;
                    
                    if (inputType === 'pickup') {
                        setPickupInputValue(searchValue);
                        // Clear pickup selection if user is typing
                        if (pickUp && searchValue !== pickUp.name) {
                            setpickUp(null);
                            setpickUpDetail(null);
                            setIsSelectingDropOff(false);
                        }
                    } else {
                        setDropoffInputValue(searchValue);
                        // Clear dropoff selection if user is typing
                        if (dropOff && searchValue !== dropOff.name) {
                            setDropOff(null);
                        }
                    }

                    // Filter locations based on search
                    if (searchValue === '') {
                        if (isSelectingDropOff && pickUp) {
                            const validDropOffPoints = locations.filter((location) =>
                                pickUp.dropPoints.some(dp => dp.name === location.name)
                            );
                            setFilteredLocations(validDropOffPoints);
                        } else {
                            setFilteredLocations(locations);
                        }
                    } else {
                        if (isSelectingDropOff && pickUp) {
                            const validDropOffPoints = locations.filter((location) =>
                                location.name.toLowerCase().includes(searchValue.toLowerCase()) &&
                                pickUp.dropPoints.some(dp => dp.name === location.name)
                            );
                            setFilteredLocations(validDropOffPoints);
                        } else {
                            const filterData = locations.filter((location) =>
                                location.name.toLowerCase().includes(searchValue.toLowerCase())
                            );
                            setFilteredLocations(filterData);
                        }
                    }
                };


        const BusIcon = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="19" viewBox="0 0 56 19" fill="none">
                <g clip-path="url(#clip0_1507_7323)">
                    <path d="M38.6878 3.93983C38.6413 4.03586 38.5949 4.13189 38.5471 4.23083C33.1596 4.27885 27.7721 4.32687 22.2213 4.37634C22.2213 7.59342 22.2213 10.8105 22.2213 14.1251C22.5422 14.2909 22.7291 14.292 23.0858 14.2981C23.2061 14.3006 23.3263 14.303 23.4502 14.3055C23.5802 14.3075 23.7102 14.3095 23.8442 14.3115C23.9775 14.3142 24.1107 14.3169 24.248 14.3196C24.6749 14.3282 25.1018 14.3359 25.5287 14.3433C26.0902 14.3532 26.6517 14.3639 27.2132 14.3752C27.3432 14.3771 27.4732 14.3791 27.6072 14.3811C27.7275 14.3836 27.8477 14.386 27.9716 14.3885C28.0776 14.3903 28.1836 14.3922 28.2929 14.394C28.5546 14.4161 28.5546 14.4161 28.8361 14.5616C28.8361 14.6576 28.8361 14.7537 28.8361 14.8526C20.4762 14.8526 12.1163 14.8526 3.50304 14.8526C3.4566 14.6605 3.41016 14.4685 3.3623 14.2706C3.54808 14.2706 3.73386 14.2706 3.92526 14.2706C3.92526 11.2936 3.92526 8.31658 3.92526 5.24936C5.27213 5.24936 6.619 5.24936 8.00669 5.24936C8.00669 4.81721 8.00669 4.38507 8.00669 3.93983C11.9447 3.91745 15.8826 3.89591 19.8206 3.87538C21.649 3.86582 23.4774 3.85599 25.3057 3.84551C26.8989 3.83638 28.492 3.82777 30.0852 3.81978C30.9292 3.81553 31.7731 3.81102 32.6171 3.80589C33.4108 3.80107 34.2045 3.79694 34.9982 3.79335C35.2901 3.7919 35.582 3.79021 35.8739 3.78824C36.2713 3.7856 36.6687 3.78386 37.0661 3.78235C37.1826 3.78136 37.2991 3.78037 37.4191 3.77935C37.8795 3.77841 38.2477 3.78818 38.6878 3.93983Z" fill="#34A853"/>
                    <path d="M48.3909 3.87523C50.862 2.99391 50.7916 10.8104 50.7916 14.1249C51.1125 14.2908 50.0127 14.3878 50.3694 14.3939C50.4897 14.3963 50.1583 14.5615 52.0205 14.3054C50.1793 14.5586 49.9645 14.6938 52.0821 14.3639C51.482 14.4576 50.8855 14.5442 50.3694 14.6171C50.377 14.6172 50.3659 14.6187 50.3393 14.6213C50.0146 14.6671 49.7228 14.7073 49.4834 14.7403C49.6187 14.7371 49.7496 14.7338 49.8681 14.7305C49.894 14.7277 49.9203 14.7249 49.9472 14.722C49.9926 14.7172 50.0395 14.7121 50.0879 14.707C50.5148 14.7155 49.9425 14.6995 50.3694 14.707C50.4722 14.7088 50.3559 14.715 50.1303 14.7225C50.7938 14.7265 50.708 14.7532 50.5805 14.7815C50.4251 14.8159 50.2077 14.8525 51.2139 14.8525L48.7645 14.8525C48.3532 14.8639 48.1624 14.8624 48.1219 14.8525L32.0734 14.8525L31.9326 14.2704H32.4956V5.24922H36.577V3.93968C40.515 3.91731 44.3176 3.57593 48.3909 3.87523Z" fill="#34A853"/>
                    <path d="M23.0481 4.79512C23.2223 4.79532 23.2223 4.79532 23.4 4.79553C23.5328 4.79533 23.6656 4.79513 23.8025 4.79492C23.9493 4.79545 24.0962 4.79597 24.2476 4.79651C24.4013 4.79649 24.5551 4.79646 24.7135 4.79644C25.2245 4.79654 25.7355 4.79768 26.2465 4.79882C26.5997 4.79909 26.9529 4.79929 27.3061 4.79944C28.1425 4.79994 28.9788 4.80109 29.8152 4.80255C31.0274 4.80461 32.2396 4.80538 33.4517 4.8063C35.1503 4.80771 36.8488 4.8105 38.5474 4.81303C38.5474 7.83805 38.5474 10.8631 38.5474 13.9798C33.2992 13.9798 28.0511 13.9798 22.6439 13.9798C22.641 12.4943 22.6381 11.0087 22.6351 9.47823C22.6338 9.00859 22.6325 8.53894 22.6312 8.05506C22.6308 7.68542 22.6304 7.31577 22.6301 6.94613C22.6298 6.84948 22.6294 6.75283 22.629 6.65326C22.628 6.3699 22.6279 6.08653 22.6279 5.80317C22.6276 5.64323 22.6273 5.48329 22.627 5.31851C22.6503 4.82215 22.6503 4.82215 23.0481 4.79512Z" fill="#34A853"/>
                    <path d="M54.3104 2.77579C54.3164 3.01822 54.3161 3.26088 54.3104 3.50331C54.0656 3.75642 53.7202 3.70293 53.3868 3.73066C53.1732 3.74895 53.1732 3.74895 52.9552 3.7676C52.8451 3.77642 52.735 3.78523 52.6215 3.79432C52.6419 3.91192 52.6622 4.02952 52.6831 4.15069C52.7092 4.30618 52.7354 4.46167 52.7623 4.62187C52.7884 4.77548 52.8145 4.9291 52.8414 5.08737C52.8961 5.48929 52.9146 5.863 52.903 6.26788C53.0424 6.31589 53.1817 6.36391 53.3252 6.41338C53.4823 7.18458 53.5146 7.95589 53.466 8.74144C53.4195 8.78945 53.3731 8.83747 53.3252 8.88694C53.3018 9.3962 53.3018 9.3962 53.3252 9.90547C53.3717 9.95348 53.4181 10.0015 53.466 10.051C53.5274 10.9177 53.5227 11.7159 53.1845 12.5245C53.0916 12.5245 52.9987 12.5245 52.903 12.5245C52.9088 12.6716 52.9146 12.8186 52.9206 12.9701C52.9022 13.5694 52.7999 13.9968 52.6215 14.5616C52.8538 14.6096 53.086 14.6576 53.3252 14.7071C53.3252 14.8031 53.3252 14.8991 53.3252 14.9981C53.4617 14.9951 53.5981 14.9921 53.7387 14.989C54.1697 14.9981 54.1697 14.9981 54.3104 15.1436C54.3162 15.4345 54.3164 15.7257 54.3104 16.0166C53.6771 15.9963 53.0437 15.9747 52.4104 15.953C52.2319 15.9472 52.0534 15.9415 51.8695 15.9356C51.6953 15.9295 51.5211 15.9234 51.3417 15.9172C51.1825 15.9118 51.0233 15.9065 50.8593 15.901C50.3697 15.8711 50.3697 15.8711 49.8925 15.7976C49.058 15.6883 48.2219 15.7058 47.382 15.7075C47.1935 15.7073 47.0049 15.7071 46.8163 15.7069C46.4078 15.7064 45.9993 15.7064 45.5908 15.7068C44.926 15.7074 44.2612 15.707 43.5964 15.7065C42.7564 15.7059 41.9163 15.7055 41.0762 15.7055C39.4263 15.7055 37.7764 15.7037 36.1265 15.7012C35.8666 15.7008 35.6068 15.7005 35.3469 15.7001C34.953 15.6995 34.5592 15.6989 34.1654 15.6984C32.682 15.6962 31.1987 15.6942 29.7153 15.6924C29.5798 15.6923 29.4442 15.6921 29.3046 15.6919C27.1054 15.6894 24.9063 15.689 22.7071 15.6892C20.4489 15.6894 18.1907 15.6868 15.9325 15.6818C14.5397 15.6788 13.1469 15.678 11.754 15.6801C10.8003 15.6813 9.84658 15.6799 8.89286 15.6764C8.34235 15.6745 7.79189 15.6737 7.24137 15.6761C6.73759 15.6783 6.23392 15.6772 5.73014 15.6733C5.46124 15.6722 5.19233 15.6746 4.92343 15.6771C3.62183 15.6619 3.62183 15.6619 3.18503 15.2416C2.8629 14.7288 2.85229 14.3898 2.85185 13.7798C2.85034 13.6217 2.85034 13.6217 2.8488 13.4605C2.84643 13.1135 2.84915 12.7669 2.85216 12.4199C2.85204 12.1781 2.8517 11.9362 2.85113 11.6943C2.85073 11.1879 2.8528 10.6816 2.85666 10.1752C2.86146 9.52691 2.86061 8.87875 2.85798 8.23042C2.85649 7.73111 2.85775 7.23183 2.85986 6.73252C2.86059 6.49352 2.86052 6.25451 2.85964 6.0155C2.85887 5.68112 2.86175 5.34698 2.8656 5.01262C2.86647 4.82257 2.86734 4.63252 2.86824 4.4367C2.95967 3.80952 3.03053 3.62355 3.50363 3.2123C4.10126 3.09868 4.69602 3.11457 5.30212 3.12027C5.49067 3.11946 5.67923 3.11832 5.86778 3.1169C6.38641 3.1139 6.90496 3.11543 7.4236 3.11769C7.98274 3.11934 8.54186 3.11679 9.10099 3.11475C10.0701 3.11177 11.0391 3.11144 12.0082 3.11288C13.4103 3.11495 14.8123 3.11288 16.2144 3.10977C18.4903 3.10481 20.7661 3.103 23.042 3.10325C25.2509 3.10348 27.4598 3.10261 29.6687 3.09998C29.8727 3.09974 29.8727 3.09974 30.0808 3.09949C31.5655 3.0977 33.0501 3.09565 34.5348 3.09347C34.9286 3.0929 35.3224 3.09233 35.7162 3.09176C35.9758 3.09138 36.2354 3.091 36.495 3.09062C38.1471 3.08818 39.7993 3.0869 41.4514 3.08688C42.285 3.08685 43.1187 3.08634 43.9523 3.08568C44.6116 3.08519 45.2709 3.08531 45.9302 3.08589C46.3303 3.0861 46.7304 3.08571 47.1304 3.08514C47.4004 3.08493 47.6703 3.08545 47.9403 3.086C48.1009 3.08565 48.2616 3.0853 48.4271 3.08494C48.5655 3.08495 48.7038 3.08496 48.8463 3.08497C49.2697 3.06562 49.6714 2.99799 50.0882 2.92129C50.2935 2.91867 50.4989 2.92159 50.704 2.93039C51.4708 2.94247 52.2121 2.8385 52.9686 2.72098C53.4511 2.6501 53.8467 2.60003 54.3104 2.77579ZM36.4369 3.80156C32.2942 3.81781 28.1515 3.83776 24.0089 3.85912C22.2578 3.86814 20.5068 3.87683 18.7558 3.88551C15.173 3.90328 11.5901 3.92141 8.00728 3.93982C8.00728 4.37197 8.00728 4.80411 8.00728 5.24935C6.6604 5.24935 5.31353 5.24935 3.92585 5.24935C3.92585 8.22636 3.92585 11.2034 3.92585 14.2706C3.69363 14.2706 3.46141 14.2706 3.22215 14.2706C3.26859 14.5107 3.31504 14.7507 3.36289 14.9981C18.4571 14.9981 33.5514 14.9981 49.1031 14.9981C49.1031 14.9021 49.1031 14.806 49.1031 14.7071C49.1898 14.6934 49.2765 14.6797 49.3659 14.6656C49.6757 14.5894 49.6757 14.5894 49.8343 14.3439C50.5302 12.8413 50.5624 11.3177 50.5544 9.67812C50.5543 9.57525 50.5541 9.47239 50.5539 9.36641C50.6207 6.58896 50.6207 6.58896 49.666 4.08532C49.2062 3.77928 48.8357 3.75852 48.2952 3.76012C48.0454 3.75981 48.0454 3.75981 47.7905 3.75949C47.5146 3.7614 47.5146 3.7614 47.2332 3.76334C47.0349 3.76367 46.8365 3.76388 46.6382 3.76397C46.0883 3.76462 45.5384 3.76714 44.9885 3.76996C44.3904 3.77272 43.7924 3.77381 43.1943 3.77515C41.8453 3.77854 40.4964 3.78427 39.1474 3.79039C38.2439 3.79447 37.3404 3.79805 36.4369 3.80156Z" fill="#C4C4C3"/>
                    <path d="M24.7539 6.99512C28.5623 6.99512 32.3707 6.99512 36.2945 6.99512C36.2945 8.57965 36.2945 10.1642 36.2945 11.7967C32.4861 11.7967 28.6777 11.7967 24.7539 11.7967C24.7539 10.2122 24.7539 8.62767 24.7539 6.99512Z" fill="#34A853"/>
                    <path d="M51.4335 3.63041C51.5317 3.62984 51.6299 3.62928 51.7312 3.6287C52.4624 3.63017 52.4624 3.63017 52.6209 3.7941C52.6774 4.07164 52.7259 4.35091 52.7705 4.63074C52.7953 4.78304 52.8202 4.93534 52.8458 5.09226C52.8962 5.49124 52.9132 5.86612 52.9024 6.26766C53.0418 6.31567 53.1811 6.36369 53.3246 6.41316C53.4817 7.18436 53.514 7.95567 53.4654 8.74122C53.4189 8.78923 53.3725 8.83725 53.3246 8.88672C53.3012 9.39598 53.3012 9.39598 53.3246 9.90525C53.3943 9.97727 53.3943 9.97727 53.4654 10.0508C53.5268 10.9175 53.5221 11.7157 53.1839 12.5243C53.091 12.5243 52.9981 12.5243 52.9024 12.5243C52.9082 12.6714 52.914 12.8184 52.92 12.9699C52.9016 13.5691 52.7993 13.9966 52.6209 14.5614C52.8067 14.6094 52.9925 14.6574 53.1839 14.7069C53.1839 14.8029 53.1839 14.8989 53.1839 14.9979C52.6097 15.139 52.067 15.1674 51.4774 15.1707C51.22 15.1738 51.22 15.1738 50.9574 15.1769C50.5099 15.1434 50.5099 15.1434 50.0876 14.8524C50.1308 14.7342 50.174 14.616 50.2185 14.4943C51.1339 11.365 51.0866 6.89231 50.0876 3.7941C50.5169 3.57222 50.9632 3.6277 51.4335 3.63041Z" fill="#282828"/>
                    <path d="M22.2208 4.37638C24.4204 4.37299 26.62 4.37042 28.8196 4.36884C29.8408 4.36809 30.862 4.36707 31.8833 4.3654C32.7731 4.36396 33.6629 4.36301 34.5527 4.36269C35.0241 4.3625 35.4955 4.36205 35.9669 4.361C36.4924 4.35995 37.0178 4.35979 37.5432 4.35986C37.7006 4.35934 37.858 4.35882 38.0202 4.35828C38.1625 4.35848 38.3048 4.35868 38.4514 4.35888C38.6381 4.35868 38.6381 4.35868 38.8284 4.35848C39.1095 4.37638 39.1095 4.37638 39.2503 4.52188C39.2635 4.82543 39.2668 5.12945 39.2662 5.43331C39.2663 5.52841 39.2663 5.62352 39.2663 5.72151C39.2662 6.03722 39.2651 6.35292 39.264 6.66863C39.2637 6.88699 39.2635 7.10535 39.2634 7.32371C39.2629 7.89948 39.2615 8.47525 39.2599 9.05102C39.2585 9.63813 39.2578 10.2252 39.2571 10.8124C39.2556 11.9651 39.2532 13.1179 39.2503 14.2706C37.0323 14.274 34.8144 14.2766 32.5965 14.2782C31.5667 14.2789 30.537 14.2799 29.5072 14.2816C28.61 14.283 27.7128 14.284 26.8156 14.2843C26.3402 14.2845 25.8649 14.285 25.3895 14.286C24.8597 14.2871 24.3299 14.2872 23.8001 14.2871C23.6413 14.2877 23.4826 14.2882 23.3191 14.2887C23.1038 14.2884 23.1038 14.2884 22.8843 14.2881C22.7588 14.2883 22.6334 14.2884 22.5041 14.2885C22.2208 14.2706 22.2208 14.2706 22.0801 14.1251C22.0661 13.832 22.0621 13.5385 22.0619 13.245C22.0614 13.0566 22.061 12.8682 22.0605 12.6741C22.0608 12.4668 22.0611 12.2595 22.0614 12.0523C22.0613 11.8411 22.0612 11.63 22.061 11.4188C22.0608 10.9757 22.0611 10.5325 22.0618 10.0893C22.0626 9.52061 22.0621 8.95189 22.0613 8.38315C22.0607 7.9469 22.0609 7.51065 22.0613 7.0744C22.0614 6.86468 22.0612 6.65496 22.0609 6.44524C22.0606 6.15226 22.0612 5.85928 22.0619 5.56631C22.062 5.39937 22.0621 5.23244 22.0622 5.06046C22.0801 4.66739 22.0801 4.66739 22.2208 4.37638ZM22.6431 4.95839C22.6298 5.23966 22.6265 5.52143 22.6271 5.80303C22.6271 5.98617 22.6271 6.16931 22.6271 6.358C22.6278 6.554 22.6286 6.75 22.6293 6.946C22.6295 7.12319 22.6296 7.30038 22.6297 7.48295C22.6305 8.148 22.6324 8.81305 22.6343 9.4781C22.6372 10.9636 22.6401 12.4491 22.6431 13.9796C27.8912 13.9796 33.1394 13.9796 38.5466 13.9796C38.5466 10.9546 38.5466 7.92958 38.5466 4.81289C35.7484 4.80866 35.7484 4.80866 32.9503 4.80579C31.8098 4.80491 30.6694 4.8039 29.529 4.80191C28.6101 4.80031 27.6912 4.79946 26.7722 4.79909C26.4208 4.79882 26.0693 4.79829 25.7179 4.79751C25.2275 4.79646 24.7371 4.7963 24.2467 4.79637C24.0999 4.79585 23.953 4.79533 23.8016 4.79479C23.6688 4.79499 23.536 4.79519 23.3991 4.79539C23.283 4.79526 23.1669 4.79512 23.0473 4.79499C22.7818 4.78297 22.7818 4.78297 22.6431 4.95839Z" fill="#34A853" fill-opacity="0.6"/>
                    <path d="M4.2458 3.11816C4.34383 3.12028 4.44185 3.1224 4.54285 3.12459C4.64793 3.12396 4.75301 3.12334 4.86127 3.1227C5.21359 3.1215 5.56567 3.12551 5.91796 3.12948C6.1704 3.12969 6.42284 3.12957 6.67528 3.12916C7.36093 3.12895 8.04649 3.13323 8.73212 3.13831C9.44851 3.14285 10.1649 3.14328 10.8813 3.14415C12.2381 3.14641 13.5948 3.15238 14.9515 3.15968C16.4961 3.16781 18.0406 3.17181 19.5851 3.17546C22.7625 3.18307 25.9399 3.19587 29.1172 3.21207C29.1172 3.35612 29.1172 3.50017 29.1172 3.64858C28.9879 3.64818 28.8586 3.64778 28.7254 3.64736C25.581 3.63773 22.4367 3.6305 19.2924 3.62597C17.7718 3.62372 16.2513 3.62064 14.7307 3.61565C13.4056 3.61131 12.0806 3.60849 10.7555 3.60751C10.0536 3.60694 9.3518 3.6056 8.64997 3.60243C7.98968 3.59947 7.32941 3.59855 6.66911 3.59921C6.42651 3.59909 6.18391 3.59822 5.94131 3.59655C5.61052 3.59438 5.27983 3.5949 4.94904 3.59609C4.76378 3.59569 4.57852 3.59529 4.38765 3.59487C3.8976 3.65176 3.70121 3.7219 3.36199 4.08509C3.31554 4.22914 3.2691 4.37319 3.22125 4.52161C3.45347 4.52161 3.68568 4.52161 3.92494 4.52161C3.97139 4.32954 4.01783 4.13748 4.06568 3.93959C4.06568 4.32372 4.06568 4.70785 4.06568 5.10362C5.27322 5.10362 6.48076 5.10362 7.72489 5.10362C7.72489 4.71949 7.72489 4.33536 7.72489 3.93959C7.77134 3.93959 7.81778 3.93959 7.86563 3.93959C7.86563 4.37174 7.86563 4.80388 7.86563 5.24912C6.5652 5.24912 5.26478 5.24912 3.92494 5.24912C3.92494 8.17811 3.92494 11.1071 3.92494 14.1248C3.59983 14.1248 3.27473 14.1248 2.93977 14.1248C2.92672 12.8094 2.91672 11.494 2.9106 10.1786C2.90766 9.56771 2.90368 8.95691 2.8973 8.34608C2.89118 7.75644 2.88781 7.16683 2.88636 6.57715C2.88532 6.35235 2.88329 6.12756 2.88025 5.90278C2.87615 5.58752 2.8756 5.27244 2.87586 4.95716C2.87461 4.77783 2.87336 4.59851 2.87207 4.41375C2.99683 3.5399 3.37843 3.13207 4.2458 3.11816Z" fill="#BABABA"/>
                    <path d="M4.92617 3.44997C5.07761 3.44926 5.07761 3.44926 5.2321 3.44853C5.57042 3.44747 5.90866 3.44953 6.24697 3.45158C6.48947 3.45146 6.73198 3.45116 6.97448 3.45068C7.63307 3.44993 8.29163 3.4519 8.95022 3.45439C9.63856 3.45658 10.3269 3.45641 11.0153 3.45653C12.1708 3.45706 13.3264 3.45924 14.4819 3.46252C15.9671 3.46673 17.4523 3.46823 18.9375 3.46888C20.2124 3.46945 21.4873 3.47127 22.7622 3.47329C23.1731 3.47389 23.5839 3.47431 23.9948 3.47472C24.639 3.47543 25.2833 3.47691 25.9275 3.479C26.1646 3.47966 26.4017 3.48007 26.6388 3.48022C26.9611 3.48048 27.2833 3.48162 27.6056 3.48301C27.7863 3.48344 27.9671 3.48387 28.1533 3.48432C28.5537 3.50344 28.5537 3.50344 28.6945 3.64895C28.9923 3.66698 29.2907 3.67485 29.589 3.67882C29.6823 3.68026 29.7757 3.6817 29.8719 3.68319C30.1818 3.6878 30.4917 3.69139 30.8017 3.69498C31.0161 3.69798 31.2304 3.70103 31.4448 3.70415C32.01 3.71219 32.5753 3.71938 33.1405 3.72639C33.7169 3.73369 34.2933 3.74179 34.8697 3.74983C36.0013 3.7655 37.133 3.78026 38.2647 3.79445C38.2647 3.84247 38.2647 3.89048 38.2647 3.93995C28.2793 3.93995 18.2938 3.93995 8.00583 3.93995C8.00583 4.3721 8.00583 4.80424 8.00583 5.24949C7.91294 5.20147 7.82005 5.15345 7.72435 5.10398C7.44859 5.0916 7.17242 5.08839 6.89641 5.08977C6.65013 5.09048 6.65013 5.09048 6.39888 5.09119C6.22671 5.09241 6.05454 5.09363 5.87715 5.09489C5.70389 5.09554 5.53064 5.0962 5.35213 5.09688C4.92312 5.0986 4.49413 5.10099 4.06514 5.10398C4.01869 4.91192 3.97225 4.71985 3.9244 4.52197C3.69218 4.52197 3.45996 4.52197 3.2207 4.52197C3.27011 4.15166 3.32934 3.97339 3.58691 3.70515C4.04929 3.4288 4.39314 3.44934 4.92617 3.44997Z" fill="#CFCFCF"/>
                    <path d="M3.22144 14.2699C3.36077 14.3419 3.36077 14.3419 3.50291 14.4154C3.50291 14.5594 3.50291 14.7035 3.50291 14.8519C11.8628 14.8519 20.2227 14.8519 28.8359 14.8519C28.8359 14.7559 28.8359 14.6598 28.8359 14.5609C26.746 14.5129 24.656 14.4649 22.5027 14.4154C22.5027 14.3674 22.5027 14.3194 22.5027 14.2699C27.9831 14.2699 33.4634 14.2699 39.1099 14.2699C38.9706 14.4139 38.8312 14.558 38.6877 14.7064C43.8429 14.7784 43.8429 14.7784 49.1024 14.8519C49.1024 14.8999 49.1024 14.9479 49.1024 14.9974C34.0081 14.9974 18.9138 14.9974 3.36217 14.9974C3.31573 14.7573 3.26929 14.5173 3.22144 14.2699Z" fill="#34A853"/>
                    <path d="M2.93945 4.66748C3.26456 4.66748 3.58967 4.66748 3.92463 4.66748C3.92463 7.78853 3.92463 10.9096 3.92463 14.1252C3.59952 14.1252 3.27441 14.1252 2.93945 14.1252C2.93945 11.0042 2.93945 7.88311 2.93945 4.66748Z" fill="#4B4B4B"/>
                    <path d="M51.3893 3.62952C51.517 3.62989 51.6447 3.63027 51.7763 3.63065C51.9679 3.63009 51.9679 3.63009 52.1634 3.62952C52.48 3.64884 52.48 3.64884 52.6208 3.79434C52.6772 4.07189 52.7257 4.35115 52.7703 4.63099C52.7951 4.78329 52.82 4.93559 52.8456 5.09251C52.896 5.49149 52.913 5.86636 52.9022 6.26791C53.0416 6.31592 53.1809 6.36394 53.3244 6.41341C53.5294 7.42013 53.6338 8.39288 53.1837 9.32348C52.6728 9.32348 52.1619 9.32348 51.6356 9.32348C51.6124 8.99909 51.6124 8.99909 51.5888 8.66815C51.4738 7.14302 51.3351 5.65989 51.0006 4.16833C50.9779 4.04492 50.9552 3.9215 50.9319 3.79434C51.0726 3.64884 51.0726 3.64884 51.3893 3.62952Z" fill="#3E3E3E"/>
                    <path d="M24.7539 6.99512C28.5623 6.99512 32.3707 6.99512 36.2945 6.99512C36.2945 8.57965 36.2945 10.1642 36.2945 11.7967C32.4861 11.7967 28.6777 11.7967 24.7539 11.7967C24.7539 10.2122 24.7539 8.62767 24.7539 6.99512ZM25.0354 7.28612C25.0354 8.67859 25.0354 10.0711 25.0354 11.5057C28.658 11.5057 32.2806 11.5057 36.013 11.5057C36.013 10.1133 36.013 8.72079 36.013 7.28612C32.3904 7.28612 28.7678 7.28612 25.0354 7.28612Z" fill="#D4D4D4"/>
                    <path d="M54.3084 2.77616C54.3145 3.01858 54.3142 3.26124 54.3084 3.50368C54.0546 3.76616 53.6657 3.68367 53.3227 3.69522C53.1517 3.70131 52.9807 3.70741 52.8046 3.71369C52.6245 3.71941 52.4444 3.72513 52.2589 3.73102C52.0783 3.73731 51.8977 3.74359 51.7116 3.75007C51.2637 3.76556 50.8157 3.7804 50.3677 3.79468C50.3677 4.23028 50.4386 4.61989 50.5179 5.04606C50.8763 7.04654 50.8311 9.04258 50.79 11.0699C50.7435 11.0699 50.6971 11.0699 50.6492 11.0699C50.6457 10.9569 50.6422 10.844 50.6385 10.7277C50.6221 10.2112 50.6049 9.69477 50.5877 9.17831C50.5821 9.00069 50.5766 8.82307 50.5709 8.64007C50.498 6.2335 50.498 6.2335 49.5233 4.08569C49.1398 3.95352 48.8728 3.91347 48.4749 3.89415C48.3556 3.88805 48.2363 3.88196 48.1134 3.87568C47.9894 3.86995 47.8654 3.86423 47.7377 3.85834C47.6121 3.85206 47.4864 3.84577 47.357 3.8393C47.047 3.82388 46.7371 3.80903 46.4271 3.79468C46.4271 3.69865 46.4271 3.60262 46.4271 3.50368C43.9191 3.50368 41.4111 3.50368 38.8271 3.50368C38.8271 3.45566 38.8271 3.40764 38.8271 3.35817C38.9244 3.35667 39.0217 3.35517 39.1219 3.35363C40.0491 3.33923 40.9762 3.3243 41.9034 3.3088C42.3798 3.30085 42.8562 3.29309 43.3326 3.28581C46.7221 3.28328 46.7221 3.28328 50.0863 2.92166C50.2915 2.91904 50.4969 2.92195 50.702 2.93075C51.4688 2.94284 52.2101 2.83887 52.9667 2.72134C53.4491 2.65046 53.8448 2.60039 54.3084 2.77616Z" fill="#BAB0A5"/>
                    <path d="M29.1354 7.72168C29.3049 7.74503 29.3049 7.74503 29.4779 7.76885C29.648 7.79052 29.648 7.79052 29.8215 7.81262C30.1024 7.86889 30.1024 7.86889 30.2431 8.01439C30.2573 8.42206 30.2627 8.82535 30.2607 9.23298C30.2616 9.40348 30.2616 9.40348 30.2624 9.57742C30.2616 10.0626 30.2518 10.4612 30.1024 10.9245C29.8796 10.9324 29.6568 10.938 29.4339 10.9427C29.3098 10.946 29.1857 10.9494 29.0579 10.9529C28.6769 10.923 28.4662 10.8122 28.1321 10.6335C28.0392 10.6815 27.9463 10.7295 27.8506 10.779C27.8506 9.96268 27.8506 9.14641 27.8506 8.3054C28.0828 8.20937 28.315 8.11333 28.5543 8.01439C28.8358 7.72338 28.8358 7.72338 29.1354 7.72168Z" fill="#E5E7E6"/>
                    <path d="M53.1831 9.46924C53.5814 10.1654 53.5217 10.8655 53.4646 11.6518C53.3239 12.1883 53.3239 12.1883 53.1831 12.5248C53.0902 12.5248 52.9973 12.5248 52.9016 12.5248C52.9104 12.7454 52.9104 12.7454 52.9192 12.9704C52.9008 13.5696 52.7986 13.9971 52.6202 14.5619C52.8059 14.6099 52.9917 14.6579 53.1831 14.7074C53.1831 14.8034 53.1831 14.8994 53.1831 14.9984C52.5626 15.1588 51.9891 15.155 51.3535 15.1439C51.4928 15.0719 51.4928 15.0719 51.635 14.9984C51.6321 14.8333 51.6292 14.6683 51.6262 14.4982C51.635 13.9798 51.635 13.9798 51.7757 13.8343C52.1303 12.4624 52.1409 11.025 52.1979 9.61474C52.6202 9.46924 52.6202 9.46924 53.1831 9.46924Z" fill="#595959"/>
                    <path d="M51.0721 3.6489C51.4368 5.55624 51.7335 7.37495 51.635 9.32354C52.1459 9.32354 52.6568 9.32354 53.1832 9.32354C53.1832 9.37155 53.1832 9.41957 53.1832 9.46904C52.4401 9.46904 51.697 9.46904 50.9313 9.46904C50.894 9.15694 50.8566 8.84483 50.8181 8.52327C50.781 8.21744 50.7437 7.91164 50.7063 7.60584C50.6807 7.39505 50.6553 7.18424 50.6301 6.97338C50.4403 5.36818 50.4403 5.36818 50.0869 3.7944C50.4335 3.61523 50.6892 3.63848 51.0721 3.6489Z" fill="#212121"/>
                    <path d="M33.6208 7.86865C33.853 7.91667 34.0852 7.96468 34.3245 8.01416C34.3709 8.20622 34.4174 8.39829 34.4652 8.59617C34.651 8.59617 34.8368 8.59617 35.0282 8.59617C35.0282 8.78823 35.0282 8.9803 35.0282 9.17818C34.5529 9.10001 34.0857 9.01658 33.6208 8.88718C33.6469 8.97421 33.6731 9.06124 33.7 9.1509C33.7615 9.46919 33.7615 9.46919 33.6208 9.9057C33.853 9.9057 34.0852 9.9057 34.3245 9.9057C34.3245 9.80967 34.3245 9.71364 34.3245 9.6147C34.5567 9.56668 34.7889 9.51866 35.0282 9.46919C35.0282 9.70927 35.0282 9.94935 35.0282 10.1967C34.8424 10.1967 34.6566 10.1967 34.4652 10.1967C34.4188 10.3888 34.3723 10.5808 34.3245 10.7787C34.0923 10.8267 33.8601 10.8748 33.6208 10.9242C33.586 10.8342 33.5511 10.7442 33.5152 10.6514C33.3379 10.2755 33.3379 10.2755 32.7764 10.0512C32.7764 9.52303 32.7764 8.99485 32.7764 8.45067C33.0086 8.40265 33.2408 8.35463 33.4801 8.30516C33.5265 8.16111 33.5729 8.01707 33.6208 7.86865Z" fill="#CCCCCC"/>
                    <path d="M4.20617 4.08545C5.36727 4.08545 6.52836 4.08545 7.72464 4.08545C7.72464 4.42156 7.72464 4.75768 7.72464 5.10397C6.5171 5.10397 5.30956 5.10397 4.06543 5.10397C4.11187 4.76786 4.15832 4.43175 4.20617 4.08545Z" fill="#D7D7D7"/>
                    <path d="M51.916 3.6488C52.2643 3.72083 52.2643 3.72083 52.6197 3.79431C52.6673 4.07002 52.7141 4.34591 52.7604 4.62186C52.7866 4.77547 52.8127 4.92909 52.8396 5.08736C52.8942 5.48928 52.9128 5.86299 52.9012 6.26787C53.0405 6.31588 53.1799 6.3639 53.3234 6.41337C53.479 7.17749 53.5406 7.96313 53.4641 8.74143C53.3713 8.88548 53.2784 9.02953 53.1827 9.17794C52.9969 9.17794 52.8111 9.17794 52.6197 9.17794C52.6119 9.05605 52.6041 8.93415 52.5961 8.80857C52.5669 8.35677 52.5372 7.90502 52.5072 7.45328C52.4943 7.25768 52.4816 7.06207 52.4691 6.86644C52.4512 6.58541 52.4324 6.30444 52.4135 6.02347C52.4025 5.85431 52.3914 5.68515 52.38 5.51087C52.3622 5.11093 52.3622 5.11093 52.1975 4.81283C52.2004 4.66878 52.2033 4.52474 52.2063 4.37632C52.2459 3.92269 52.2459 3.92269 51.916 3.6488Z" fill="#717171"/>
                    <path d="M54.3093 2.77602C54.3153 3.01845 54.315 3.26111 54.3093 3.50354C54.1686 3.64905 54.1686 3.64905 53.7521 3.66556C53.57 3.6648 53.388 3.66404 53.2004 3.66326C53.0555 3.66295 53.0555 3.66295 52.9076 3.66263C52.5978 3.66181 52.2881 3.65999 51.9783 3.65814C51.7688 3.65741 51.5592 3.65675 51.3497 3.65615C50.835 3.65454 50.3203 3.65203 49.8057 3.64905C49.8057 3.40896 49.8057 3.16888 49.8057 2.92153C49.9015 2.9249 49.9972 2.92828 50.0959 2.93176C51.077 2.95064 52.0137 2.87328 52.9816 2.72125C53.4603 2.6498 53.8491 2.60247 54.3093 2.77602Z" fill="#C0C0C0"/>
                    <path d="M52.2067 9.45972C52.4114 9.46422 52.4114 9.46422 52.6202 9.46881C52.4808 9.51683 52.3415 9.56484 52.1979 9.61431C52.2012 9.78481 52.2045 9.9553 52.2078 10.131C52.2247 11.401 52.2009 12.591 51.9165 13.8339C51.8931 13.959 51.8696 14.0841 51.8455 14.213C51.7757 14.5614 51.7757 14.5614 51.635 14.9979C51.3447 15.098 51.3447 15.098 51.072 15.1435C51.1451 14.4886 51.2365 13.8453 51.3535 13.1973C51.5055 12.2906 51.5519 11.3878 51.5869 10.4698C51.6276 9.47194 51.6276 9.47194 52.2067 9.45972Z" fill="#444444"/>
                    <path d="M4.90322 3.46053C5.0426 3.46145 5.0426 3.46145 5.18479 3.4624C5.48022 3.46483 5.77552 3.47031 6.07091 3.47587C6.27176 3.47807 6.4726 3.48006 6.67345 3.48184C7.16462 3.48664 7.6557 3.49417 8.14681 3.50316C8.10037 4.07935 8.05392 4.65554 8.00607 5.2492C7.95963 5.2492 7.91319 5.2492 7.86533 5.2492C7.79567 4.67301 7.79567 4.67301 7.7246 4.08517C6.5635 4.08517 5.4024 4.08517 4.20612 4.08517C4.15968 4.1812 4.11323 4.27724 4.06538 4.37618C3.92464 4.52168 3.92464 4.52168 3.564 4.53078C3.39419 4.52627 3.39419 4.52627 3.22095 4.52168C3.2705 4.15024 3.32973 3.97283 3.5886 3.70418C4.04452 3.43144 4.37845 3.45363 4.90322 3.46053Z" fill="#C5C5C5"/>
                    <path d="M52.7614 9.6145C52.9008 9.6145 53.0401 9.6145 53.1836 9.6145C53.6022 10.2636 53.5197 10.8901 53.4651 11.6516C53.3244 12.1881 53.3244 12.1881 53.1836 12.5246C53.0908 12.5246 52.9979 12.5246 52.9022 12.5246C52.9109 12.7451 52.9109 12.7451 52.9198 12.9702C52.9014 13.5694 52.7991 13.9968 52.6207 14.5616C52.8065 14.6096 52.9922 14.6577 53.1836 14.7071C53.1836 14.8032 53.1836 14.8992 53.1836 14.9981C52.5567 15.0702 52.5567 15.0702 51.917 15.1436C52.0099 14.9996 52.1028 14.8555 52.1985 14.7071C52.2546 14.424 52.3005 14.1386 52.3392 13.8523C52.4515 13.0253 52.4515 13.0253 52.6284 12.6263C52.8251 12.0455 52.7911 11.4888 52.779 10.8786C52.7777 10.7569 52.7765 10.6353 52.7752 10.51C52.7719 10.2115 52.7668 9.91298 52.7614 9.6145Z" fill="#848484"/>
                    <path d="M53.1845 14.707C53.2309 14.8031 53.2774 14.8991 53.3252 14.998C53.4617 14.995 53.5981 14.992 53.7386 14.9889C54.1697 14.998 54.1697 14.998 54.3104 15.1435C54.3161 15.4345 54.3164 15.7256 54.3104 16.0166C53.6682 15.9963 53.0261 15.9747 52.384 15.9529C52.202 15.9472 52.0199 15.9415 51.8324 15.9356C51.6568 15.9295 51.4813 15.9234 51.3005 15.9171C51.139 15.9118 50.9776 15.9064 50.8113 15.9009C50.4162 15.8742 50.0513 15.8172 49.666 15.7256C49.7589 15.5335 49.8518 15.3414 49.9475 15.1435C49.9939 15.2396 50.0404 15.3356 50.0882 15.4345C51.11 15.3865 52.1318 15.3385 53.1845 15.289C53.138 15.193 53.0916 15.097 53.0438 14.998C53.0902 14.902 53.1366 14.806 53.1845 14.707Z" fill="#CECCCB"/>
                    <path d="M51.6357 3.6488C51.9841 3.72083 51.9841 3.72083 52.3394 3.79431C52.3365 3.95636 52.3336 4.11842 52.3306 4.28538C52.3023 4.78841 52.3023 4.78841 52.4802 5.10384C52.5136 5.48957 52.5398 5.87226 52.5593 6.25877C52.5653 6.36952 52.5713 6.48026 52.5774 6.59436C52.6212 7.45597 52.6371 8.31516 52.6209 9.17794C52.8067 9.22596 52.9925 9.27397 53.1839 9.32344C52.9517 9.32344 52.7194 9.32344 52.4802 9.32344C52.2525 8.906 52.1612 8.59354 52.1454 8.11565C52.1406 7.99739 52.1358 7.87913 52.1308 7.75729C52.1271 7.63491 52.1234 7.51252 52.1195 7.38643C52.0906 6.5664 52.0452 5.76878 51.9172 4.95834C51.8708 4.95834 51.8243 4.95834 51.7765 4.95834C51.73 4.52619 51.6836 4.09404 51.6357 3.6488Z" fill="#5C5C5C"/>
                    <path d="M38.2646 14.998C38.4039 14.998 38.5432 14.998 38.6868 14.998C38.6868 15.0941 38.6868 15.1901 38.6868 15.2891C39.4299 15.2891 40.173 15.2891 40.9386 15.2891C40.9386 15.3371 40.9386 15.3851 40.9386 15.4346C38.5083 15.6361 36.0793 15.5689 33.6446 15.5226C33.085 15.5122 32.5253 15.5028 31.9657 15.4934C30.8752 15.4748 29.7848 15.4551 28.6943 15.4346C28.6943 15.3385 28.6943 15.2425 28.6943 15.1436C28.8122 15.1439 28.93 15.1442 29.0514 15.1445C30.1594 15.1474 31.2674 15.1497 32.3754 15.1511C32.9451 15.1519 33.5148 15.1529 34.0845 15.1545C34.6339 15.1561 35.1832 15.157 35.7325 15.1574C35.9426 15.1576 36.1526 15.1582 36.3627 15.1589C36.6559 15.16 36.9491 15.1601 37.2423 15.1601C37.4931 15.1606 37.4931 15.1606 37.7489 15.161C38.1128 15.1877 38.1128 15.1877 38.2646 14.998Z" fill="#A8A8A8"/>
                    <path d="M28.8352 7.72314C29.1211 7.73565 29.1211 7.73565 29.4685 7.77771C29.6405 7.7974 29.6405 7.7974 29.816 7.81749C30.1018 7.86865 30.1018 7.86865 30.2426 8.01415C30.2624 8.40273 30.2486 8.78886 30.2426 9.17818C29.9985 9.2731 29.9985 9.2731 29.6796 9.32368C29.3784 9.17875 29.3784 9.17875 29.0815 8.96902C28.9821 8.90018 28.8826 8.83135 28.7802 8.76043C28.7055 8.70622 28.6307 8.65201 28.5537 8.59617C28.6769 7.88684 28.6769 7.88684 28.8352 7.72314Z" fill="#CBCCCC"/>
                    <path d="M28.3525 9.45959C28.5223 9.4641 28.5223 9.4641 28.6956 9.46869C28.6956 9.61274 28.6956 9.75679 28.6956 9.9052C28.9278 9.95322 29.16 10.0012 29.3993 10.0507C29.4872 10.3235 29.4872 10.3235 29.54 10.6327C29.4471 10.7287 29.3542 10.8248 29.2585 10.9237C28.9243 10.8692 28.9243 10.8692 28.5548 10.7782C28.369 10.7782 28.1833 10.7782 27.9919 10.7782C27.9454 10.7782 27.899 10.7782 27.8511 10.7782C27.8374 9.88303 27.8374 9.88303 27.8511 9.61419C27.9919 9.46869 27.9919 9.46869 28.3525 9.45959Z" fill="#C8C9C9"/>
                    <path d="M46.9912 14.9983C47.3548 14.9944 47.7183 14.9915 48.0819 14.9892C48.1846 14.988 48.2873 14.9868 48.3931 14.9855C48.8893 14.9832 49.3289 15.0051 49.806 15.1438C49.7595 15.3359 49.7131 15.5279 49.6653 15.7258C48.7828 15.6778 47.9004 15.6298 46.9912 15.5803C46.9912 15.3882 46.9912 15.1962 46.9912 14.9983Z" fill="#B8A898"/>
                    <path d="M53.1827 9.61423C53.0433 9.61423 52.904 9.61423 52.7604 9.61423C52.7739 9.79485 52.7873 9.97547 52.8011 10.1616C52.817 10.4005 52.8327 10.6394 52.8484 10.8783C52.8575 10.9971 52.8666 11.1159 52.8759 11.2384C52.9173 11.8987 52.9088 12.3542 52.6197 12.9608C52.566 13.2992 52.5177 13.6387 52.479 13.9793C52.4325 13.9793 52.3861 13.9793 52.3382 13.9793C52.3382 12.5388 52.3382 11.0984 52.3382 9.61423C52.6888 9.43301 52.8183 9.5012 53.1827 9.61423ZM52.1975 13.9793C52.2439 13.9793 52.2904 13.9793 52.3382 13.9793C52.3382 14.3154 52.3382 14.6516 52.3382 14.9979C52.1989 14.9979 52.0596 14.9979 51.916 14.9979C52.0392 14.3067 52.0392 14.3067 52.1975 13.9793Z" fill="#6C6C6C"/>
                    <path d="M29.1175 3.21216C29.1175 3.35621 29.1175 3.50026 29.1175 3.64867C26.2845 3.64867 23.4514 3.64867 20.5325 3.64867C20.5325 3.55264 20.5325 3.4566 20.5325 3.35766C21.5895 3.33865 22.6465 3.31967 23.7035 3.30075C24.1943 3.29196 24.6851 3.28316 25.1759 3.27432C25.7401 3.26417 26.3043 3.25408 26.8685 3.24399C27.0448 3.2408 27.2212 3.23762 27.4029 3.23434C27.648 3.22997 27.648 3.22997 27.8981 3.22551C28.0422 3.22293 28.1862 3.22035 28.3347 3.21768C28.5956 3.21369 28.8566 3.21216 29.1175 3.21216Z" fill="#ABABAB"/>
                    <path d="M38.8281 3.35803C41.5219 3.35803 44.2156 3.35803 46.991 3.35803C46.991 3.50208 46.991 3.64613 46.991 3.79454C46.8052 3.79454 46.6194 3.79454 46.428 3.79454C46.428 3.69851 46.428 3.60248 46.428 3.50354C43.9201 3.50354 41.4121 3.50354 38.8281 3.50354C38.8281 3.45552 38.8281 3.4075 38.8281 3.35803Z" fill="#B5B5B5"/>
                    <path d="M32.7761 7.72314C33.5192 7.72314 34.2623 7.72314 35.0279 7.72314C35.0744 8.20331 35.1208 8.68347 35.1687 9.17818C34.9829 9.08215 34.7971 8.98612 34.6057 8.88717C34.7451 8.88717 34.8844 8.88717 35.0279 8.88717C35.0279 8.79114 35.0279 8.69511 35.0279 8.59617C34.8422 8.59617 34.6564 8.59617 34.465 8.59617C34.3721 8.4041 34.2792 8.21204 34.1835 8.01415C33.6377 7.95102 33.6377 7.95102 33.3743 8.23241C33.3162 8.30443 33.2582 8.37646 33.1983 8.45066C33.059 8.40265 32.9197 8.35463 32.7761 8.30516C32.7761 8.11309 32.7761 7.92103 32.7761 7.72314Z" fill="#DDDEDE"/>
                    <path d="M32.7762 10.051C33.2211 10.2503 33.3382 10.3404 33.6207 10.7785C33.8529 10.7305 34.0851 10.6825 34.3244 10.633C34.3708 10.489 34.4173 10.3449 34.4651 10.1965C34.6973 10.2445 34.9295 10.2926 35.1688 10.342C35.1224 10.5821 35.0759 10.8222 35.0281 11.0696C34.3314 11.0696 33.6347 11.0696 32.917 11.0696C32.8241 10.8295 32.7312 10.5894 32.6355 10.342C32.6819 10.246 32.7284 10.15 32.7762 10.051Z" fill="#E0E0E0"/>
                    <path d="M35.0291 9.46875C35.0291 9.70883 35.0291 9.94891 35.0291 10.1963C34.8433 10.1963 34.6575 10.1963 34.4661 10.1963C34.4197 10.3883 34.3732 10.5804 34.3254 10.7783C34.0932 10.8263 33.8609 10.8743 33.6217 10.9238C33.4633 10.2326 33.4633 10.2326 33.6217 9.90526C33.8539 9.90526 34.0861 9.90526 34.3254 9.90526C34.3254 9.80923 34.3254 9.7132 34.3254 9.61425C34.6069 9.46875 34.6069 9.46875 35.0291 9.46875Z" fill="#9E9E9E"/>
                    <path d="M11.9479 14.9978C11.9479 15.0938 11.9479 15.1899 11.9479 15.2888C13.8521 15.2888 15.7563 15.2888 17.7182 15.2888C17.7182 15.3368 17.7182 15.3848 17.7182 15.4343C15.5354 15.4823 13.3525 15.5303 11.1035 15.5798C11.1035 15.4358 11.1035 15.2917 11.1035 15.1433C11.5257 14.9978 11.5257 14.9978 11.9479 14.9978Z" fill="#B5B5B5"/>
                    <path d="M4.48828 4.23059C5.41716 4.23059 6.34604 4.23059 7.30306 4.23059C7.30306 4.37464 7.30306 4.51869 7.30306 4.6671C6.37418 4.6671 5.44531 4.6671 4.48828 4.6671C4.48828 4.52305 4.48828 4.379 4.48828 4.23059Z" fill="#34A853"/>
                    <path d="M30.244 9.6145C30.1975 10.0466 30.1511 10.4788 30.1032 10.924C29.8246 10.924 29.5459 10.924 29.2588 10.924C29.282 10.816 29.3052 10.708 29.3292 10.5966C29.4163 10.1689 29.4163 10.1689 29.3995 9.6145C29.681 9.469 29.681 9.469 30.244 9.6145Z" fill="#DEDEDE"/>
                    <path d="M50.2279 4.81323C50.3208 4.86125 50.4137 4.90926 50.5094 4.95874C51.0512 6.88461 50.8167 9.09085 50.7909 11.0699C50.7444 11.0699 50.698 11.0699 50.6501 11.0699C50.6448 10.9005 50.6448 10.9005 50.6394 10.7277C50.623 10.2112 50.6058 9.69479 50.5885 9.17834C50.583 9.00072 50.5775 8.8231 50.5718 8.64009C50.5374 7.03997 50.5374 7.03997 50.2103 5.48619C50.1697 5.36014 50.129 5.2341 50.0872 5.10424C50.1336 5.00821 50.18 4.91217 50.2279 4.81323Z" fill="#B0B0B0"/>
                    <path d="M52.6211 14.8525C52.8997 14.9486 53.1784 15.0446 53.4655 15.1435C53.184 15.4346 53.184 15.4346 52.8808 15.4676C52.7584 15.4661 52.6361 15.4645 52.51 15.463C52.3776 15.462 52.2452 15.4611 52.1087 15.4601C51.9701 15.4577 51.8315 15.4553 51.6887 15.4527C51.549 15.4514 51.4093 15.4501 51.2654 15.4488C50.9197 15.4453 50.5741 15.4405 50.2285 15.4346C50.2285 15.2905 50.2285 15.1465 50.2285 14.998C50.3894 14.9997 50.5504 15.0014 50.7162 15.0032C50.926 15.0045 51.1358 15.0058 51.3456 15.0071C51.4519 15.0084 51.5581 15.0096 51.6675 15.0108C51.9385 15.0121 52.2095 15.0056 52.4803 14.998C52.5268 14.95 52.5732 14.902 52.6211 14.8525Z" fill="#B8B8B8"/>
                    <path d="M51.917 4.8125C51.9634 4.8125 52.0099 4.8125 52.0577 4.8125C52.1893 5.79642 52.2438 6.77225 52.2837 7.76406C52.2889 7.88166 52.2942 7.99927 52.2996 8.12043C52.3039 8.2258 52.3082 8.33116 52.3125 8.43972C52.3397 8.74666 52.4001 9.02657 52.4799 9.32311C52.3406 9.27509 52.2013 9.22708 52.0577 9.17761C52.0099 8.69269 51.9633 8.20764 51.917 7.72257C51.9036 7.58659 51.8901 7.4506 51.8763 7.3105C51.8017 6.52241 51.7479 5.74997 51.7763 4.958C51.8227 4.90999 51.8691 4.86197 51.917 4.8125Z" fill="#4D4D4D"/>
                    <path d="M49.8047 2.92188C50.78 2.9939 50.78 2.9939 51.775 3.06738C51.775 3.11539 51.775 3.16341 51.775 3.21288C52.193 3.28491 52.193 3.28491 52.6195 3.35839C52.6195 3.4064 52.6195 3.45442 52.6195 3.50389C51.6906 3.55191 50.7617 3.59992 49.8047 3.64939C49.8047 3.40931 49.8047 3.16923 49.8047 2.92188Z" fill="#CCCAC9"/>
                    <path d="M38.6871 3.21289C38.6871 3.40496 38.6871 3.59702 38.6871 3.7949C38.6175 3.77185 38.548 3.74879 38.4764 3.72503C37.9837 3.61925 37.4929 3.61499 36.9916 3.60336C36.8831 3.60034 36.7745 3.59732 36.6627 3.5942C36.3171 3.58471 35.9716 3.57612 35.626 3.56756C35.3912 3.56127 35.1565 3.55492 34.9217 3.54852C34.3473 3.53296 33.7728 3.51822 33.1982 3.5039C33.1982 3.45588 33.1982 3.40787 33.1982 3.35839C33.9121 3.33759 34.6259 3.31687 35.3397 3.29623C35.5826 3.28919 35.8255 3.28214 36.0683 3.27506C36.4173 3.26489 36.7663 3.2548 37.1153 3.24472C37.2239 3.24154 37.3326 3.23835 37.4445 3.23507C37.8589 3.22317 38.2725 3.21289 38.6871 3.21289Z" fill="#A2A2A2"/>
                    <path d="M52.7611 9.61426C52.9004 9.61426 53.0398 9.61426 53.1833 9.61426C53.1833 10.4305 53.1833 11.2468 53.1833 12.0878C53.0904 12.1358 52.9975 12.1839 52.9018 12.2333C52.7321 11.7068 52.7459 11.2257 52.7523 10.6783C52.7529 10.5761 52.7536 10.474 52.7542 10.3688C52.7559 10.1173 52.7584 9.86576 52.7611 9.61426Z" fill="#959595"/>
                    <path d="M34.3248 8.74121C34.3712 8.88526 34.4177 9.02931 34.4655 9.17772C34.7491 9.28441 34.7491 9.28441 35.0285 9.32323C34.7963 9.41926 34.564 9.51529 34.3248 9.61423C34.3248 9.71026 34.3248 9.8063 34.3248 9.90524C34.0926 9.90524 33.8604 9.90524 33.6211 9.90524C33.6211 9.56913 33.6211 9.23301 33.6211 8.88671C33.8533 8.8387 34.0855 8.79068 34.3248 8.74121Z" fill="#E6E6E6"/>
                    <path d="M29.1175 3.35791C30.4644 3.35791 31.8113 3.35791 33.199 3.35791C33.199 3.40593 33.199 3.45394 33.199 3.50341C33.1175 3.50706 33.0361 3.51071 32.9522 3.51446C30.8205 3.60617 30.8205 3.60617 28.6953 3.79442C28.8346 3.7464 28.974 3.69839 29.1175 3.64892C29.1175 3.55288 29.1175 3.45685 29.1175 3.35791Z" fill="#B8B8B8"/>
                    <path d="M50.3682 11.9429C50.4611 11.9429 50.554 11.9429 50.6497 11.9429C50.6336 12.2703 50.6156 12.5977 50.5969 12.925C50.5822 13.1985 50.5822 13.1985 50.5672 13.4775C50.5155 13.9232 50.4531 14.1865 50.2275 14.5619C50.0582 13.6168 50.1452 12.8727 50.3682 11.9429Z" fill="#B6B6B6"/>
                    <path d="M52.7604 5.54053C52.8069 5.54053 52.8533 5.54053 52.9012 5.54053C52.9215 5.70558 52.9418 5.87064 52.9627 6.0407C52.9873 6.53108 52.9873 6.53108 53.1826 6.70456C53.1928 6.99842 53.1944 7.29263 53.1914 7.58667C53.1902 7.74741 53.1889 7.90815 53.1876 8.07377C53.186 8.19812 53.1843 8.32248 53.1826 8.4506C53.1362 8.4506 53.0898 8.4506 53.0419 8.4506C53.0419 8.1625 53.0419 7.8744 53.0419 7.57758C52.949 7.57758 52.8561 7.57758 52.7604 7.57758C52.6319 6.85433 52.6319 6.26377 52.7604 5.54053Z" fill="#A0A0A0"/>
                    <path d="M53.0428 9.90576C53.1822 9.95378 53.3215 10.0018 53.4651 10.0513C53.517 11.7277 53.517 11.7277 53.1836 12.5248C53.0907 12.5248 52.9978 12.5248 52.9021 12.5248C52.9485 12.3808 52.995 12.2367 53.0428 12.0883C53.0527 11.714 53.056 11.3439 53.0516 10.9698C53.0507 10.8166 53.0507 10.8166 53.0497 10.6603C53.0481 10.4088 53.0455 10.1573 53.0428 9.90576Z" fill="#5E5E5E"/>
                    <path d="M28.4133 8.16028C28.5526 8.35234 28.692 8.54441 28.8355 8.74229C28.6596 8.96055 28.6596 8.96055 28.4133 9.1788C28.2275 9.1788 28.0417 9.1788 27.8503 9.1788C27.8503 8.89071 27.8503 8.60261 27.8503 8.30578C28.0361 8.25777 28.2219 8.20975 28.4133 8.16028Z" fill="#CFD0D0"/>
                    <path d="M52.9014 6.26807C53.0407 6.31608 53.18 6.3641 53.3236 6.41357C53.4824 7.19361 53.478 7.94908 53.4643 8.74163C53.325 8.78964 53.1857 8.83766 53.0421 8.88713C53.0437 8.73464 53.0454 8.58215 53.0471 8.42504C53.0484 8.22441 53.0497 8.02377 53.0509 7.82314C53.0521 7.7227 53.0533 7.62226 53.0545 7.51877C53.0566 7.06131 53.0424 6.70542 52.9014 6.26807Z" fill="#5C5C5C"/>
                    <path d="M33.6212 7.86816C33.8534 7.91618 34.0856 7.9642 34.3249 8.01367C34.2785 8.25375 34.232 8.49383 34.1842 8.74119C33.9519 8.69317 33.7197 8.64515 33.4805 8.59568C33.5269 8.3556 33.5734 8.11552 33.6212 7.86816Z" fill="#7E8080"/>
                    <path d="M54.3092 2.7762C54.3092 2.87223 54.3092 2.96826 54.3092 3.0672C53.5661 3.0672 52.823 3.0672 52.0574 3.0672C52.7654 2.70123 53.5345 2.47583 54.3092 2.7762Z" fill="#B5B5B5"/>
                    <path d="M38.2646 14.9985C38.404 14.9985 38.5433 14.9985 38.6869 14.9985C38.6869 15.0946 38.6869 15.1906 38.6869 15.2895C39.43 15.2895 40.1731 15.2895 40.9387 15.2895C40.9387 15.3376 40.9387 15.3856 40.9387 15.435C39.615 15.5071 39.615 15.5071 38.2646 15.5805C38.2646 15.3885 38.2646 15.1964 38.2646 14.9985Z" fill="#959595"/>
                    <path d="M51.7766 9.46875C51.8694 9.46875 51.9623 9.46875 52.058 9.46875C51.9224 10.8379 51.9224 10.8379 51.7766 11.5058C51.7301 11.5058 51.6837 11.5058 51.6358 11.5058C51.632 11.1936 51.6293 10.8814 51.627 10.5691C51.6254 10.3952 51.6238 10.2214 51.6221 10.0422C51.6358 9.61425 51.6358 9.61425 51.7766 9.46875Z" fill="#3A3A3A"/>
                    <path d="M52.761 7.57739C52.8539 7.57739 52.9468 7.57739 53.0425 7.57739C53.0889 8.10557 53.1354 8.63375 53.1832 9.17793C53.0439 9.17793 52.9045 9.17793 52.761 9.17793C52.761 8.64975 52.761 8.12158 52.761 7.57739Z" fill="#7A7A7A"/>
                    <path d="M28.6954 10.0511C28.7883 10.0511 28.8812 10.0511 28.9769 10.0511C28.9769 10.1952 28.9769 10.3392 28.9769 10.4877C29.1162 10.4877 29.2556 10.4877 29.3991 10.4877C29.3527 10.6317 29.3062 10.7758 29.2584 10.9242C29.0262 10.8762 28.7939 10.8281 28.5547 10.7787C28.6011 10.5386 28.6476 10.2985 28.6954 10.0511Z" fill="#6A6C6B"/>
                    <path d="M28.1319 10.4875C28.5073 10.6816 28.8826 10.8756 29.2579 11.0696C28.8399 11.0696 28.4219 11.0696 27.9912 11.0696C27.9912 10.6331 27.9912 10.6331 28.1319 10.4875Z" fill="#E1E2E2"/>
                    <path d="M29.6798 9.46875C29.9585 9.54077 29.9585 9.54077 30.2428 9.61425C30.1963 9.80632 30.1499 9.99838 30.102 10.1963C29.9162 10.1483 29.7305 10.1002 29.5391 10.0508C29.5855 9.8587 29.632 9.66663 29.6798 9.46875Z" fill="#C5C5C5"/>
                    <path d="M28.6952 7.86853C28.8345 7.86853 28.9738 7.86853 29.1174 7.86853C29.1638 8.15663 29.2103 8.44472 29.2581 8.74155C29.0259 8.69354 28.7937 8.64552 28.5544 8.59605C28.6009 8.35597 28.6473 8.11589 28.6952 7.86853Z" fill="#676969"/>
                    <path d="M27.9913 7.72363C28.27 7.72363 28.5487 7.72363 28.8358 7.72363C28.6598 8.01464 28.6598 8.01464 28.4135 8.30565C28.2278 8.30565 28.042 8.30565 27.8506 8.30565C27.897 8.11358 27.9435 7.92152 27.9913 7.72363Z" fill="#E1E2E2"/>
                    <path d="M46.9902 14.9985C47.2225 14.9985 47.4547 14.9985 47.6939 14.9985C47.6939 15.1906 47.6939 15.3827 47.6939 15.5805C47.4617 15.5805 47.2295 15.5805 46.9902 15.5805C46.9902 15.3885 46.9902 15.1964 46.9902 14.9985Z" fill="#5F5F5F"/>
                    <path d="M46.9912 3.21204C47.2234 3.21204 47.4556 3.21204 47.6949 3.21204C47.6949 3.4041 47.6949 3.59617 47.6949 3.79405C47.4627 3.79405 47.2305 3.79405 46.9912 3.79405C46.9912 3.60199 46.9912 3.40992 46.9912 3.21204Z" fill="#5E5E5E"/>
                    <path d="M3.36167 3.35791C3.45456 3.50196 3.54745 3.64601 3.64315 3.79442C3.44963 4.15818 3.44963 4.15818 3.22093 4.52194C3.12804 4.52194 3.03516 4.52194 2.93945 4.52194C3.04501 3.68529 3.04501 3.68529 3.36167 3.35791Z" fill="#BEBEBE"/>
                    <path d="M53.1837 14.707C53.2302 14.8031 53.2766 14.8991 53.3244 14.998C53.6031 14.998 53.8818 14.998 54.1689 14.998C54.2153 15.1421 54.2618 15.2861 54.3096 15.4345C53.6826 15.2905 53.6826 15.2905 53.043 15.1435C53.0894 14.9995 53.1359 14.8554 53.1837 14.707Z" fill="#C9C9C9"/>
                    <path d="M11.9479 14.9978C11.8551 15.1899 11.7622 15.3819 11.6665 15.5798C11.4807 15.5798 11.2949 15.5798 11.1035 15.5798C11.1035 15.4358 11.1035 15.2917 11.1035 15.1433C11.5257 14.9978 11.5257 14.9978 11.9479 14.9978Z" fill="#7E7E7E"/>
                    <path d="M3.50316 3.79443C3.59605 3.79443 3.68893 3.79443 3.78464 3.79443C3.78464 4.03451 3.78464 4.2746 3.78464 4.52195C3.59886 4.52195 3.41308 4.52195 3.22168 4.52195C3.34483 3.95813 3.34483 3.95813 3.50316 3.79443Z" fill="#E4E4E4"/>
                </g>
                <defs>
                    <clipPath id="clip0_1507_7323">
                    <rect width="55.8734" height="17.4604" fill="white" transform="translate(0.125 0.593262)"/>
                    </clipPath>
                </defs>
            </svg>
        )


            const handleClearPickUp = () => {
                setpickUp(null);
                setpickUpDetail(null);
                setPickupInputValue('');
                setFilteredLocations(locations);
                setIsSelectingDropOff(false);
                setSelectedLocation(null);
                setShowLocationList(true)
            };

            const handleClearPickUpAndShowTabs = () => {
                setShowLocationList(false)
            };

            const handleClearDropOff = () => {
                setDropOff(null);
                setDropoffInputValue('');
                if (pickUp) {
                    const validDropOffPoints = locations.filter((location) =>
                        pickUp.dropPoints.some(dp => dp.name === location.name)
                    );
                    setFilteredLocations(validDropOffPoints);
                    setIsSelectingDropOff(true);
                } else {
                    setFilteredLocations(locations);
                    setIsSelectingDropOff(false);
                }
                setSelectedLocation(null);
            };

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

            const handleInputFocus = (isDropOff = false) => {
                setInputFocused(true);
                setShowLocationList(true);
                setIsSelectingDropOff(isDropOff);
            };
          
            const handleInputBlur = () => {
                setInputFocused(false);
                // Don't hide the list here - let the click outside handler manage it
                
            };

          const handleKeyPress = (event : any) => {
            if (event.key === 'Enter') {
              setInputFocused(false);
              // console.log(inputFocused)
            }
          };

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
              <nav className='flex items-center justify-space px-8 h-14 border-b border-black/10 w-full'>
                <nav className='flex items-center px-2 py-1 gap-2 rounded w-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                      <path d="M12.8333 5.47002V2.82169C12.8333 1.99919 12.46 1.66669 11.5325 1.66669H9.17583C8.24833 1.66669 7.875 1.99919 7.875 2.82169V5.46419C7.875 6.29252 8.24833 6.61919 9.17583 6.61919H11.5325C12.46 6.62502 12.8333 6.29252 12.8333 5.47002Z" fill="black"/>
                      <path d="M12.8333 12.0325V9.67583C12.8333 8.74833 12.46 8.375 11.5325 8.375H9.17583C8.24833 8.375 7.875 8.74833 7.875 9.67583V12.0325C7.875 12.96 8.24833 13.3333 9.17583 13.3333H11.5325C12.46 13.3333 12.8333 12.96 12.8333 12.0325Z" fill="black"/>
                      <path d="M6.12501 5.47002V2.82169C6.12501 1.99919 5.75167 1.66669 4.82417 1.66669H2.46751C1.54001 1.66669 1.16667 1.99919 1.16667 2.82169V5.46419C1.16667 6.29252 1.54001 6.61919 2.46751 6.61919H4.82417C5.75167 6.62502 6.12501 6.29252 6.12501 5.47002Z" fill="black"/>
                      <path d="M6.12501 12.0325V9.67583C6.12501 8.74833 5.75167 8.375 4.82417 8.375H2.46751C1.54001 8.375 1.16667 8.74833 1.16667 9.67583V12.0325C1.16667 12.96 1.54001 13.3333 2.46751 13.3333H4.82417C5.75167 13.3333 6.12501 12.96 6.12501 12.0325Z" fill="black"/>
                    </svg>
                    <p className='text-black text-sm font-normal' >Dashboard</p>
                  </nav>


                    <aside className='flex items-center gap-4 justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path d="M19.3399 14.99L18.3399 13.33C18.1299 12.96 17.9399 12.26 17.9399 11.85V9.32C17.9399 6.97 16.5599 4.94 14.5699 3.99C14.0499 3.07 13.0899 2.5 11.9899 2.5C10.8999 2.5 9.91994 3.09 9.39994 4.02C7.44994 4.99 6.09994 7 6.09994 9.32V11.85C6.09994 12.26 5.90994 12.96 5.69994 13.32L4.68994 14.99C4.28994 15.66 4.19994 16.4 4.44994 17.08C4.68994 17.75 5.25994 18.27 5.99994 18.52C7.93994 19.18 9.97994 19.5 12.0199 19.5C14.0599 19.5 16.0999 19.18 18.0399 18.53C18.7399 18.3 19.2799 17.77 19.5399 17.08C19.7999 16.39 19.7299 15.63 19.3399 14.99Z" fill="black" fill-opacity="0.5"/>
                        <path d="M14.8301 20.51C14.4101 21.67 13.3001 22.5 12.0001 22.5C11.2101 22.5 10.4301 22.18 9.88005 21.61C9.56005 21.31 9.32005 20.91 9.18005 20.5C9.31005 20.52 9.44005 20.53 9.58005 20.55C9.81005 20.58 10.0501 20.61 10.2901 20.63C10.8601 20.68 11.4401 20.71 12.0201 20.71C12.5901 20.71 13.1601 20.68 13.7201 20.63C13.9301 20.61 14.1401 20.6 14.3401 20.57C14.5001 20.55 14.6601 20.53 14.8301 20.51Z" fill="black" fill-opacity="0.5"/>
                      </svg>

                      <div className='flex items-center gap-8'>
                          <div className='flex items-center gap-2 '>
                              <div className="w-6 h-6 p-1 bg-green-600 rounded-[40px] inline-flex flex-col justify-center items-center gap-2.5">
                                  <div className="justify-center text-white text-xs font-bold">E</div>
                              </div>
                              <p className='text-black/80 text-xs'>Essandoh</p>
                          </div>

                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M8 10.5C9.10457 10.5 10 9.60457 10 8.5C10 7.39543 9.10457 6.5 8 6.5C6.89543 6.5 6 7.39543 6 8.5C6 9.60457 6.89543 10.5 8 10.5Z" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.33337 9.08667V7.91333C1.33337 7.22 1.90004 6.64667 2.60004 6.64667C3.80671 6.64667 4.30004 5.79333 3.69337 4.74667C3.34671 4.14667 3.55337 3.36667 4.16004 3.02L5.31337 2.36C5.84004 2.04666 6.52004 2.23333 6.83337 2.76L6.90671 2.88666C7.50671 3.93333 8.49337 3.93333 9.10004 2.88666L9.17337 2.76C9.48671 2.23333 10.1667 2.04666 10.6934 2.36L11.8467 3.02C12.4534 3.36667 12.66 4.14667 12.3134 4.74667C11.7067 5.79333 12.2 6.64667 13.4067 6.64667C14.1 6.64667 14.6734 7.21333 14.6734 7.91333V9.08667C14.6734 9.78 14.1067 10.3533 13.4067 10.3533C12.2 10.3533 11.7067 11.2067 12.3134 12.2533C12.66 12.86 12.4534 13.6333 11.8467 13.98L10.6934 14.64C10.1667 14.9533 9.48671 14.7667 9.17337 14.24L9.10004 14.1133C8.50004 13.0667 7.51337 13.0667 6.90671 14.1133L6.83337 14.24C6.52004 14.7667 5.84004 14.9533 5.31337 14.64L4.16004 13.98C3.55337 13.6333 3.34671 12.8533 3.69337 12.2533C4.30004 11.2067 3.80671 10.3533 2.60004 10.3533C1.90004 10.3533 1.33337 9.78 1.33337 9.08667Z" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          
                      </div>
              </aside>
              </nav>

              <main className='flex'>

                <section className='w-[850px] h-190 bg-black/60'>

                <MapGL 
                //    locations={locations}
                  pickUp={pickUp}
                  // setPickUp={setPickUp}
                  dropOff={dropOff}
                  // setDropOff={setDropOff}
                  // isSelectingDropOff={isSelectingDropOff}
                  // setIsSelectingDropOff={setIsSelectingDropOff}
                /> 

                </section>

                <aside className='flex flex-col py-4 gap-4 w-90'>
                <header className='text-base font-bold px-4 border-b pb-4 border-black/10 w-[100%] items-start text-left'>Activity Feed</header>


                <div className="flex flex-col gap-3 p-3 rounded-2xl bg-gray-50 items-start mx-3 w-80">
                    <div className="flex flex-col gap-2 items-start w-full">
                        <p className="text-[14px] text-[rgba(0,0,0,0.5)]">Starting Point</p>

                        <div className="flex items-center gap-2 w-full">
                        <div
                            className={`
                            w-10 h-8               
                            flex items-center justify-center  
                            rounded-full           
                            border border-dashed    
                            ${pickUp ? 'border-black bg-black' : 'border-black/80 bg-white'}
                            `}
                        >
                            {pickUp ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                d="M20.6201 8.45C19.5701 3.83 15.5401 1.75 12.0001 1.75C12.0001 1.75 12.0001 1.75 11.9901 1.75C8.4601 1.75 4.4201 3.82 3.3701 8.44C2.2001 13.6 5.3601 17.97 8.2201 20.72C9.2801 21.74 10.6401 22.25 12.0001 22.25C13.3601 22.25 14.7201 21.74 15.7701 20.72C18.6301 17.97 21.7901 13.61 20.6201 8.45ZM12.0001 13.46C10.2601 13.46 8.8501 12.05 8.8501 10.31C8.8501 8.57 10.2601 7.16 12.0001 7.16C13.7401 7.16 15.1501 8.57 15.1501 10.31C15.1501 12.05 13.7401 13.46 12.0001 13.46Z"
                                fill="white"
                                fill-opacity="1"
                                />
                            </svg>
                            ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                d="M20.6201 8.45C19.5701 3.83 15.5401 1.75 12.0001 1.75C12.0001 1.75 12.0001 1.75 11.9901 1.75C8.4601 1.75 4.4201 3.82 3.3701 8.44C2.2001 13.6 5.3601 17.97 8.2201 20.72C9.2801 21.74 10.6401 22.25 12.0001 22.25C13.3601 22.25 14.7201 21.74 15.7701 20.72C18.6301 17.97 21.7901 13.61 20.6201 8.45ZM12.0001 13.46C10.2601 13.46 8.8501 12.05 8.8501 10.31C8.8501 8.57 10.2601 7.16 12.0001 7.16C13.7401 7.16 15.1501 8.57 15.1501 10.31C15.1501 12.05 13.7401 13.46 12.0001 13.46Z"
                                fill="black"
                                fill-opacity="0.6"
                                />
                            </svg>
                            )}
                        </div>

                        <div
                            className={`flex px-3 py-2 gap-2 bg-white rounded-[16px] items-center border ${
                            pickUp ? 'border-black/80' : 'border-black/40'
                            } w-full`}
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            >
                            <path
                                d="M20.031 20.79C20.491 21.25 21.201 20.54 20.741 20.09L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z"
                                fill="black"
                                fillOpacity="0.6"
                            />
                            </svg>
                          <input
                                type="text"
                                placeholder="Select Pickup Bus Stop"
                                value={pickupInputValue}
                                onChange={(e) => handleSearch(e, 'pickup')}
                                  onFocus={() => {
                                        handleInputFocus(false); // for pickup
                                    }}
                                onBlur={handleInputBlur}
                                onKeyPress={handleKeyPress}
                                className={`flex-1 border-none bg-transparent text-[14px] ${pickUp ? 'text-black' : 'text-black/60'} outline-none p-0 transition-all duration-300 touch-manipulation`}
                            />

                            {pickUp ? (
                                <svg
                                    onClick={handleClearPickUp}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                    d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z"
                                    fill="#1D1B20"
                                    />
                                </svg>
                                ) : (
                                <svg
                                    onClick={handleClearPickUpAndShowTabs}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                    d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z"
                                    fill="rgba(0,0,0,0.4)"
                                    />
                                </svg>
                                )}
                        </div>
                        </div>
                    </div>

                      <div style={{
                            width : 0.1,
                            height : 20,
                            border : pickUp? '1px dashed rgba(0,0,0,1)' : '1px dashed rgba(0,0,0,0.2)',
                            position : 'relative',
                            left : '6%',
                            display : pickUp ? 'flex' : 'none' ,
                            // display : inputFocused? 'none' : 'block'
                            
                        }}></div>

                    
                        <div style={{
                            display : pickUp ? 'flex' : 'none' ,
                            flexDirection : 'column',
                            gap : 8
                        }}>
                            <p style={{
                            margin : 0,
                            fontSize : 14,
                            color : 'rgba(0,0,0,0.5)',
                            textAlign : 'left'
                            }} >Drop Off Point</p>

                            <div style={{
                            display : 'flex',
                            alignItems : 'center',
                            gap : 8,
                            // justifyContent : 'space-between'
                            }}>

                            <div style={{
                                width : 40,
                                height : 40,
                                display : 'flex',
                                alignItems : 'center',
                                borderRadius : 50,
                                border : '1px dashed rgba(0,0,0,0.1)',
                                justifyContent : 'center',
                                backgroundColor: '#ffff',
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M20.6202 8.7C19.5802 4.07 15.5402 2 12.0002 2C12.0002 2 12.0002 2 11.9902 2C8.46024 2 4.43024 4.07 3.38024 8.69C2.20024 13.85 5.36024 18.22 8.22024 20.98C9.28024 22 10.6402 22.51 12.0002 22.51C13.3602 22.51 14.7202 22 15.7702 20.98C18.6302 18.22 21.7902 13.86 20.6202 8.7ZM15.2802 9.53L11.2802 13.53C11.1302 13.68 10.9402 13.75 10.7502 13.75C10.5602 13.75 10.3702 13.68 10.2202 13.53L8.72024 12.03C8.43024 11.74 8.43024 11.26 8.72024 10.97C9.01024 10.68 9.49024 10.68 9.78024 10.97L10.7502 11.94L14.2202 8.47C14.5102 8.18 14.9902 8.18 15.2802 8.47C15.5702 8.76 15.5702 9.24 15.2802 9.53Z" fill="black" fill-opacity="0.6"/>
                                </svg>
                            </div>

                            <div style={{
                                display: 'flex',
                                paddingInline: 16,
                                paddingBlock: 12,
                                gap: 8,
                                backgroundColor: '#fff',
                                borderRadius: 16,
                                alignItems: 'center',
                                border: '1px solid rgba(0,0,0,0.1)',
                                width : '90%'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20.031 20.79C20.491 21.25 21.201 20.54 20.741 20.09L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" />
                                </svg>
                                <input
                                type="text"
                                placeholder="Select Drop Off Bus Stop"
                                value={dropOff?.name}
                                onChange={dropoffInputValue || searchQuery}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    fontSize: 14,
                                    color: dropOff? 'black'  : 'rgba(0,0,0,0.6)',
                                    outline: 'none',
                                    padding: 0
                                }}
                                />
                                { dropOff ? 
                                <svg onClick={handleClearDropOff} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill="#1D1B20"/>
                                </svg>
                                : 
                                <svg onClick={handleClearPickUp} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill="rgba(0,0,0,0.4)"/>
                                </svg>
                                }
                                </div>  

                            </div>
                        </div>
                </div>

                {/* <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-black/10"></div>      */}
                

               { showLocationList    && (
                    <div style={{ flex: '1', minWidth: '100px', maxWidth: '500px', maxHeight: "100px" }}>
                    <LocationList 
                        selectedLocation={selectedLocation}
                        locations={locations}
                        isSelectingDropOff={isSelectingDropOff}
                        handleDropOffPointClick={handleDropOffPointClick}
                        handleStartPointClick={handleStartPointClick} searchQuery={''} isMobile={false}                    
                    />
                    </div>
               )}
                


                { !showLocationList  && (
                    <section className='flex flex-col gap-4'>
                      <header className='flex items-center w-full justify-between border-b border-black/10'>
                        <button 
                            className={`flex items-center w-full justify-center pb-2 text-sm font-normal ${activeTab === 'busStops' ? 'text-green-600 border-b-2 border-green-600' : 'text-black/50 hover:text-black/80 '}`}
                            onClick={() => setActiveTab('busStops')}
                        >
                            Bus Stops
                        </button>
                        <button 
                            className={`flex items-center w-full justify-center pb-2 text-sm font-normal ${activeTab === 'buses' ? 'text-green-600 border-b-2 border-green-600' : 'text-black/50 hover:text-black/80 '}`}
                            onClick={() => setActiveTab('buses')}
                        >
                            Buses
                        </button>
                      </header>

                      {/* Bus Stops */}
                     {activeTab === 'busStops' && (
                        <main className="flex flex-col gap-4 items-start justify-start px-5 w-full overflow-y-auto md:max-h-[calc(90vh-220px)]">
                            <p className="text-black text-base font-bold">Bus Stop Overview</p>

                            <section className="flex flex-col gap-2 w-full">
                            {filteredBusStops.map((stop) => (
                                <BusStopCard
                                key={stop.id}
                                name={stop.name}
                                color={stop.color}
                                dotColor={stop.dotColor}
                                waiting={stop.waiting}
                                />
                            ))}
                            </section>
                        </main>
                        )}




                      {/* Buses*/}
                      { activeTab == 'buses' && (
                        <main className='flex flex-col gap-2 items-start justify-start px-5 w-full'>
                          <p className='text-black text-base font-bold'>Active Buses</p>

                          <section className='flex flex-col gap-4 w-full'>
                            
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col'>
                                    <p className='text-black text-xs'>Brunei</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Start</p>
                                        <p className='text-[10px] font-normal'>8:31 AM</p>
                                    </div>
                                </div>

                            <div className="w-9 h-0.5 relative bg-green-600 rounded-3xl" />

                            <div className='flex gap-1 flex-col items-center mb-6'>
                                <p className='text-[8px] pl-1.5 pr-2 py-px bg-red-50 rounded-2xl border text-red-900'>🚫 Full</p>
                                <BusIcon/>
                            </div>

                            <div className="w-8 h-1 relative bg-gray-300 rounded-3xl" />

                             <div className='flex flex-col'>
                                    <p className='text-black text-xs'>KSB</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Arriving</p>
                                        <p className='text-[10px] font-normal'>8:40 AM</p>
                                    </div>
                                </div>

                            </div>

                            <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-black/10"></div>

                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col items-center'>
                                    <p className='text-black text-xs'>Commerical Area</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Start</p>
                                        <p className='text-[10px] font-normal'>8:31 AM</p>
                                    </div>
                                </div>

                            <div className="w-9 h-0.5 relative bg-green-600 rounded-3xl" />

                            <div className='flex gap-1 flex-col items-center mb-6'>
                                <p className='text-[8px] pl-1.5 pr-2 py-px bg-red-50 rounded-2xl border text-red-900'>🚫 Full</p>
                                <BusIcon/>
                            </div>

                            <div className="w-8 h-1 relative bg-gray-300 rounded-3xl" />

                             <div className='flex flex-col'>
                                    <p className='text-black text-xs'>KSB</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Arriving</p>
                                        <p className='text-[10px] font-normal'>8:40 AM</p>
                                    </div>
                                </div>

                            </div>

                            <div className="self-stretch h-0  outline-1 outline-offset-[-0.50px] outline-black/10"></div>
                                              <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col'>
                                    <p className='text-black text-xs'>Main Library</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Start</p>
                                        <p className='text-[10px] font-normal'>8:31 AM</p>
                                    </div>
                                </div>

                            <div className="w-9 h-0.5 relative bg-green-600 rounded-3xl" />

                            <div className='flex gap-1 flex-col items-center mb-6'>
                                <p className='text-[8px] pl-1.5 pr-2 py-px bg-red-50 rounded-2xl border text-red-900'>🚫 Full</p>
                                <BusIcon/>
                            </div>

                            <div className="w-8 h-1 relative bg-gray-300 rounded-3xl" />

                             <div className='flex flex-col'>
                                    <p className='text-black text-xs'>Brueni</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Arriving</p>
                                        <p className='text-[10px] font-normal'>8:40 AM</p>
                                    </div>
                                </div>

                            </div>

                            <div className="self-stretch h-0  outline-1 outline-offset-[-0.50px] outline-black/10"></div>

                                              <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col'>
                                    <p className='text-black text-xs'>Main Library</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Start</p>
                                        <p className='text-[10px] font-normal'>8:31 AM</p>
                                    </div>
                                </div>

                            <div className="w-9 h-0.5 relative bg-green-600 rounded-3xl" />

                            <div className='flex gap-1 flex-col items-center mb-6'>
                                <p className='text-[8px] pl-1.5 pr-2 py-px bg-red-50 rounded-2xl border text-red-900'>🚫 Full</p>
                                <BusIcon/>
                            </div>

                            <div className="w-8 h-1 relative bg-gray-300 rounded-3xl" />

                             <div className='flex flex-col'>
                                    <p className='text-black text-xs'>Brueni</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Arriving</p>
                                        <p className='text-[10px] font-normal'>8:40 AM</p>
                                    </div>
                                </div>

                            </div>

                            <div className="self-stretch h-0  outline-1 outline-offset-[-0.50px] outline-black/10"></div>
                                              <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col'>
                                    <p className='text-black text-xs'>Main Library</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Start</p>
                                        <p className='text-[10px] font-normal'>8:31 AM</p>
                                    </div>
                                </div>

                            <div className="w-9 h-0.5 relative bg-green-600 rounded-3xl" />

                            <div className='flex gap-1 flex-col items-center mb-6'>
                                <p className='text-[8px] pl-1.5 pr-2 py-px bg-red-50 rounded-2xl border text-red-900'>🚫 Full</p>
                                <BusIcon/>
                            </div>

                            <div className="w-8 h-1 relative bg-gray-300 rounded-3xl" />

                             <div className='flex flex-col'>
                                    <p className='text-black text-xs'>Brueni</p>
                                    <div className='flex gap-2'>
                                        <p className='text-black/50 text-[10px] font-normal'>Arriving</p>
                                        <p className='text-[10px] font-normal'>8:40 AM</p>
                                    </div>
                                </div>

                            </div>

                            <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-black/10"></div>

                          </section>
                      </main> 

                      )

                      }          
                     </section>
                )}

                </aside>
              </main>
          </section>
      </main>
    </>
  )
}

export default App
