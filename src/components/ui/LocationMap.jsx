import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom marker icon that works in React/Vite
const customIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 30px;
    height: 30px;
    background: #2563EB;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Coordenadas de Camiri, Bolivia
const CAMIRI_CENTER = [-20.0433, -63.5313]

function LocationMarker({ position, setPosition, readOnly }) {
  useMapEvents({
    click(e) {
      if (!readOnly && setPosition) {
        setPosition([e.latlng.lat, e.latlng.lng])
      }
    },
  })

  return position ? <Marker position={position} icon={customIcon} /> : null
}

function RecenterMap({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, 16)
    }
  }, [position, map])
  return null
}

export function LocationMap({ onLocationSelect, position: externalPosition, readOnly = false }) {
  const [internalPosition, setInternalPosition] = useState(
    externalPosition || CAMIRI_CENTER
  )

  // Update internal position when external position changes
  useEffect(() => {
    if (externalPosition) {
      setInternalPosition(externalPosition)
    }
  }, [externalPosition])

  const currentPosition = externalPosition || internalPosition

  const handlePositionChange = (newPos) => {
    setInternalPosition(newPos)
    if (onLocationSelect) {
      onLocationSelect({
        lat: newPos[0],
        lng: newPos[1],
      })
    }
  }

  return (
    <div className="w-full" style={{ height: '400px' }}>
      <MapContainer
        center={currentPosition}
        zoom={readOnly ? 16 : 14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={!readOnly}
        dragging={!readOnly}
        zoomControl={!readOnly}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={currentPosition}
          setPosition={readOnly ? null : handlePositionChange}
          readOnly={readOnly}
        />
        <RecenterMap position={currentPosition} />
      </MapContainer>
    </div>
  )
}
