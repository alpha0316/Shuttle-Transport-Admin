import React, { useState } from 'react';
import Dashboard from './screens/Dashboard';
import Drivers from './screens/Drivers';
import Busstops from './screens/Busstops';
import Profile from './screens/Profile';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'drivers': return <Drivers />;
      case 'busstops': return <Busstops />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Navigation Tabs */}
      {/* <nav className="flex space-x-4 bg-white p-4 shadow-md">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded ${activeTab==='dashboard'?'bg-blue-500 text-white':'bg-gray-200'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('drivers')} className={`px-4 py-2 rounded ${activeTab==='drivers'?'bg-blue-500 text-white':'bg-gray-200'}`}>Drivers</button>
        <button onClick={() => setActiveTab('busstops')} className={`px-4 py-2 rounded ${activeTab==='busstops'?'bg-blue-500 text-white':'bg-gray-200'}`}>Bus Stops</button>
        <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded ${activeTab==='profile'?'bg-blue-500 text-white':'bg-gray-200'}`}>Profile</button>
      </nav> */}

        <aside className='w-60 h-[748px] border-r border-black/10 flex flex-col gap-6'>
              <nav className='border-b border-black/10 flex items-center justify-between py-2 px-4'>
                  <div className='flex gap-2 items-center'>
                      <div className="w-8 h-8 p-1.5 bg-green-600 rounded-lg inline-flex flex-col justify-center items-center gap-2.5">
                          <div className="justify-center text-white text-base font-bold ">S</div>
                      </div>
                      <div className='flex items-center justify-center flex-col'>
                          <div className="justify-center"><span className="text-green-600 text-sm font-bold p-0">Shuttle</span><span className="text-black/50 text-sm font-bold ">App</span></div>
                          <div className="justify-center text-black/50 text-[10px] font-normal p-0">Transport Union</div>
                      </div>
                  </div>

                  <nav className='flex flex-col items-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                        <path d="M9.96 8.02501L6.7 4.76501C6.315 4.38001 5.685 4.38001 5.3 4.76501L2.04 8.02501" stroke="black" stroke-opacity="0.5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M8.96 0.974976L5.7 4.23498C5.315 4.61998 4.685 4.61998 4.3 4.23498L1.04 0.974976" stroke="black" stroke-opacity="0.5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </nav>
              </nav>

              <section className='w-60 h-full items-start flex gap-3 px-4 flex-col'>

                   <button 
                          onClick={() => setActiveTab('dashboard')} 
                          className={`flex items-center gap-3 px-2 py-1 rounded w-full ${
                            activeTab === 'dashboard' 
                              ? 'bg-zinc-100 text-black' 
                              : 'bg-white text-black/50'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path 
                              d="M12.8333 5.47002V2.82169C12.8333 1.99919 12.46 1.66669 11.5325 1.66669H9.17583C8.24833 1.66669 7.875 1.99919 7.875 2.82169V5.46419C7.875 6.29252 8.24833 6.61919 9.17583 6.61919H11.5325C12.46 6.62502 12.8333 6.29252 12.8333 5.47002Z" 
                              fill={activeTab === 'dashboard' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                            />
                            <path 
                              d="M12.8333 12.0325V9.67583C12.8333 8.74833 12.46 8.375 11.5325 8.375H9.17583C8.24833 8.375 7.875 8.74833 7.875 9.67583V12.0325C7.875 12.96 8.24833 13.3333 9.17583 13.3333H11.5325C12.46 13.3333 12.8333 12.96 12.8333 12.0325Z" 
                              fill={activeTab === 'dashboard' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                            />
                            <path 
                              d="M6.12501 5.47002V2.82169C6.12501 1.99919 5.75167 1.66669 4.82417 1.66669H2.46751C1.54001 1.66669 1.16667 1.99919 1.16667 2.82169V5.46419C1.16667 6.29252 1.54001 6.61919 2.46751 6.61919H4.82417C5.75167 6.62502 6.12501 6.29252 6.12501 5.47002Z" 
                              fill={activeTab === 'dashboard' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                            />
                            <path 
                              d="M6.12501 12.0325V9.67583C6.12501 8.74833 5.75167 8.375 4.82417 8.375H2.46751C1.54001 8.375 1.16667 8.74833 1.16667 9.67583V12.0325C1.16667 12.96 1.54001 13.3333 2.46751 13.3333H4.82417C5.75167 13.3333 6.12501 12.96 6.12501 12.0325Z" 
                              fill={activeTab === 'dashboard' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                            />
                          </svg>
                          <p className={`text-sm font-normal ${activeTab === 'dashboard' ? 'text-black' : 'text-black/50'}`}>
                            Dashboard
                          </p>
                   </button>

                     <button 
                        onClick={() => setActiveTab('drivers')} 
                        className={`flex items-center gap-3 px-2 py-1 rounded w-full ${
                          activeTab === 'drivers' 
                            ? 'bg-zinc-100 text-black' 
                            : 'bg-white text-black/50'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                          <path 
                            d="M13.1994 2.69986C13.1889 2.57998 13.1058 2.48198 13.0156 2.48198C12.9255 2.48198 12.8516 2.40761 12.8516 2.31792C12.8516 2.22823 12.7544 2.17092 12.6359 2.19105L11.9919 2.30042C11.8624 1.51598 11.6681 1.02555 11.375 0.732422C10.5 -0.142578 3.5 -0.142578 2.625 0.732422C2.33188 1.02555 2.13763 1.51555 2.00813 2.29998L1.36413 2.19061C1.246 2.17048 1.14844 2.2278 1.14844 2.31748C1.14844 2.40717 1.07406 2.48198 0.984376 2.48198C0.894688 2.48198 0.811126 2.58042 0.800626 2.69986L0.595001 4.91623C0.591813 4.94395 0.59459 4.97202 0.603148 4.99858C0.611706 5.02513 0.625845 5.04954 0.644617 5.07018C0.663389 5.09082 0.686358 5.1072 0.711984 5.11822C0.737609 5.12925 0.765297 5.13467 0.793188 5.13411H1.25781C1.37813 5.13411 1.48531 5.03611 1.49669 4.91623L1.66906 3.06473C1.67136 3.03677 1.67949 3.0096 1.69291 2.98496C1.70633 2.96032 1.72476 2.93876 1.747 2.92166C1.76925 2.90457 1.79483 2.89231 1.82209 2.88568C1.84935 2.87905 1.8777 2.87820 1.90531 2.88317L1.92894 2.88755C1.7535 4.48530 1.75 12.4859 1.75 12.4859C1.75 12.7282 1.81125 12.9234 1.88694 12.9234H3.00781C3.0835 12.9234 3.14475 12.7282 3.14475 12.4859V11.6581C5.17606 11.9644 8.82438 11.9644 10.8557 11.6581V12.485C10.8557 12.7269 10.9169 12.9225 10.9922 12.9225H12.1131C12.1883 12.9225 12.2496 12.7269 12.2496 12.485C12.2496 12.485 12.2461 4.48617 12.0711 2.88755L12.0947 2.88317C12.1223 2.87820 12.1507 2.87906 12.178 2.88572C12.2053 2.89237 12.2309 2.90467 12.2531 2.92181C12.2754 2.93896 12.2938 2.96057 12.3072 2.98526C12.3206 3.00995 12.3287 3.03717 12.3309 3.06517L12.5029 4.91580C12.5134 5.03611 12.621 5.13455 12.7413 5.13455H13.2059C13.2339 5.13497 13.2616 5.12943 13.2872 5.11831C13.3129 5.10719 13.3359 5.09073 13.3547 5.07004C13.3735 5.04935 13.3876 5.02489 13.3962 4.99829C13.4048 4.97170 13.4077 4.94358 13.4046 4.91580L13.1989 2.69942L13.1994 2.69986ZM3.11763 9.72436C3.01142 9.72795 2.90558 9.71014 2.80640 9.67199C2.70723 9.63383 2.61673 9.57612 2.54032 9.50228C2.46390 9.42844 2.40311 9.33999 2.36158 9.24218C2.32005 9.14437 2.29861 9.03920 2.29855 8.93294C2.29849 8.82667 2.31981 8.72148 2.36124 8.62363C2.40266 8.52577 2.46335 8.43725 2.53969 8.36332C2.61602 8.28940 2.70645 8.23159 2.80559 8.19333C2.90472 8.15507 3.01054 8.13714 3.11675 8.14061C3.32114 8.14882 3.51443 8.23576 3.65618 8.38323C3.79793 8.53071 3.87715 8.72729 3.87726 8.93185C3.87738 9.13640 3.79837 9.33307 3.65679 9.48070C3.51520 9.62833 3.32200 9.71549 3.11763 9.72392V9.72436ZM2.20631 6.48992C2.25006 3.23711 2.40319 1.57330 2.93475 1.04130C3.14781 0.828672 4.58719 0.513234 7.00044 0.513234C9.41369 0.513234 10.8531 0.828234 11.0661 1.04130C11.5986 1.57330 11.7504 3.23755 11.7946 6.49036C11.2805 6.69730 9.64906 6.93880 7.00044 6.93880C4.35356 6.93880 2.72256 6.69817 2.20631 6.48992ZM10.0901 8.93205C10.0968 8.72635 10.1833 8.53135 10.3312 8.38822C10.4791 8.24508 10.6768 8.16504 10.8826 8.16498C11.0884 8.16492 11.2862 8.24486 11.4341 8.38791C11.5821 8.53096 11.6687 8.72592 11.6756 8.93161C11.6756 9.14186 11.5920 9.34350 11.4434 9.49217C11.2947 9.64084 11.0931 9.72436 10.8828 9.72436C10.6726 9.72436 10.4709 9.64084 10.3223 9.49217C10.1736 9.34350 10.0901 9.14230 10.0901 8.93205Z" 
                            fill={activeTab === 'drivers' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                          />
                        </svg>
                        <p className={`text-sm font-normal ${activeTab === 'drivers' ? 'text-black' : 'text-black/50'}`}>
                          Buses
                        </p>
                      </button>

                   <button 
                      onClick={() => setActiveTab('busstops')}  
                      className={`flex items-center gap-3 px-2 py-1 rounded w-full ${
                        activeTab === 'busstops' 
                          ? 'bg-zinc-100 text-black' 
                          : 'bg-white text-black/50'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                        <path 
                          d="M13.6667 2.16669V8.16669C13.6667 8.64002 13.4133 9.07335 13 9.31335V10.3334C13 10.6067 12.7733 10.8334 12.5 10.8334H12.1667C11.8933 10.8334 11.6667 10.6067 11.6667 10.3334V9.50002H7V10.3334C7 10.6067 6.77334 10.8334 6.5 10.8334H6.16667C5.89334 10.8334 5.66667 10.6067 5.66667 10.3334V9.31335C5.26 9.07335 5 8.64002 5 8.16669V2.16669C5 0.166687 7 0.166687 9.33334 0.166687C11.6667 0.166687 13.6667 0.166687 13.6667 2.16669ZM7.66667 7.50002C7.66667 7.13335 7.36667 6.83335 7 6.83335C6.63334 6.83335 6.33334 7.13335 6.33334 7.50002C6.33334 7.86669 6.63334 8.16669 7 8.16669C7.36667 8.16669 7.66667 7.86669 7.66667 7.50002ZM12.3333 7.50002C12.3333 7.13335 12.0333 6.83335 11.6667 6.83335C11.3 6.83335 11 7.13335 11 7.50002C11 7.86669 11.3 8.16669 11.6667 8.16669C12.0333 8.16669 12.3333 7.86669 12.3333 7.50002ZM12.3333 2.16669H6.33334V4.83335H12.3333V2.16669ZM3.66667 3.83335C3.64667 2.91335 2.88667 2.16669 1.96667 2.20002C1.52467 2.20895 1.10431 2.39305 0.79802 2.71184C0.491729 3.03063 0.324583 3.45802 0.333335 3.90002C0.342042 4.27815 0.478597 4.64218 0.720735 4.93274C0.962872 5.22331 1.29631 5.42327 1.66667 5.50002V10.8334H2.33333V5.50002C3.12 5.34002 3.66667 4.64002 3.66667 3.83335Z" 
                          fill={activeTab === 'busstops' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                        />
                      </svg>
                      <p className={`text-sm font-normal ${activeTab === 'busstops' ? 'text-black' : 'text-black/50'}`}>
                        Bus Stops
                      </p>
                    </button>

                   <button 
                      onClick={() => setActiveTab('profile')}  
                      className={`flex items-center gap-3 px-2 py-1 rounded w-full ${
                        activeTab === 'profile' 
                          ? 'bg-zinc-100 text-black' 
                          : 'bg-white text-black/50'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                        <path 
                          d="M7 7.50002C8.61083 7.50002 9.91666 6.19418 9.91666 4.58335C9.91666 2.97252 8.61083 1.66669 7 1.66669C5.38916 1.66669 4.08333 2.97252 4.08333 4.58335C4.08333 6.19418 5.38916 7.50002 7 7.50002Z" 
                          fill={activeTab === 'profile' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                        />
                        <path 
                          d="M6.99999 8.95831C4.07749 8.95831 1.69749 10.9183 1.69749 13.3333C1.69749 13.4966 1.82583 13.625 1.98916 13.625H12.0108C12.1742 13.625 12.3025 13.4966 12.3025 13.3333C12.3025 10.9183 9.92249 8.95831 6.99999 8.95831Z" 
                          fill={activeTab === 'profile' ? 'black' : 'rgba(0, 0, 0, 0.5)'}
                        />
                      </svg>
                      <p className={`text-sm font-normal ${activeTab === 'profile' ? 'text-black' : 'text-black/50'}`}>
                        Profile
                      </p>
                    </button>

              </section>

          </aside>

      {/* Tab Content */}
      <div className="">{renderTab()}</div>
    </div>
  );
};

export default App;
