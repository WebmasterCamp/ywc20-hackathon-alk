"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    MapPin,
    Navigation,
    X,
    Search,
    Crosshair,
    ChevronDown,
    Home,
} from "lucide-react";

// Declare Leaflet types for window object
declare global {
    interface Window {
        L: {
            map: (element: HTMLElement, options?: MapOptions) => LeafletMap;
            tileLayer: (
                url: string,
                options?: TileLayerOptions
            ) => LeafletTileLayer;
            control: {
                zoom: (options?: ZoomControlOptions) => LeafletControl;
            };
            divIcon: (options?: DivIconOptions) => LeafletIcon;
            marker: (
                latlng: [number, number],
                options?: MarkerOptions
            ) => LeafletMarker;
        };
    }
}

// Leaflet options interfaces
interface MapOptions {
    zoomControl?: boolean;
    attributionControl?: boolean;
}

interface TileLayerOptions {
    maxZoom?: number;
}

interface ZoomControlOptions {
    position?: string;
}

interface DivIconOptions {
    html?: string;
    className?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
}

interface MarkerOptions {
    icon?: LeafletIcon;
    draggable?: boolean;
}

// Leaflet type definitions
interface LeafletMap {
    setView: (latlng: [number, number], zoom: number) => LeafletMap;
    on: (event: string, handler: (e: LeafletEvent) => void) => void;
    remove: () => void;
    removeLayer: (layer: LeafletMarker) => void;
    addLayer: (layer: LeafletMarker) => void;
}

interface LeafletTileLayer {
    addTo: (map: LeafletMap) => LeafletTileLayer;
}

interface LeafletControl {
    addTo: (map: LeafletMap) => LeafletControl;
}

interface LeafletIcon {
    options?: DivIconOptions;
}

interface LeafletMarker {
    addTo: (map: LeafletMap) => LeafletMarker;
    on: (event: string, handler: (e: LeafletDragEvent) => void) => void;
    setLatLng: (latlng: [number, number]) => LeafletMarker;
    getLatLng: () => { lat: number; lng: number };
    bindPopup: (
        content: string,
        options?: { maxWidth?: number; className?: string }
    ) => LeafletMarker;
    openPopup: () => LeafletMarker;
}

interface LeafletEvent {
    latlng: { lat: number; lng: number };
}

interface LeafletDragEvent {
    target: {
        getLatLng: () => { lat: number; lng: number };
    };
}

// Search result interface
interface SearchResult {
    lat: string;
    lon: string;
    display_name: string;
    place_id: string;
    osm_type: string;
    osm_id: string;
}

interface LocationData {
    latitude: number;
    longitude: number;
    address: string;
    shortAddress: string;
}

interface TempleData {
    id: string;
    name: string;
    address: string;
    distance: number;
    rating: number;
    reviewCount: number;
    phone?: string;
    openTime: string;
    services: string[];
    image?: string;
    latitude: number;
    longitude: number;
}

interface LocationPickerProps {
    onLocationSelected?: (location: LocationData) => void;
    placeholder?: string;
    className?: string;
    temples?: TempleData[];
    showTemples?: boolean;
    onTempleSelected?: (temple: TempleData) => void;
}

const LocationPicker = ({
    onLocationSelected,
    placeholder = "เลือกที่อยู่สำหรับค้นหาวัด",
    className = "",
    temples = [],
    showTemples = true,
    onTempleSelected,
}: LocationPickerProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker | null>(null);
    const templeMarkersRef = useRef<LeafletMarker[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [tempLocation, setTempLocation] = useState({
        latitude: 13.7563, // Default to Bangkok
        longitude: 100.5018,
    });
    const [address, setAddress] = useState("");
    const [shortAddress, setShortAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showTemplesOnMap, setShowTemplesOnMap] = useState(showTemples);

    const updateTempLocation = useCallback((lat: number, lng: number) => {
        setTempLocation({ latitude: lat, longitude: lng });
    }, []);

    // Add temple markers to map
    const addTempleMarkers = useCallback(() => {
        if (
            !mapInstanceRef.current ||
            !showTemplesOnMap ||
            temples.length === 0
        )
            return;

        // Clear existing temple markers
        templeMarkersRef.current.forEach((marker) => {
            mapInstanceRef.current?.removeLayer?.(marker);
        });
        templeMarkersRef.current = [];

        // Create temple markers
        temples.forEach((temple) => {
            const templeIcon = window.L.divIcon({
                html: `<div style="background: #16a34a; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); position: relative; display: flex; align-items: center; justify-content: center;">
                    <div style="color: white; font-size: 10px; font-weight: bold;">🏛️</div>
                </div>`,
                className: "temple-marker",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });

            const templeMarker = window.L.marker(
                [temple.latitude, temple.longitude],
                {
                    icon: templeIcon,
                }
            ).addTo(mapInstanceRef.current!);

            // Add click handler for temple marker
            templeMarker.on("click", () => {
                // Show detailed popup
                const popupContent = `
                    <div style="font-family: system-ui; min-width: 280px; max-width: 320px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937; line-height: 1.3;">${
                                temple.name
                            }</h3>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">${
                                temple.address
                            }</p>
                        </div>

                        <div style="display: flex; flex-wrap: gap: 12px; margin-bottom: 12px; font-size: 13px;">
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <span>⭐</span>
                                <span style="font-weight: 500;">${temple.rating.toFixed(
                                    1
                                )}</span>
                                <span style="color: #6b7280;">(${
                                    temple.reviewCount
                                } รีวิว)</span>
                            </div>
                            ${
                                temple.distance > 0
                                    ? `
                                <div style="display: flex; align-items: center; gap: 4px; color: #6b7280;">
                                    <span>📍</span>
                                    <span>${temple.distance.toFixed(
                                        1
                                    )} กม.</span>
                                </div>
                            `
                                    : ""
                            }
                        </div>

                        ${
                            temple.openTime
                                ? `
                            <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280;">
                                <span>🕐</span> เปิด ${temple.openTime}
                            </div>
                        `
                                : ""
                        }

                        ${
                            temple.phone
                                ? `
                            <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280;">
                                <span>📞</span> ${temple.phone}
                            </div>
                        `
                                : ""
                        }

                        ${
                            temple.services && temple.services.length > 0
                                ? `
                            <div style="margin-bottom: 16px;">
                                <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">บริการ:</div>
                                <div style="display: flex; flex-wrap: gap: 4px;">
                                    ${temple.services
                                        .slice(0, 3)
                                        .map(
                                            (service) =>
                                                `<span style="background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${service}</span>`
                                        )
                                        .join("")}
                                    ${
                                        temple.services.length > 3
                                            ? `<span style="background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 4px; font-size: 11px;">+${
                                                  temple.services.length - 3
                                              } อื่นๆ</span>`
                                            : ""
                                    }
                                </div>
                            </div>
                        `
                                : ""
                        }

                        <div style="display: flex; gap: 8px;">
                            <button 
                                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
                                    temple.latitude
                                },${temple.longitude}', '_blank')"
                                style="flex: 1; background: #f3f4f6; color: #374151; border: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
                                onmouseover="this.style.background='#e5e7eb'"
                                onmouseout="this.style.background='#f3f4f6'"
                            >
                                <span>🗺️</span>
                                <span>นำทาง</span>
                            </button>
                        </div>

                        <div style="margin-top: 8px;">
                            <button 
                                onclick="document.dispatchEvent(new CustomEvent('templeSelected', {detail: '${
                                    temple.id
                                }'}))"
                                style="width: 100%; background: #eab308; color: white; border: none; padding: 10px 12px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;"
                                onmouseover="this.style.background='#ca8a04'"
                                onmouseout="this.style.background='#eab308'"
                            >
                                ดูรายละเอียดและจองบริการ
                            </button>
                        </div>
                    </div>
                `;

                templeMarker
                    .bindPopup(popupContent, {
                        maxWidth: 320,
                        className: "temple-popup",
                    })
                    .openPopup();
            });

            templeMarkersRef.current.push(templeMarker);
        });
    }, [temples, showTemplesOnMap]);

    // Remove temple markers
    const removeTempleMarkers = useCallback(() => {
        templeMarkersRef.current.forEach((marker) => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer?.(marker);
            }
        });
        templeMarkersRef.current = [];
    }, []);

    // Listen for temple selection events
    useEffect(() => {
        const handleTempleSelected = (event: CustomEvent) => {
            const templeId = event.detail;
            const selectedTemple = temples.find((t) => t.id === templeId);
            if (selectedTemple && onTempleSelected) {
                onTempleSelected(selectedTemple);
            }
        };

        document.addEventListener(
            "templeSelected",
            handleTempleSelected as EventListener
        );
        return () => {
            document.removeEventListener(
                "templeSelected",
                handleTempleSelected as EventListener
            );
        };
    }, [temples, onTempleSelected]);

    // Reverse geocode using Nominatim
    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th,en`
            );
            const data = await response.json();

            if (data.display_name) {
                setAddress(data.display_name);
                // Create short address from the display name
                const parts = data.display_name.split(", ");
                const shortAddr = parts.slice(0, 3).join(", ");
                setShortAddress(shortAddr);
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            setAddress("ไม่สามารถดึงที่อยู่ได้");
            setShortAddress("ไม่สามารถดึงที่อยู่ได้");
        }
    }, []);

    // Load Leaflet when map is opened
    useEffect(() => {
        if (!isMapOpen) return;

        const loadLeaflet = async () => {
            // Load CSS
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                document.head.appendChild(link);
            }

            // Load JS
            if (!window.L) {
                const script = document.createElement("script");
                script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
                script.async = true;
                script.onload = initializeMap;
                document.head.appendChild(script);
            } else {
                initializeMap();
            }
        };

        const initializeMap = () => {
            if (!mapRef.current || mapInstanceRef.current) return;

            // Initialize map
            const map = window.L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false,
            }).setView([tempLocation.latitude, tempLocation.longitude], 16);

            // Add tile layer
            window.L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,
                }
            ).addTo(map);

            // Add zoom control to bottom right
            window.L.control
                .zoom({
                    position: "bottomright",
                })
                .addTo(map);

            // Custom marker icon
            const customIcon = window.L.divIcon({
                html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); position: relative;">
          <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #ef4444;"></div>
        </div>`,
                className: "custom-marker",
                iconSize: [24, 24],
                iconAnchor: [12, 24],
            });

            // Add initial marker
            const marker = window.L.marker(
                [tempLocation.latitude, tempLocation.longitude],
                {
                    icon: customIcon,
                    draggable: true,
                }
            ).addTo(map);

            // Handle marker drag
            marker.on("dragend", (e: LeafletDragEvent) => {
                const position = e.target.getLatLng();
                updateTempLocation(position.lat, position.lng);
                reverseGeocode(position.lat, position.lng);
            });

            // Handle map click
            map.on("click", (e: LeafletEvent) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                updateTempLocation(lat, lng);
                reverseGeocode(lat, lng);
            });

            mapInstanceRef.current = map;
            markerRef.current = marker;
            setMapLoaded(true);

            // Get initial address
            reverseGeocode(tempLocation.latitude, tempLocation.longitude);
        };

        loadLeaflet();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                setMapLoaded(false);
            }
        };
    }, [
        isMapOpen,
        tempLocation.latitude,
        tempLocation.longitude,
        updateTempLocation,
        reverseGeocode,
    ]);

    // Manage temple markers when map loads or data changes
    useEffect(() => {
        if (mapLoaded && mapInstanceRef.current) {
            if (showTemplesOnMap && temples.length > 0) {
                addTempleMarkers();
            } else {
                removeTempleMarkers();
            }
        }
    }, [
        mapLoaded,
        temples,
        showTemplesOnMap,
        addTempleMarkers,
        removeTempleMarkers,
    ]);

    // Search for places
    const searchPlaces = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&countrycodes=th&limit=5&accept-language=th,en`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        }
    };

    // Handle search input
    const handleSearchInput = (value: string) => {
        setSearchQuery(value);
        searchPlaces(value);
    };

    // Select search result
    const selectSearchResult = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
        }

        updateTempLocation(lat, lng);
        setAddress(result.display_name);

        // Create short address
        const parts = result.display_name.split(", ");
        const shortAddr = parts.slice(0, 3).join(", ");
        setShortAddress(shortAddr);

        setSearchQuery("");
        setSearchResults([]);
    };

    // Get current GPS location
    const getCurrentLocation = () => {
        setLoading(true);

        if (!navigator.geolocation) {
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                updateTempLocation(lat, lng);

                // Update map and marker
                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView([lat, lng], 16);
                    markerRef.current.setLatLng([lat, lng]);
                }

                reverseGeocode(lat, lng);
                setLoading(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    // Confirm location selection
    const confirmLocation = () => {
        const locationData: LocationData = {
            latitude: tempLocation.latitude,
            longitude: tempLocation.longitude,
            address: address,
            shortAddress: shortAddress || address,
        };

        setLocation(locationData);
        setIsMapOpen(false);

        if (onLocationSelected) {
            onLocationSelected(locationData);
        }
    };

    // Open map
    const openMap = () => {
        setIsMapOpen(true);
        // Focus search input after opening
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    };

    return (
        <>
            {/* Location Display Button */}
            <button
                onClick={openMap}
                className={`w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-yellow-normal transition-colors text-left ${className}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-light p-2 rounded-lg">
                            <MapPin className="w-5 h-5 text-yellow-normal" />
                        </div>
                        <div className="">
                            {location ? (
                                <div>
                                    <p className="text-sm text-gray-500">
                                        ที่อยู่ที่เลือก
                                    </p>
                                    <p className="font-medium text-gray-800">
                                        {location.shortAddress}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-500">
                                        กำหนดที่อยู่
                                    </p>
                                    <p className="font-medium text-gray-600 truncate">
                                        {placeholder}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
            </button>

            {/* Map Modal */}
            {isMapOpen && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-white shadow-sm border-b px-4 py-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                เลือกที่อยู่
                            </h2>
                            <button
                                onClick={() => setIsMapOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 bg-white border-b">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="ค้นหาที่อยู่ หรือสถานที่..."
                                value={searchQuery}
                                onChange={(e) =>
                                    handleSearchInput(e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-normal focus:border-transparent"
                            />

                            {/* Current Location Button */}
                            <button
                                onClick={getCurrentLocation}
                                disabled={loading}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-normal hover:bg-yellow-normal-hover disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Navigation className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            selectSearchResult(result)
                                        }
                                        className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {result.display_name}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Map Container */}
                    <div className="flex-1 relative">
                        <div ref={mapRef} className="w-full h-full" />

                        {/* Map Loading */}
                        {!mapLoaded && (
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-yellow-normal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-gray-600">
                                        กำลังโหลดแผนที่...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Center Location Button */}
                        {mapLoaded && (
                            <button
                                onClick={() => {
                                    if (mapInstanceRef.current) {
                                        mapInstanceRef.current.setView(
                                            [
                                                tempLocation.latitude,
                                                tempLocation.longitude,
                                            ],
                                            16
                                        );
                                    }
                                }}
                                className="absolute top-4 right-4 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg border border-gray-200 transition-colors"
                            >
                                <Crosshair className="w-5 h-5 text-gray-600" />
                            </button>
                        )}

                        {/* Toggle Temples Button */}
                        {mapLoaded && temples.length > 0 && (
                            <button
                                onClick={() =>
                                    setShowTemplesOnMap(!showTemplesOnMap)
                                }
                                className={`absolute top-16 right-4 p-3 rounded-full shadow-lg border border-gray-200 transition-colors ${
                                    showTemplesOnMap
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-white hover:bg-gray-50 text-gray-600"
                                }`}
                                title={
                                    showTemplesOnMap
                                        ? "ซ่อนวัดบนแผนที่"
                                        : "แสดงวัดบนแผนที่"
                                }
                            >
                                <div className="w-5 h-5 flex items-center justify-center text-sm">
                                    🏛️
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Bottom Panel */}
                    <div className="bg-white border-t p-4 space-y-4">
                        {/* Selected Address Display */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Home className="w-5 h-5 text-yellow-normal mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 mb-1">
                                        ที่อยู่ที่เลือก:
                                    </p>
                                    <p className="text-gray-800 font-medium text-sm leading-relaxed break-words">
                                        {address || "กรุณาเลือกตำแหน่งบนแผนที่"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={confirmLocation}
                            disabled={!address}
                            className="w-full bg-yellow-normal hover:bg-yellow-normal-hover disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                            ยืนยันที่อยู่นี้
                        </button>

                        {/* Instructions */}
                        <p className="text-xs text-gray-500 text-center">
                            💡 แตะบนแผนที่เพื่อเลือกตำแหน่ง
                            หรือลากจุดแดงเพื่อปรับตำแหน่ง
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default LocationPicker;
