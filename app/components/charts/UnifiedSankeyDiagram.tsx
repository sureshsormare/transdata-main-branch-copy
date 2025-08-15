"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey'

// Force cache refresh - professional hover effects v2

// Unified color scheme
const UNIFIED_COLORS = {
  leftNode: '#3B82F6',
  rightNode: '#10B981',
  link: '#6B7280',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB'
}

// Color palette for different suppliers/countries
const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#EF4444'  // Red
]

interface SupplierCustomerData {
  supplier: {
    name: string
    totalValue: number
    totalShipments: number
    marketShare: number
    totalCustomers: number
  }
  customers: Array<{
    name: string
    value: number
    shipments: number
    percentage: number
  }>
}

interface GeographicData {
  country: {
    name: string
    totalValue: number
    totalShipments: number
    marketShare: number
    totalImporters: number
  }
  importers: Array<{
    name: string
    value: number
    shipments: number
    percentage: number
  }>
}

interface UnifiedSankeyData {
  nodes: Array<{
    id: string
    name: string
    category: 'source' | 'supplier' | 'customer' | 'country' | 'importer'
    value: number // Proportional value for Sankey diagram display
    marketValue?: number // Actual market value for sorting and tooltips
    marketShare?: number // Market share percentage
    shipments?: number // Number of shipments
    totalValue?: number // Total value for this node
    color?: string // Assigned color for the node and its links
  }>
  links: Array<{
    source: string
    target: string
    value: number
    color?: string // Added to preserve link color
    flowValue?: number // Actual flow value in currency
    flowShare?: number // Flow share percentage
  }>
}

interface UnifiedSankeyDiagramProps {
  width?: number
  height?: number
  data?: {
    topSuppliers?: SupplierCustomerData[]
    topCountries?: GeographicData[]
    summary: {
      totalValue: number
      totalShipments: number
    }
  }
  type: 'supplier-customer' | 'geographic'
  title: string
  subtitle: string
  leftLabel: string
  rightLabel: string
}

function transformToUnifiedSankeyData(apiData: any, type: 'supplier-customer' | 'geographic'): UnifiedSankeyData {
  const nodes: UnifiedSankeyData['nodes'] = []
  const links: UnifiedSankeyData['links'] = []
  
  if (type === 'supplier-customer' && apiData.topSuppliers) {
    // Process supplier-customer data
    apiData.topSuppliers.forEach((supplierData: SupplierCustomerData, supplierIndex: number) => {
      const supplierColor = COLOR_PALETTE[supplierIndex % COLOR_PALETTE.length]
      
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
      })
      
      // Add customer nodes and links
      supplierData.customers.forEach((customer, customerIndex) => {
        const customerId = `customer-${supplierIndex}-${customerIndex}`
        
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
        })
        
        links.push({
          source: `supplier-${supplierIndex}`,
          target: customerId,
          value: customer.value, // Use actual value for proportional link width
          color: supplierColor,
          flowValue: customer.value,
          flowShare: customer.percentage
        })
      })
    })
  } else if (type === 'geographic' && apiData.topCountries) {
    // Process geographic data
    apiData.topCountries.forEach((countryData: GeographicData, countryIndex: number) => {
      const countryColor = COLOR_PALETTE[countryIndex % COLOR_PALETTE.length]
      
      // Add country node
      nodes.push({
        id: `country-${countryIndex}`,
        name: countryData.country.name,
        category: 'country',
        value: countryData.country.totalValue, // Use actual total value for proportional height
        marketValue: countryData.country.totalValue,
        marketShare: countryData.country.marketShare,
        shipments: countryData.country.totalShipments,
        totalValue: countryData.country.totalValue,
        color: countryColor
      })
      
      // Add importer nodes and links
      countryData.importers.forEach((importer, importerIndex) => {
        const importerId = `importer-${countryIndex}-${importerIndex}`
        
        nodes.push({
          id: importerId,
          name: importer.name,
          category: 'importer',
          value: importer.value, // Use actual value for proportional height
          marketValue: importer.value,
          marketShare: importer.percentage,
          shipments: importer.shipments,
          totalValue: importer.value,
          color: countryColor // Same color as country
        })
        
        links.push({
          source: `country-${countryIndex}`,
          target: importerId,
          value: importer.value, // Use actual value for proportional link width
          color: countryColor,
          flowValue: importer.value,
          flowShare: importer.percentage
        })
      })
    })
  }
  
  return { nodes, links }
}



export default function UnifiedSankeyDiagram({ 
  width = 800, 
  height = 800,
  data,
  type,
  title,
  subtitle,
  leftLabel,
  rightLabel
}: UnifiedSankeyDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [tooltipData, setTooltipData] = useState<{ supplier: string; customer: string; value: number } | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; showBelow: boolean; anchor: 'center' | 'left' | 'right' }>({ x: 0, y: 0, showBelow: false, anchor: 'center' })

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

  // Tooltip helper functions
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}Bn`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}Mn`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toLocaleString()}`
  }

  const handleNodeHover = (event: React.MouseEvent, node: any) => {
    const marketValue = node.marketValue || 0
    const marketShare = node.marketShare || 0
    const shipments = node.shipments || 0
    
    let tooltipHeading = ''
    let tooltipContent = ''
    
    if (node.category === 'supplier') {
      tooltipHeading = `🏭 ${node.name}`
      tooltipContent = `${node.name} is a major supplier with total sales of **${formatCurrency(marketValue)}**, handling **${marketShare.toFixed(1)}%** of all supplier business through **${shipments.toLocaleString()} shipments**.`
    } else if (node.category === 'customer') {
      // Find the supplier for this customer
      const supplierLink = sankeyData.links.find((link: any) => link.target === node.id)
      const supplierNode = supplierLink ? sankeyData.nodes.find((n: any) => n.id === supplierLink.source) : null
      const supplierName = supplierNode?.name || 'Unknown Supplier'
      const supplierValue = supplierNode?.marketValue || 0
      
      // Calculate percentage of supplier's sales
      const percentageOfSupplier = supplierValue > 0 ? (marketValue / supplierValue) * 100 : 0
      
      tooltipHeading = `👥 ${node.name}`
      tooltipContent = `${node.name} is a key customer of **${supplierName}**, making purchases worth **${formatCurrency(marketValue)}** which represents **${percentageOfSupplier.toFixed(1)}%** of ${supplierName}'s sales and **${marketShare.toFixed(1)}%** of all customer business.`
    } else if (node.category === 'country') {
      tooltipHeading = `🌍 ${node.name}`
      tooltipContent = `${node.name} is a major importing country with total imports of **${formatCurrency(marketValue)}**, representing **${marketShare.toFixed(1)}%** of all geographic trade through **${shipments.toLocaleString()} shipments**.`
    } else if (node.category === 'importer') {
      // Find the country for this importer
      const countryLink = sankeyData.links.find((link: any) => link.target === node.id)
      const countryNode = countryLink ? sankeyData.nodes.find((n: any) => n.id === countryLink.source) : null
      const countryName = countryNode?.name || 'Unknown Country'
      const countryValue = countryNode?.marketValue || 0
      
      // Calculate percentage of country's imports
      const percentageOfCountry = countryValue > 0 ? (marketValue / countryValue) * 100 : 0
      
      tooltipHeading = `📦 ${node.name}`
      tooltipContent = `${node.name} is a key importer for **${countryName}**, handling imports worth **${formatCurrency(marketValue)}** which represents **${percentageOfCountry.toFixed(1)}%** of ${countryName}'s imports and **${marketShare.toFixed(1)}%** of all importer business.`
    }
    
    // Convert node hover to standard tooltip format
    const tooltipSupplier = node.category === 'supplier' ? node.name : 
                           node.category === 'customer' ? 'Multiple Suppliers' :
                           node.category === 'country' ? node.name :
                           'Multiple Countries'
    
    const tooltipCustomer = node.category === 'customer' ? node.name :
                           node.category === 'importer' ? node.name :
                           node.category === 'supplier' ? 'Multiple Customers' :
                           'Multiple Importers'
    
    setTooltipData({ 
      supplier: tooltipSupplier, 
      customer: tooltipCustomer, 
      value: marketValue 
    })
  }

  const handleLinkHover = (event: React.MouseEvent, link: any) => {
    const linkId = `${link.source.id}-${link.target.id}`
    setHoveredLink(linkId)
    
    const sourceName = link.source.name
    const targetName = link.target.name
    
    // Find the original link to get additional data
    const originalLink = sankeyData.links.find((l: any) => 
      l.source === link.source.id && l.target === link.target.id
    )
    
    // Unified tooltip data model (match homepage)
    let tooltipSupplier = ''
    let tooltipCustomer = ''
    let tooltipValue = 0
    
    if (link.source.category === 'supplier' && link.target.category === 'customer') {
      const flowValueCurrency = originalLink?.flowValue || 0
      const supplierValue = link.source.marketValue || 0
      
      // Calculate percentage of supplier's business
      const percentageOfSupplier = supplierValue > 0 ? (flowValueCurrency / supplierValue) * 100 : 0
      
      tooltipSupplier = sourceName
      tooltipCustomer = targetName
      tooltipValue = flowValueCurrency
    } else if (link.source.category === 'country' && link.target.category === 'importer') {
      const flowValueCurrency = originalLink?.flowValue || 0
      const countryValue = link.source.marketValue || 0
      
      // Calculate percentage of country's imports
      const percentageOfCountry = countryValue > 0 ? (flowValueCurrency / countryValue) * 100 : 0
      
      tooltipSupplier = sourceName
      tooltipCustomer = targetName
      tooltipValue = flowValueCurrency
    }
    
    // Calculate tooltip position based on link midpoint in container-relative coords
    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();

      // Calculate the middle point of the link for better arrow positioning
      const sourceShift = link.source.x0 < chartWidth / 2 ? leftNodeShift : 0;
      const targetShift = link.target.x0 < chartWidth / 2 ? leftNodeShift : 0;

      // Calculate link midpoint in SVG coordinates
      const linkMidX = (link.source.x1 + link.target.x0) / 2;
      const linkMidY = (link.y0 + sourceShift + link.y1 + targetShift) / 2;

      // Convert SVG coordinates to container-relative coordinates
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        const svgRect = svgElement.getBoundingClientRect();
        const scaleX = svgRect.width / width;
        const scaleY = svgRect.height / height;

        const svgOffsetX = svgRect.left - containerRect.left;
        const svgOffsetY = svgRect.top - containerRect.top;

        const xLocal = svgOffsetX + (linkMidX * scaleX);
        const yLocal = svgOffsetY + (linkMidY * scaleY);

        // Clamp within container bounds
        const padding = 12;
        const clampedX = Math.max(padding, Math.min(containerRect.width - padding, xLocal));
        const clampedY = Math.max(padding, Math.min(containerRect.height - padding, yLocal));

        // Decide arrow placement relative to viewport
        const yViewport = containerRect.top + clampedY;
        const showBelow = yViewport > window.innerHeight - 200;
        const anchor: 'center' | 'left' | 'right' = clampedX <= padding + 1 ? 'left' : (clampedX >= containerRect.width - padding - 1 ? 'right' : 'center')

        setTooltipData({ supplier: tooltipSupplier, customer: tooltipCustomer, value: tooltipValue })
        setTooltipPosition({ x: clampedX, y: clampedY, showBelow, anchor })
      } else {
        // Fallback to cursor position if SVG calculation fails
        const padding = 12
        const xLocal = event.clientX - containerRect.left
        const yLocal = event.clientY - containerRect.top
        const clampedX = Math.max(padding, Math.min(containerRect.width - padding, xLocal))
        const clampedY = Math.max(padding, Math.min(containerRect.height - padding, yLocal))
        const showBelow = event.clientY > window.innerHeight - 200
        const anchor: 'center' | 'left' | 'right' = clampedX <= padding + 1 ? 'left' : (clampedX >= containerRect.width - padding - 1 ? 'right' : 'center')
        setTooltipData({ supplier: tooltipSupplier, customer: tooltipCustomer, value: tooltipValue })
        setTooltipPosition({ x: clampedX, y: clampedY, showBelow, anchor })
      }
    } else {
      // Fallback to cursor position
      setTooltipData({ supplier: tooltipSupplier, customer: tooltipCustomer, value: tooltipValue })
    }
  }

  // Match homepage: keep tooltip following the cursor on move
  const handleLinkMove = (event: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const padding = 12
    const xLocal = event.clientX - rect.left
    const yLocal = event.clientY - rect.top
    const clampedX = Math.max(padding, Math.min(rect.width - padding, xLocal))
    const clampedY = Math.max(padding, Math.min(rect.height - padding, yLocal))
    const showBelow = event.clientY > window.innerHeight - 200
    const anchor: 'center' | 'left' | 'right' = clampedX <= padding + 1 ? 'left' : (clampedX >= rect.width - padding - 1 ? 'right' : 'center')
    setTooltipPosition({ x: clampedX, y: clampedY, showBelow, anchor })
  }

  const handleMouseLeave = () => {
    setTooltipData(null)
    setHoveredLink(null)
  }

  // Transform API data to unified Sankey format
  const sankeyData = data ? transformToUnifiedSankeyData(data, type) : { nodes: [], links: [] }
  
  // Check if we have valid data
  if (sankeyData.nodes.length === 0 || sankeyData.links.length === 0) {
    return (
      <div 
        ref={containerRef} 
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 text-lg font-medium">No trade data available for visualization</div>
          </div>
        </div>
      </div>
    )
  }

  // Validate that all link sources and targets exist in nodes
  const nodeIds = new Set(sankeyData.nodes.map(n => n.id))
  const validLinks = sankeyData.links.filter(link => {
    const isValid = nodeIds.has(link.source) && nodeIds.has(link.target)
    if (!isValid) {
      console.error(`Invalid link: source=${link.source}, target=${link.target}`)
    }
    return isValid
  })

  if (validLinks.length === 0) {
    return (
      <div 
        ref={containerRef} 
        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 text-lg font-medium">No valid connections found in data</div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate layout using D3 Sankey
  const margin = { top: 60, right: 150, bottom: 10, left: 150 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  // Create Sankey layout
  const sankeyLayout = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .nodeAlign(sankeyCenter) // Center align nodes for better curves
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])

  // Ensure links reference node objects, not just IDs
  const nodesWithObjects = sankeyData.nodes.map(d => ({ ...d }))
  const linksWithObjects = validLinks.map(link => {
    const sourceNode = nodesWithObjects.find(n => n.id === link.source)
    const targetNode = nodesWithObjects.find(n => n.id === link.target)
    if (sourceNode && targetNode) {
      return {
        ...link,
        source: sourceNode,
        target: targetNode
      }
    }
    return null
  }).filter(link => link !== null)

  const { nodes: sankeyNodes, links: sankeyLinks } = sankeyLayout({
    nodes: nodesWithObjects,
    links: linksWithObjects
  })

  // Define vertical shift for left nodes
  const leftNodeShift = 20 // Shift down by 20 pixels
  
  // Custom link path generator that accounts for node shifts
  const customLinkPath = (link: any) => {
    // Check if source node is on the left side
    const sourceShift = link.source.x0 < chartWidth / 2 ? leftNodeShift : 0
    const targetShift = link.target.x0 < chartWidth / 2 ? leftNodeShift : 0
    
    // Create a modified link object with shifted positions
    const modifiedLink = {
      ...link,
      source: {
        ...link.source,
        y0: link.source.y0 + sourceShift,
        y1: link.source.y1 + sourceShift
      },
      target: {
        ...link.target,
        y0: link.target.y0 + targetShift,
        y1: link.target.y1 + targetShift
      },
      y0: link.y0 + sourceShift,
      y1: link.y1 + targetShift
    }
    
    return sankeyLinkHorizontal()(modifiedLink) || undefined
  }

  return (
    <div 
      ref={containerRef} 
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl pt-4 px-4 pb-0 md:pt-6 md:px-6 md:pb-1 shadow-xl border border-gray-200"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 md:mb-3 gap-3">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            </div>
            {title}
          </h3>
          <p className="text-gray-600 text-xs">Unified Professional Analysis</p>
        </div>
      </div>
      
      <div className="relative">
        <svg
          width={width}
          height={height}
          className="w-full h-auto"
        >
          {/* Links - Enhanced hover effects */}
          {sankeyLinks.map((link: any, index: number) => {
            // Use custom path generator that accounts for node shifts
            const linkPath = customLinkPath(link)
            const linkId = `${link.source.id}-${link.target.id}`
            const isHovered = hoveredLink === linkId
            
            return (
              <g key={`link-group-${index}`}>
                {/* Background glow effect for hovered link */}
                {isHovered && (
                  <motion.path
                    d={linkPath}
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
                  d={linkPath}
                  stroke={link.color || UNIFIED_COLORS.link}
                  strokeWidth={Math.max(1, link.width)}
                  fill="none"
                  strokeOpacity={0.6}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ 
                    opacity: isInView ? 0.6 : 0, 
                    pathLength: isInView ? 1 : 0,
                    strokeWidth: isHovered ? Math.max(3, link.width + 2) : Math.max(1, link.width),
                    strokeOpacity: isHovered ? 0.9 : 0.6
                  }}
                  transition={{ 
                    duration: isHovered ? 0.2 : 1, 
                    delay: isHovered ? 0 : index * 0.1 + 0.5,
                    pathLength: { duration: 1.5, delay: index * 0.1 + 0.5 }
                  }}
                  onMouseEnter={(e) => handleLinkHover(e, link)}
                  onMouseMove={handleLinkMove}
                  onMouseLeave={handleMouseLeave}
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
                      <mpath href={`#particle-path-${index}`} />
                    </animateMotion>
                  </motion.circle>
                )}
                
                {/* Hidden path for particle animation - uses same custom path as main link */}
                <path
                  id={`particle-path-${index}`}
                  d={customLinkPath(link)}
                  fill="none"
                  stroke="none"
                  style={{ display: 'none' }}
                />
              </g>
            )
          })}

          {/* Nodes */}
          {sankeyNodes.map((node: any, index: number) => {
            // Apply vertical shift to left nodes
            const nodeShift = node.x0 < chartWidth / 2 ? leftNodeShift : 0
            
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
                y={node.y0 + nodeShift}
                width={node.x1 - node.x0}
                height={node.y1 - node.y0}
                fill={node.color || UNIFIED_COLORS.leftNode}
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
                onMouseEnter={(e) => handleNodeHover(e, node)}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  cursor: 'pointer',
                  filter: isConnectedToHoveredLink ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))' : 'none'
                }}
              />
            )
          })}

          {/* Labels */}
          {sankeyNodes.map((node: any, index: number) => {
            // Apply vertical shift to left nodes
            const nodeShift = node.x0 < chartWidth / 2 ? leftNodeShift : 0
            
            return (
              <motion.text
                key={`label-${index}`}
                x={node.x0 < chartWidth / 2 ? node.x0 - 10 : node.x1 + 10}
                y={(node.y1 - node.y0) / 2 + node.y0 + nodeShift}
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
                {(node.name || '').length > 25 ? (node.name || '').substring(0, 22) + '...' : node.name || ''}
              </motion.text>
            )
          })}

          {/* Title */}
          <motion.text
            x={width / 2}
            y={30}
            textAnchor="middle"
            fontSize="18px"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            fill={UNIFIED_COLORS.text}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.text>

          {/* Subtitle */}
          <motion.text
            x={width / 2}
            y={55}
            textAnchor="middle"
            fontSize="12px"
            fontWeight="500"
            fontFamily="system-ui, -apple-system, sans-serif"
            fill={UNIFIED_COLORS.textSecondary}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.text>
        </svg>
      </div>

      {/* Tooltip - match homepage structure and arrow behavior */}
      {tooltipData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
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
    </div>
  )
} 