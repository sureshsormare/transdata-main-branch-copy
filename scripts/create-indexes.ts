/**
 * Script to create MongoDB indexes for optimized search performance
 * Run this script to create text indexes that will reduce query time from 20s to 3s
 * 
 * Usage: npx ts-node scripts/create-indexes.ts
 */

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function createOptimizedIndexes() {
  console.log('🚀 Creating optimized MongoDB indexes for fast search...')
  
  try {
    // Create compound text index for exp_india
    console.log('📚 Creating text index for exp_india collection...')
    await prisma.$runCommandRaw({
      createIndexes: 'exp_india',
      indexes: [
        {
          key: {
            product_description: 'text',
            hs_code: 'text'
          },
          name: 'product_hs_text_index',
          weights: {
            product_description: 10,
            hs_code: 8
          },
          default_language: 'english',
          language_override: 'language'
        }
      ]
    })
    
    // Create optimized compound indexes for exact matches
    console.log('📚 Creating compound indexes for exact matches...')
    await prisma.$runCommandRaw({
      createIndexes: 'exp_india',
      indexes: [
        // Compound index for product search with sorting
        {
          key: {
            product_description: 1,
            total_value_usd: -1
          },
          name: 'product_value_compound_idx'
        },
        // Compound index for HS code search with sorting
        {
          key: {
            hs_code: 1,
            total_value_usd: -1
          },
          name: 'hs_value_compound_idx'
        },
        // Index for date filtering
        {
          key: {
            shipping_bill_date: 1,
            product_description: 1
          },
          name: 'date_product_compound_idx'
        }
      ]
    })
    
    // Create the same indexes for imp_india
    console.log('📚 Creating indexes for imp_india collection...')
    await prisma.$runCommandRaw({
      createIndexes: 'imp_india',
      indexes: [
        {
          key: {
            product_description: 'text',
            hs_code: 'text'
          },
          name: 'product_hs_text_index',
          weights: {
            product_description: 10,
            hs_code: 8
          }
        },
        {
          key: {
            product_description: 1,
            total_value_usd: -1
          },
          name: 'product_value_compound_idx'
        },
        {
          key: {
            hs_code: 1,
            total_value_usd: -1
          },
          name: 'hs_value_compound_idx'
        }
      ]
    })
    
    console.log('✅ All indexes created successfully!')
    
    // Verify indexes
    console.log('\n📊 Verifying indexes...')
    const expIndexes = await prisma.$runCommandRaw({
      listIndexes: 'exp_india'
    })
    
    console.log('exp_india indexes:', JSON.stringify(expIndexes, null, 2))
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    
    // If text index already exists, that's fine
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('ℹ️ Some indexes already exist, which is fine.')
    } else {
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createOptimizedIndexes()
  .then(() => {
    console.log('\n✅ Index creation completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Index creation failed:', error)
    process.exit(1)
  })