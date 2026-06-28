
import { useState } from 'react';
import './../App.css'
import { UserCircle, Bell, Gear } from '@phosphor-icons/react';

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

    const [] = useState('');
    const [] = useState<Location[]>(locations);
    const [] = useState<Location | null>(null)
    const [] =  useState<Location | null>(null)
    const [] =  useState<Location | null>(null)
    const [] = useState(false)
    const [] =  useState<Location | null>(null)
    const [] = useState(false);
    const [] = useState(true)
    








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

          








  return (
    <>
      <main className='flex '>
          

          <section className='flex flex-col w-full '>
              <nav className='flex items-center justify-space px-8 h-14 border-b border-black/10 w-full'>
                <nav className='flex items-center px-2 py-1 gap-2 rounded w-full'>
                    <UserCircle size={14} color="black" weight="duotone" />
                    <p className='text-black text-sm font-normal' >Profile</p>
                  </nav>


                    <aside className='flex items-center gap-4 justify-center'>
                    <Bell size={24} color="rgba(0,0,0,0.5)" weight="duotone" />

                      <div className='flex items-center gap-8'>
                          <div className='flex items-center gap-2 '>
                              <div className="w-6 h-6 p-1 bg-green-600 rounded-[40px] inline-flex flex-col justify-center items-center gap-2.5">
                                  <div className="justify-center text-white text-xs font-bold">E</div>
                              </div>
                              <p className='text-black/80 text-xs'>Essandoh</p>
                          </div>

                          <Gear size={16} color="rgba(0,0,0,0.6)" weight="duotone" />
                          
                      </div>
              </aside>
              </nav>

              <main className='flex'>

                <section className='flex-1 min-w-0 h-[calc(100vh-56px)]'>

                </section>

              </main>

            
          </section>

      </main>
    </>
  )
}

export default App
