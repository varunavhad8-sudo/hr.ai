import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Extensive Dataset for India's Top Companies
const markerData = [
  // MUMBAI CORPORATE DISTRICTS (Fort / Nariman Point / BKC)
  { id: 1, name: "Reliance Industries", city: "Mumbai (Nariman Point)", pos: [72.8231, 18.9284] },
  { id: 2, name: "TCS HQ", city: "Mumbai (Nariman Point)", pos: [72.8242, 18.9255] },
  { id: 3, name: "Tata Motors HQ", city: "Mumbai (Fort)", pos: [72.8335, 18.9322] },
  { id: 4, name: "HDFC Bank", city: "Mumbai (Worli)", pos: [72.8193, 19.0068] },
  { id: 5, name: "ICICI Bank", city: "Mumbai (BKC)", pos: [72.8681, 19.0664] },
  { id: 6, name: "L&T HQ", city: "Mumbai (Powai)", pos: [72.8942, 19.1171] },
  { id: 7, name: "Kotak Mahindra", city: "Mumbai (BKC)", pos: [72.8631, 19.0601] },
  { id: 8, name: "Axis Bank", city: "Mumbai (Worli)", pos: [72.8250, 19.0100] },
  { id: 9, name: "Godrej Group", city: "Mumbai (Vikhroli)", pos: [72.9289, 19.0945] },
  { id: 10, name: "Mahindra & Mahindra", city: "Mumbai (Worli)", pos: [72.8180, 18.9950] },

  // BENGALURU TECH HUBS
  { id: 11, name: "Infosys HQ", city: "Bengaluru (ECity)", pos: [77.6655, 12.8501] },
  { id: 12, name: "Wipro HQ", city: "Bengaluru (Sarjapur)", pos: [77.6835, 12.9129] },
  { id: 13, name: "HAL HQ", city: "Bengaluru (Old Airport Rd)", pos: [77.6485, 12.9554] },
  { id: 14, name: "Flipkart HQ", city: "Bengaluru (Bellandur)", pos: [77.6762, 12.9248] },
  { id: 15, name: "Ola Electric", city: "Bengaluru (Koramangala)", pos: [77.6212, 12.9345] },
  { id: 16, name: "Swiggy", city: "Bengaluru", pos: [77.6000, 12.9400] },
  { id: 17, name: "PhonePe", city: "Bengaluru", pos: [77.5900, 12.9000] },
  { id: 18, name: "Biocon", city: "Bengaluru", pos: [77.6700, 12.8400] },
  { id: 19, name: "Titan", city: "Bengaluru", pos: [77.6500, 12.8600] },
  { id: 20, name: "BHEL", city: "Bengaluru", pos: [77.6300, 12.8800] },

  // DELHI / NCR HUB
  { id: 21, name: "Bharti Airtel", city: "New Delhi", pos: [77.2090, 28.6139] },
  { id: 22, name: "HCL Tech", city: "Noida", pos: [77.3910, 28.5355] },
  { id: 23, name: "Maruti Suzuki", city: "Gurugram", pos: [77.0266, 28.4595] },
  { id: 24, name: "Zomato HQ", city: "Gurugram", pos: [77.0300, 28.4600] },
  { id: 25, name: "Paytm", city: "Noida", pos: [77.4000, 28.5400] },
  { id: 26, name: "NTPC", city: "New Delhi", pos: [77.2200, 28.6200] },
  { id: 27, name: "GAIL", city: "New Delhi", pos: [77.2300, 28.6300] },
  { id: 28, name: "OYO", city: "Gurugram", pos: [77.0400, 28.4700] },
  { id: 29, name: "DLF", city: "Gurugram", pos: [77.0500, 28.4800] },
  { id: 30, name: "IndiGo", city: "Gurugram", pos: [77.0600, 28.4900] },

  // PUNE HUB
  { id: 31, name: "Serum Institute", city: "Pune", pos: [73.9200, 18.5100] },
  { id: 32, name: "Persistent", city: "Pune", pos: [73.8000, 18.5500] },
  { id: 33, name: "Tech Mahindra", city: "Pune", pos: [73.8200, 18.5600] },
  { id: 34, name: "Bajaj Auto", city: "Pune", pos: [73.8400, 18.5700] },
  { id: 35, name: "Force Motors", city: "Pune", pos: [73.8600, 18.5800] },

  // HYDERABAD HUB
  { id: 36, name: "Dr. Reddy's", city: "Hyderabad", pos: [78.4400, 17.4300] },
  { id: 37, name: "Aurobindo", city: "Hyderabad", pos: [78.4500, 17.4400] },
  { id: 38, name: "GMR Group", city: "Hyderabad", pos: [78.4600, 17.4500] },
  { id: 39, name: "Divi's Labs", city: "Hyderabad", pos: [78.4700, 17.4600] },

  // CHENNAI HUB
  { id: 40, name: "Zoho Corp", city: "Chennai", pos: [80.2000, 12.9000] },
  { id: 41, name: "Freshworks", city: "Chennai", pos: [80.2100, 12.9100] },
  { id: 42, name: "Ashok Leyland", city: "Chennai", pos: [80.2200, 12.9200] },
  { id: 43, name: "TVS Motor", city: "Chennai", pos: [80.2300, 12.9300] },
  { id: 44, name: "MRF", city: "Chennai", pos: [80.2400, 12.9400] },

  // OTHERS
  { id: 45, name: "Adani Group", city: "Ahmedabad", pos: [72.5714, 23.0225] },
  { id: 46, name: "ITC", city: "Kolkata", pos: [88.3639, 22.5726] },
  { id: 47, name: "Coal India", city: "Kolkata", pos: [88.3700, 22.5800] },
  { id: 48, name: "Ambuja Cement", city: "Ahmedabad", pos: [72.5800, 23.0300] },
  { id: 49, name: "Vedanta", city: "Goa", pos: [73.8500, 15.4900] },
  { id: 50, name: "Hero MotoCorp", city: "Gurugram", pos: [77.0700, 28.5000] }
];

const SourcingMap = ({ viewType, searchPos }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const searchMarker = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'satellite': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          }
        },
        layers: [{
          id: 'satellite',
          type: 'raster',
          source: 'satellite',
          paint: { 'raster-fade-duration': 0 }
        }]
      },
      center: [78.9629, 20.5937],
      zoom: 4.5,
      projection: 'globe'
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add Building Markers
    markerData.forEach((marker) => {
      const el = document.createElement('div');
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.cursor = 'pointer';

      // 3D Building Emoji with enhanced glow
      const building = document.createElement('div');
      building.innerText = '🏢';
      building.style.fontSize = '32px';
      building.style.filter = 'drop-shadow(0 0 15px rgba(59, 130, 246, 1))';
      building.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      // AI Aura Base
      const aura = document.createElement('div');
      aura.style.width = '20px';
      aura.style.height = '6px';
      aura.style.background = 'radial-gradient(ellipse at center, var(--accent-primary) 0%, transparent 70%)';
      aura.style.marginTop = '-5px';
      aura.style.borderRadius = '50%';
      aura.style.animation = 'pulse-red 2s infinite';

      // Floating Label
      const label = document.createElement('div');
      label.innerText = marker.name;
      label.style.background = 'rgba(15, 23, 42, 0.95)';
      label.style.backdropFilter = 'blur(12px)';
      label.style.padding = '6px 14px';
      label.style.borderRadius = '20px';
      label.style.border = '1px solid rgba(59, 130, 246, 0.5)';
      label.style.color = 'white';
      label.style.fontSize = '11px';
      label.style.fontWeight = '800';
      label.style.marginBottom = '6px';
      label.style.whiteSpace = 'nowrap';
      label.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
      label.style.letterSpacing = '0.05em';

      el.appendChild(label);
      el.appendChild(building);
      el.appendChild(aura);

      // Hover effects
      el.onmouseover = () => {
        building.style.transform = 'scale(1.4) translateY(-5px)';
        label.style.borderColor = 'var(--accent-primary)';
        label.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.4)';
      };
      el.onmouseout = () => {
        building.style.transform = 'scale(1) translateY(0)';
        label.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        label.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
      };

      const popup = new maplibregl.Popup({ 
        offset: [0, -50],
        closeButton: false,
        className: 'custom-popup'
      })
      .setHTML(`
        <div style="
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(15px);
          padding: 20px;
          border-radius: 20px;
          border: 1px solid var(--accent-primary);
          color: white;
          min-width: 200px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        ">
          <div style="color: var(--accent-primary); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.1em;">Enterprise HQ</div>
          <h3 style="margin: 0 0 4px; font-size: 1.2rem; font-weight: 800;">${marker.name}</h3>
          <p style="margin: 0; color: #94a3b8; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
            Active Sourcing in ${marker.city}
          </p>
          <button style="
            width: 100%;
            margin-top: 16px;
            padding: 10px;
            background: var(--gradient-main);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
          ">View Opportunities</button>
        </div>
      `);

      new maplibregl.Marker(el)
        .setLngLat(marker.pos)
        .setPopup(popup)
        .addTo(map.current);
    });

    // Handle immediate resize
    map.current.on('load', () => {
      map.current.resize();
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  // HIGH-PRIORITY FLY-TO LOGIC
  useEffect(() => {
    if (!searchPos || !map.current) return;

    const flyToLocation = () => {
      const [lat, lng] = searchPos;
      
      // Update or create the search marker
      if (searchMarker.current) searchMarker.current.remove();
      
      const el = document.createElement('div');
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.border = '3px solid #ef4444';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
      el.style.boxShadow = '0 0 20px #ef4444';
      el.className = 'pulse-animation'; // Assuming we add this to CSS

      searchMarker.current = new maplibregl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current);

      map.current.flyTo({
        center: [lng, lat],
        zoom: 12,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    };

    // If map is already loaded, fly immediately. Otherwise wait for load.
    if (map.current.loaded()) {
      flyToLocation();
    } else {
      map.current.once('load', flyToLocation);
    }
  }, [searchPos]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '600px',
      position: 'relative', 
      borderRadius: '24px', 
      overflow: 'hidden',
      background: '#000'
    }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '12px 24px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '40px',
        border: '1px solid var(--accent-primary)',
        color: 'white',
        zIndex: 10,
        pointerEvents: 'none',
        fontSize: '0.9rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
        LIVE SATELLITE FEED
      </div>
    </div>
  );
};

export default SourcingMap;
