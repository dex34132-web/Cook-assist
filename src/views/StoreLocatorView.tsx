import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Navigation, 
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Shop {
  id: string;
  name: string;
  distance: string;
  rating: number;
  priceLevel: 'Green' | 'Yellow' | 'Red';
  address: string;
  verified: boolean;
  position: [number, number];
}

export default function StoreLocatorView({ onBack }: { onBack: () => void }) {
  const [permission, setPermission] = React.useState<'asked' | 'granted' | 'denied'>('asked');
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);
  const [shops] = React.useState<Shop[]>([
    { id: '1', name: 'Whole Foods Market', distance: '0.8 miles', rating: 4.8, priceLevel: 'Yellow', address: 'Market St, San Francisco', verified: true, position: [37.7749, -122.4194] },
    { id: '2', name: 'Trader Joe\'s', distance: '1.4 miles', rating: 4.6, priceLevel: 'Green', address: 'Green Ave, San Francisco', verified: true, position: [37.7833, -122.4167] },
    { id: '3', name: 'Bi-Rite Market', distance: '2.1 miles', rating: 4.9, priceLevel: 'Red', address: 'Luxury Blvd, San Francisco', verified: true, position: [37.7610, -122.4214] },
  ]);

  const handleGrantPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setPermission('granted');
        },
        () => {
          setPermission('denied');
        }
      );
    } else {
      setPermission('denied');
    }
  };

  if (permission === 'denied') {
    onBack();
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AnimatePresence>
        {permission === 'asked' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-500">
                <MapPin size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-slate-900">Allow Location?</h3>
                <p className="text-slate-500 font-medium tracking-tight">To find the best ingredients at nearby stores, we need your precise location. This enables real-time grocery tracking.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleGrantPermission}
                  className="w-full py-4 gradient-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  Yes, Allow Access
                </button>
                <button 
                  onClick={() => setPermission('denied')}
                  className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="space-y-2">
          <button onClick={onBack} className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 flex items-center gap-2 mb-2 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Kitchen
          </button>
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-tight">
            Ingredient <span className="text-blue-500">Locator</span>
          </h2>
          <p className="text-slate-500 font-medium italic">Verified sources for your shopping list.</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Full-width Map Section */}
        <div className="bg-slate-200 rounded-[3.5rem] h-[550px] relative overflow-hidden shadow-2xl border-4 border-white">
          {permission === 'granted' && (
            <MapContainer 
              center={userLocation || [37.7749, -122.4194]} 
              zoom={14} 
              scrollWheelZoom={false}
              className="w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
              {shops.map((shop) => (
                <Marker key={shop.id} position={shop.position}>
                  <Popup>
                    <div className="p-2 space-y-1 font-sans">
                      <h4 className="font-bold text-slate-900">{shop.name}</h4>
                      <p className="text-xs text-slate-500">{shop.address}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star size={12} fill="currentColor" /> {shop.rating}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
          
          <div className="absolute top-8 left-8 z-10 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
             <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Live Explorer: 3 Verified Stores</span>
          </div>
        </div>

        {/* Color-Coded Store Directory Section */}
        <section className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-xl border border-slate-100 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-display font-black text-slate-900">Store Directory</h3>
              <p className="text-slate-500 font-medium">Categorized by price level and accessibility</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Value
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> Premium
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-3 h-3 rounded-full bg-red-500" /> Luxury
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {shops.map((shop, i) => (
              <motion.div 
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`
                  relative group p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer overflow-hidden
                  ${shop.priceLevel === 'Green' ? 'bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200' : ''}
                  ${shop.priceLevel === 'Yellow' ? 'bg-amber-50/30 border-amber-100 hover:bg-amber-50 hover:border-amber-200' : ''}
                  ${shop.priceLevel === 'Red' ? 'bg-red-50/30 border-red-100 hover:bg-red-50 hover:border-red-200' : ''}
                `}
              >
                {/* Visual Accent */}
                <div className={`
                  absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform
                  ${shop.priceLevel === 'Green' ? 'bg-emerald-500' : ''}
                  ${shop.priceLevel === 'Yellow' ? 'bg-amber-500' : ''}
                  ${shop.priceLevel === 'Red' ? 'bg-red-500' : ''}
                `} />

                <div className="relative z-10 flex flex-col h-full space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm
                      ${shop.priceLevel === 'Green' ? 'bg-emerald-500 text-white shadow-emerald-200' : ''}
                      ${shop.priceLevel === 'Yellow' ? 'bg-amber-500 text-white shadow-amber-200' : ''}
                      ${shop.priceLevel === 'Red' ? 'bg-red-500 text-white shadow-red-200' : ''}
                    `}>
                      <Store size={28} />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5 shadow-sm">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-black text-slate-700">{shop.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-display font-black text-slate-900 group-hover:translate-x-1 transition-transform">
                      {shop.name}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={14} className="flex-shrink-0" />
                      <p className="text-xs font-medium truncate">{shop.address}</p>
                    </div>
                  </div>

                  <div className="pt-6 mt-auto flex items-center justify-between border-t border-slate-900/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Distance</span>
                      <span className="text-sm font-black text-slate-900">{shop.distance}</span>
                    </div>
                    <button className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                      ${shop.priceLevel === 'Green' ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200' : ''}
                      ${shop.priceLevel === 'Yellow' ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200' : ''}
                      ${shop.priceLevel === 'Red' ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200' : ''}
                    `}>
                      Navigate <Navigation size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
