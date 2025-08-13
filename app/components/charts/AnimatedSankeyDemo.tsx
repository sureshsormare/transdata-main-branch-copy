"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, Users, Globe, DollarSign, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

// Professional unified color scheme
const UNIFIED_COLORS = {
  supplier: '#3B82F6', // Blue
  customer: '#10B981', // Green
  link: '#6B7280', // Gray
  text: '#1F2937', // Dark gray
  textSecondary: '#6B7280', // Gray
  border: '#E5E7EB', // Light gray
  background: '#F9FAFB' // Very light gray
};

// Professional color palette for different nodes
const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#F97316', // Orange
  '#EF4444', // Red
  '#84CC16'  // Lime
];

// Professional Paracetamol trade flow data
const paracetamolData = {
  suppliers: [
    { id: 'supplier1', name: 'Pfizer Inc.', marketShare: 25, value: 2800000 },
    { id: 'supplier2', name: 'Novartis AG', marketShare: 22, value: 2400000 },
    { id: 'supplier3', name: 'Roche Holding', marketShare: 20, value: 2200000 },
    { id: 'supplier4', name: 'Merck & Co.', marketShare: 18, value: 2000000 },
    { id: 'supplier5', name: 'GSK Plc', marketShare: 15, value: 1600000 }
  ],
  customers: [
    { id: 'customer1', name: 'J&J', marketShare: 13, value: 1430000 }, // Increased from 12% to 13%
    { id: 'customer2', name: 'AstraZeneca', marketShare: 11, value: 1210000 }, // Increased from 10% to 11%
    { id: 'customer3', name: 'Sanofi', marketShare: 9, value: 990000 }, // Increased from 8% to 9%
    { id: 'customer4', name: 'Bayer', marketShare: 8, value: 880000 }, // Increased from 7% to 8%
    { id: 'customer5', name: 'Eli Lilly', marketShare: 7, value: 770000 }, // Increased from 6% to 7%
    { id: 'customer6', name: 'AbbVie', marketShare: 7, value: 770000 }, // Increased from 6% to 7%
    { id: 'customer7', name: 'Amgen', marketShare: 6, value: 660000 }, // Increased from 5% to 6%
    { id: 'customer8', name: 'BMS', marketShare: 6, value: 660000 }, // Increased from 5% to 6%
    { id: 'customer9', name: 'Gilead', marketShare: 5, value: 550000 }, // Increased from 4% to 5%
    { id: 'customer10', name: 'Takeda', marketShare: 5, value: 550000 }, // Increased from 4% to 5%
    { id: 'customer11', name: 'Moderna', marketShare: 5, value: 550000 }, // Increased from 4% to 5%
    { id: 'customer12', name: 'Regeneron', marketShare: 5, value: 550000 }, // Increased from 4% to 5%
    { id: 'customer13', name: 'Biogen', marketShare: 4, value: 440000 }, // Increased from 3% to 4%
    { id: 'customer14', name: 'Vertex', marketShare: 4, value: 440000 }, // Increased from 3% to 4%
    { id: 'customer15', name: 'Incyte', marketShare: 4, value: 440000 } // Increased from 3% to 4%
  ],
  flows: [
    // Supplier 1 connections (3 customers)
    { from: 'supplier1', to: 'customer1', value: 600000 }, // J&J (13%)
    { from: 'supplier1', to: 'customer7', value: 400000 }, // Amgen (6%)
    { from: 'supplier1', to: 'customer13', value: 300000 }, // Biogen (4%)

    // Supplier 2 connections (3 customers)
    { from: 'supplier2', to: 'customer2', value: 500000 }, // AstraZeneca (11%)
    { from: 'supplier2', to: 'customer8', value: 350000 }, // BMS (6%)
    { from: 'supplier2', to: 'customer14', value: 250000 }, // Vertex (4%)

    // Supplier 3 connections (3 customers)
    { from: 'supplier3', to: 'customer3', value: 450000 }, // Sanofi (9%)
    { from: 'supplier3', to: 'customer9', value: 300000 }, // Gilead (5%)
    { from: 'supplier3', to: 'customer15', value: 200000 }, // Incyte (4%)

    // Supplier 4 connections (3 customers)
    { from: 'supplier4', to: 'customer4', value: 400000 }, // Bayer (8%)
    { from: 'supplier4', to: 'customer10', value: 300000 }, // Takeda (5%)
    { from: 'supplier4', to: 'customer11', value: 250000 }, // Moderna (5%)

    // Supplier 5 connections (3 customers)
    { from: 'supplier5', to: 'customer5', value: 350000 }, // Eli Lilly (7%)
    { from: 'supplier5', to: 'customer6', value: 350000 }, // AbbVie (7%)
    { from: 'supplier5', to: 'customer12', value: 250000 } // Regeneron (5%)
  ]
};

export default function AnimatedSankeyDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ supplier: string; customer: string; value: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, showBelow: false, anchor: 'center' as 'center' | 'left' | 'right' });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 750 }); // Better proportions for beautiful curves
  // Static real Paracetamol data from database (for demo purposes)
  const staticRealData = {
    "type": "supplier-customer",
    "dateRange": "All available data",
    "topSuppliers": [
      {
        "supplier": {
          "name": "Ipca Laboratories Limited",
          "totalValue": 284904413.91039455,
          "totalShipments": 1427,
          "marketShare": 19.08716342096183,
          "totalCustomers": 69
        },
        "customers": [
          {
            "name": "Confidential Customer",
            "value": 242645221.45848376,
            "shipments": 669,
            "percentage": 85.16723841800437
          },
          {
            "name": "Ipca Laboratories Uk Limited",
            "value": 8842981.684911992,
            "shipments": 170,
            "percentage": 3.1038415879696424
          },
          {
            "name": "Centrafarm Services B.V.(I)",
            "value": 7517973.481011051,
            "shipments": 151,
            "percentage": 2.6387704485952725
          },
          {
            "name": "Msj Limited (Unicorn)",
            "value": 3231727.4275599997,
            "shipments": 5,
            "percentage": 1.1343198875733853
          },
          {
            "name": "Apotex Pty Limited",
            "value": 2856078.120484,
            "shipments": 65,
            "percentage": 1.0024688916831828
          }
        ]
      },
      {
        "supplier": {
          "name": "Adcock Ingram Limited",
          "totalValue": 69400839.0024417,
          "totalShipments": 2870,
          "marketShare": 4.649507311627989,
          "totalCustomers": 15
        },
        "customers": [
          {
            "name": "Adcock Ingram Limited",
            "value": 59846580.6751246,
            "shipments": 2584,
            "percentage": 86.23322359693525
          },
          {
            "name": "Teva Pharmaceuticals (Pty) LTD",
            "value": 4297091.837819998,
            "shipments": 65,
            "percentage": 6.191700128681175
          },
          {
            "name": "Oethmaan Biosims Pty Limited",
            "value": 1876054.3772340005,
            "shipments": 95,
            "percentage": 2.703215702000369
          },
          {
            "name": "Inova Pharmaceuticals Pty Limited",
            "value": 1218647.66426,
            "shipments": 36,
            "percentage": 1.7559552330730823
          },
          {
            "name": "Inova Pharmaceuticals (Singapore)",
            "value": 643480.19921,
            "shipments": 28,
            "percentage": 0.9271936888073654
          }
        ]
      },
      {
        "supplier": {
          "name": "Fourrts (India) Laboratories Private Limited",
          "totalValue": 68918092.71656701,
          "totalShipments": 151,
          "marketShare": 4.617165737403553,
          "totalCustomers": 27
        },
        "customers": [
          {
            "name": "Cameg",
            "value": 37931222.116679996,
            "shipments": 35,
            "percentage": 55.03811934070227
          },
          {
            "name": "M/S. Moraf Pharmaceuticals LTD",
            "value": 10044827.765999999,
            "shipments": 5,
            "percentage": 14.575022856930214
          },
          {
            "name": "M/S. T.Choithram And Sons (Lib) INC",
            "value": 8561747.219999999,
            "shipments": 3,
            "percentage": 12.423076267085765
          },
          {
            "name": "M/S. Delmaw Enterprises LTD",
            "value": 8491093.590000002,
            "shipments": 14,
            "percentage": 12.320558006328653
          },
          {
            "name": "M/S. Drogueria Bikasa",
            "value": 1380730.2400000002,
            "shipments": 3,
            "percentage": 2.0034365223634385
          }
        ]
      },
      {
        "supplier": {
          "name": "Sanofi India Limited",
          "totalValue": 67622988.56135997,
          "totalShipments": 263,
          "marketShare": 4.530400269932143,
          "totalCustomers": 10
        },
        "customers": [
          {
            "name": "Alloga Uk Ap7",
            "value": 55330022.39593002,
            "shipments": 58,
            "percentage": 81.82132078608812
          },
          {
            "name": "Sanofi-Aventis Australia Pty Limited",
            "value": 8126006.753410002,
            "shipments": 142,
            "percentage": 12.016633583173567
          },
          {
            "name": "Sanofi Aventis Australia Pty Limited",
            "value": 1829224.82104,
            "shipments": 24,
            "percentage": 2.705033983199651
          },
          {
            "name": "Phoenix Labs C/O",
            "value": 684015.4244,
            "shipments": 13,
            "percentage": 1.011513153961446
          },
          {
            "name": "Alloga Uk",
            "value": 492760.32999999996,
            "shipments": 6,
            "percentage": 0.7286875964567545
          }
        ]
      },
      {
        "supplier": {
          "name": "Lincoln Pharmaceuticals LTD",
          "totalValue": 54308855.45284905,
          "totalShipments": 279,
          "marketShare": 3.6384202863208226,
          "totalCustomers": 44
        },
        "customers": [
          {
            "name": "Heko Pharmacy LTD",
            "value": 43076263.96140801,
            "shipments": 68,
            "percentage": 79.31720085466876
          },
          {
            "name": "Generics And Specialities LTD",
            "value": 4277434.149999999,
            "shipments": 5,
            "percentage": 7.876126488641742
          },
          {
            "name": "Universal CO. LTD",
            "value": 2226246.69,
            "shipments": 4,
            "percentage": 4.0992333044706255
          },
          {
            "name": "Medical Stores Department",
            "value": 2029858.38,
            "shipments": 3,
            "percentage": 3.7376195154072485
          },
          {
            "name": "To The Order",
            "value": 519129.45359,
            "shipments": 9,
            "percentage": 0.9558836201965409
          }
        ]
      }
    ],
    "summary": {
      "totalValue": 1492649314.2375882,
      "totalShipments": 47183,
      "averageValue": 31635.320226301596,
      "supplierCount": 1464
    }
  };

  // Transform static real data to D3 Sankey format
  const sankeyData = useMemo(() => {
    // Always use static real data (no API calls)
    if (staticRealData && staticRealData.topSuppliers && staticRealData.topSuppliers.length > 0) {
      return transformRealDataToSankey(staticRealData);
    }
    
    // Fallback to demo data
    const nodes = [
      // Suppliers
      ...paracetamolData.suppliers.map((supplier, index) => ({
        id: supplier.id,
        name: supplier.name,
        category: 'supplier' as const,
        value: supplier.value,
        marketShare: supplier.marketShare,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length]
      })),
      // Customers
      ...paracetamolData.customers.map((customer, index) => ({
        id: customer.id,
        name: customer.name,
        category: 'customer' as const,
        value: customer.value,
        marketShare: customer.marketShare,
        color: COLOR_PALETTE[(index + 5) % COLOR_PALETTE.length]
      }))
    ];

    const links = paracetamolData.flows.map(flow => ({
      source: flow.from,
      target: flow.to,
      value: flow.value,
      flowValue: flow.value
    }));

    return { nodes, links };
  }, []);

  // Function to transform real API data to Sankey format (same as UnifiedSankeyDiagram)
  function transformRealDataToSankey(apiData: any) {
    const nodes: any[] = [];
    const links: any[] = [];
    
    if (apiData.topSuppliers) {
      // Process supplier-customer data (exact same logic as UnifiedSankeyDiagram)
      apiData.topSuppliers.forEach((supplierData: any, supplierIndex: number) => {
        const supplierColor = COLOR_PALETTE[supplierIndex % COLOR_PALETTE.length];
        
        // Add supplier node
        nodes.push({
          id: `supplier-${supplierIndex}`,
          name: supplierData.supplier.name,
          category: 'supplier',
          value: supplierData.supplier.totalValue, // Use actual total value for proportional height
          marketValue: supplierData.supplier.totalValue,
          marketShare: supplierData.supplier.marketShare,
          shipments: supplierData.supplier.totalShipments,
          totalValue: supplierData.supplier.totalValue,
          color: supplierColor
        });
        
        // Add customer nodes and links
        supplierData.customers.forEach((customer: any, customerIndex: number) => {
          const customerId = `customer-${supplierIndex}-${customerIndex}`;
          
          nodes.push({
            id: customerId,
            name: customer.name,
            category: 'customer',
            value: customer.value, // Use actual value for proportional height
            marketValue: customer.value,
            marketShare: customer.percentage,
            shipments: customer.shipments,
            totalValue: customer.value,
            color: supplierColor // Same color as supplier
          });
          
          links.push({
            source: `supplier-${supplierIndex}`,
            target: customerId,
            value: customer.value, // Use actual value for proportional link width
            color: supplierColor,
            flowValue: customer.value,
            flowShare: customer.percentage
          });
        });
      });
    }
    
    // Using static real Paracetamol data for demo purposes
    
    return { nodes, links };
  }

  // D3 Sankey layout calculation (exact same as UnifiedSankeyDiagram)
  const sankeyLayout = useMemo(() => {
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const containerHeight = 750; // Increased height for better proportions
    const width = Math.min(1000, Math.max(700, containerWidth - 48)); // Constrained width
    const height = containerHeight;

    // Validate data
    if (sankeyData.nodes.length === 0 || sankeyData.links.length === 0) {
      return null;
    }

    // Same margins and layout as UnifiedSankeyDiagram
    const margin = { top: 80, right: 150, bottom: 50, left: 150 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create Sankey layout with exact same settings
    const sankeyGenerator = sankey()
      .nodeWidth(15)  // Same as UnifiedSankeyDiagram
      .nodePadding(10)  // Same as UnifiedSankeyDiagram
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    // Prepare data exactly like UnifiedSankeyDiagram
    const nodeIds = new Set(sankeyData.nodes.map(n => n.id));
    const validLinks = sankeyData.links.filter(link => {
      const hasValidSource = nodeIds.has(link.source);
      const hasValidTarget = nodeIds.has(link.target);
      return hasValidSource && hasValidTarget;
    });

    // Ensure links reference node objects, not just IDs (same as UnifiedSankeyDiagram)
    const nodesWithObjects = sankeyData.nodes.map(d => ({ ...d }));
    const linksWithObjects = validLinks.map(link => {
      const sourceNode = nodesWithObjects.find(n => n.id === link.source);
      const targetNode = nodesWithObjects.find(n => n.id === link.target);
      if (sourceNode && targetNode) {
        return {
          ...link,
          source: sourceNode,
          target: targetNode
        };
      }
      return null;
    }).filter(link => link !== null);

    try {
      const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
        nodes: nodesWithObjects,
        links: linksWithObjects
      });

      return {
        nodes: sankeyNodes,
        links: sankeyLinks,
        width,
        height,
        chartWidth
      };
    } catch (error) {
      console.error('Sankey layout error:', error);
      return null;
    }
  }, [sankeyData, containerRef.current?.offsetWidth]);

  // Intersection Observer for animation triggering
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Dynamic size calculation based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: Math.max(800, rect.width - 48), // Account for padding
          height: Math.max(750, rect.height - 48)
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Get layout data
  const layout = sankeyLayout;
  if (!layout) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div>Loading Sankey diagram...</div>
        </div>
      </div>
    );
  }

  const { nodes: sankeyNodes, links: sankeyLinks, width, height, chartWidth } = layout;

  // Helper functions for colors and data
  const getNodeColor = (node: any) => {
    return node.color || (node.category === 'supplier' ? UNIFIED_COLORS.supplier : UNIFIED_COLORS.customer);
  };

  const getLinkColor = (link: any) => {
    // After D3 processing, source becomes a node object
    const sourceNode = link.source;
    return sourceNode?.color || UNIFIED_COLORS.link;
  };

  const handleLinkHover = (link: any, event: React.MouseEvent) => {
    // After D3 processing, source and target become node objects
    const sourceNode = link.source;
    const targetNode = link.target;
    
    if (sourceNode && targetNode) {
      const linkId = `${sourceNode.id}-${targetNode.id}`;
      setHoveredLink(linkId);
      setTooltipData({
        supplier: sourceNode.name,
        customer: targetNode.name,
        value: link.value
      });
      
      // Initial position near cursor (container-relative, clamped)
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const padding = 12;
        const xLocal = event.clientX - containerRect.left;
        const yLocal = event.clientY - containerRect.top;
        const clampedX = Math.max(padding, Math.min(containerRect.width - padding, xLocal));
        const clampedY = Math.max(padding, Math.min(containerRect.height - padding, yLocal));
        const showBelow = event.clientY > window.innerHeight - 200;
        const anchor = clampedX <= padding + 1 ? 'left' : (clampedX >= containerRect.width - padding - 1 ? 'right' : 'center');
        setTooltipPosition({ x: clampedX, y: clampedY, showBelow, anchor });
      }
    }
  };

  // Keep tooltip following cursor while hovering
  function handleLinkMove(event: React.MouseEvent) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const padding = 12;
    const xLocal = event.clientX - rect.left;
    const yLocal = event.clientY - rect.top;
    const clampedX = Math.max(padding, Math.min(rect.width - padding, xLocal));
    const clampedY = Math.max(padding, Math.min(rect.height - padding, yLocal));
    const showBelow = event.clientY > window.innerHeight - 200;
    const anchor = clampedX <= padding + 1 ? 'left' : (clampedX >= rect.width - padding - 1 ? 'right' : 'center');
    setTooltipPosition({ x: clampedX, y: clampedY, showBelow, anchor });
  }

  const handleLinkLeave = () => {
    setHoveredLink(null);
    setTooltipData(null);
  };

  const zoomIn = () => {
    // Zoom functionality
  };

  const zoomOut = () => {
    // Zoom functionality
  };

  const resetZoom = () => {
    // Reset functionality
  };

  const startFlowAnimation = () => {
    // Animation functionality
  };

  return (
    <div ref={containerRef} className="relative h-[750px] w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-xl"></div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="text-center">
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-1">
            India's Paracetamol Export Flow
          </h3>
          <p className="text-xs text-gray-600 font-medium">
            Supply chain from Indian manufacturers to global customers
          </p>
        </div>
      </div>

      {/* Data Source Indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className="px-3 py-2 rounded-lg text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Real Database Data
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <motion.button
          onClick={zoomIn}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 hover:bg-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </motion.button>
        <motion.button
          onClick={zoomOut}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 hover:bg-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomOut className="w-4 h-4 text-gray-600" />
        </motion.button>
        <motion.button
          onClick={resetZoom}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 hover:bg-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </motion.button>
      </div>

      {/* SVG Container */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Definitions */}
        <defs>
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
          </filter>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Links - with supplier offset adjustment and professional hover effects */}
        {sankeyLinks.map((link: any, index: number) => {
          // Create custom path with supplier offset
          const sourceOffset = link.source.x0 < chartWidth / 2 ? 40 : 0; // Supplier offset
          const targetOffset = 0; // No offset for customers
          
          const path = `M${link.source.x1},${link.y0 + sourceOffset} 
                        C${(link.source.x1 + link.target.x0) / 2},${link.y0 + sourceOffset} 
                         ${(link.source.x1 + link.target.x0) / 2},${link.y1 + targetOffset} 
                         ${link.target.x0},${link.y1 + targetOffset}`;
          
          const linkId = `${link.source.id}-${link.target.id}`;
          const isHovered = hoveredLink === linkId;
          
          return (
            <g key={`link-group-${index}`}>
              {/* Background glow effect for hovered link */}
              {isHovered && (
                <motion.path
                  d={path}
                  stroke={link.color || UNIFIED_COLORS.link}
                  strokeWidth={Math.max(6, link.width + 4)}
                  fill="none"
                  strokeOpacity={0.2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ duration: 0.2 }}
                  style={{ filter: 'blur(3px)', pointerEvents: 'none' }}
                />
              )}
              
              {/* Main link path */}
              <motion.path
                d={path}
                stroke={link.color || UNIFIED_COLORS.link}
                strokeWidth={Math.max(1, link.width)}
                fill="none"
                strokeOpacity={0.7}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ 
                  opacity: isInView ? 0.7 : 0, 
                  pathLength: isInView ? 1 : 0,
                  strokeWidth: isHovered ? Math.max(3, link.width + 2) : Math.max(1, link.width),
                  strokeOpacity: isHovered ? 0.9 : 0.7
                }}
                transition={{ 
                  duration: isHovered ? 0.2 : 1, 
                  delay: isHovered ? 0 : index * 0.1 + 0.5,
                  pathLength: { duration: 1.5, delay: index * 0.1 + 0.5 }
                }}
                onMouseEnter={(e) => handleLinkHover(link, e)}
                onMouseMove={handleLinkMove}
                onMouseLeave={handleLinkLeave}
                style={{ 
                  cursor: 'pointer',
                  filter: isHovered ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))' : 'none'
                }}
              />
              
              {/* Animated flow particles for hovered link */}
              {isHovered && (
                <motion.circle
                  r="3"
                  fill={link.color || UNIFIED_COLORS.link}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <animateMotion dur="2s" repeatCount="indefinite">
                    <mpath href={`#homepage-particle-path-${index}`} />
                  </animateMotion>
                </motion.circle>
              )}
              
              {/* Hidden path for particle animation */}
              <path
                id={`homepage-particle-path-${index}`}
                d={path}
                fill="none"
                stroke="none"
                style={{ display: 'none' }}
              />
            </g>
          );
        })}

        {/* Nodes - with supplier offset and hover highlighting */}
        {sankeyNodes.map((node: any, index: number) => {
          // Check if this is a supplier node (left side)
          const isSupplier = node.x0 < chartWidth / 2;
          const yOffset = isSupplier ? 40 : 0; // Shift suppliers down by 40px
          
          // Check if this node is connected to the hovered link
          const isConnectedToHoveredLink = hoveredLink && 
            (hoveredLink.includes(node.id) || 
             sankeyLinks.some((link: any) => 
               `${link.source.id}-${link.target.id}` === hoveredLink && 
               (link.source.id === node.id || link.target.id === node.id)
             ))
          
          return (
            <motion.rect
              key={`node-${index}`}
              x={node.x0}
              y={node.y0 + yOffset}
              width={node.x1 - node.x0}
              height={node.y1 - node.y0}
              fill={node.color || UNIFIED_COLORS.supplier}
              rx={4}
              ry={4}
              stroke={isConnectedToHoveredLink ? '#000000' : UNIFIED_COLORS.border}
              strokeWidth={isConnectedToHoveredLink ? 2 : 1}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isInView ? 1 : 0, 
                scale: isInView ? (isConnectedToHoveredLink ? 1.05 : 1) : 0.8 
              }}
              transition={{ 
                duration: isConnectedToHoveredLink ? 0.2 : 0.8, 
                delay: isConnectedToHoveredLink ? 0 : index * 0.1 
              }}
              whileHover={{ 
                strokeWidth: 2, 
                stroke: '#000000',
                scale: 1.05
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ 
                cursor: 'pointer',
                filter: isConnectedToHoveredLink ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))' : 'none'
              }}
            />
          );
        })}

        {/* Labels - with supplier offset */}
        {sankeyNodes.map((node: any, index: number) => {
          // Check if this is a supplier node (left side)
          const isSupplier = node.x0 < chartWidth / 2;
          const yOffset = isSupplier ? 40 : 0; // Same offset as nodes
          
          return (
            <motion.text
              key={`label-${index}`}
              x={node.x0 < chartWidth / 2 ? node.x0 - 10 : node.x1 + 10}
              y={(node.y1 - node.y0) / 2 + node.y0 + yOffset}
            dy="0.35em"
            textAnchor={node.x0 < chartWidth / 2 ? 'end' : 'start'}
            fontSize="11px"
            fontWeight="600"
            fontFamily="system-ui, -apple-system, sans-serif"
            fill={UNIFIED_COLORS.text}
            style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1 + 0.3 
            }}
          >
            {(node.name || '').length > 45 ? (node.name || '').substring(0, 42) + '...' : node.name || ''}
          </motion.text>
          );
        })}


      </svg>

      {/* Tooltip */}
      {tooltipData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute z-50 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-md rounded-xl shadow-2xl border border-blue-200 text-sm min-w-[280px]"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: `${
              tooltipPosition.anchor === 'left'
                ? `translate(0, ${tooltipPosition.showBelow ? '0%' : '-110%'})`
                : tooltipPosition.anchor === 'right'
                ? `translate(-100%, ${tooltipPosition.showBelow ? '0%' : '-110%'})`
                : `translate(-50%, ${tooltipPosition.showBelow ? '0%' : '-110%'})`
            }`
          }}
        >
          {/* Arrow pointer */}
          {tooltipPosition.showBelow ? (
            <div className={`absolute bottom-full ${tooltipPosition.anchor === 'left' ? 'left-4' : tooltipPosition.anchor === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'} w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-blue-200`}></div>
          ) : (
            <div className={`absolute top-full ${tooltipPosition.anchor === 'left' ? 'left-4' : tooltipPosition.anchor === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'} w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-blue-200`}></div>
          )}
          
          <div className="font-bold text-blue-900 mb-2 text-center border-b border-blue-200 pb-2">
            💼 Trade Deal Details
          </div>
          <div className="text-gray-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-700">Supplier:</span>
              <span className="font-medium">{tooltipData.supplier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-700">Customer:</span>
              <span className="font-medium">{tooltipData.customer}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-100">
              <span className="font-bold text-green-700">Total Deal Value:</span>
              <span className="font-bold text-green-700 text-lg">${(tooltipData.value / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200"
        >
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-gray-700">Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className="text-gray-700">Customers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 