-- Database Optimization Script for TransData Nexus
-- Run this script to improve search performance

-- 1. Create indexes for faster search queries
CREATE INDEX IF NOT EXISTS idx_product_description ON exp_india(product_description);
CREATE INDEX IF NOT EXISTS idx_hs_code ON exp_india(hs_code);
CREATE INDEX IF NOT EXISTS idx_year ON exp_india(year DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_name ON exp_india(supplier_name);
CREATE INDEX IF NOT EXISTS idx_buyer_name ON exp_india(buyer_name);
CREATE INDEX IF NOT EXISTS idx_country_origin ON exp_india(country_of_origin);
CREATE INDEX IF NOT EXISTS idx_country_destination ON exp_india(country_of_destination);
CREATE INDEX IF NOT EXISTS idx_shipping_date ON exp_india(shipping_bill_date);
CREATE INDEX IF NOT EXISTS idx_total_value_usd ON exp_india(total_value_usd);

-- 2. Create composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_product_supplier ON exp_india(product_description, supplier_name);
CREATE INDEX IF NOT EXISTS idx_product_buyer ON exp_india(product_description, buyer_name);
CREATE INDEX IF NOT EXISTS idx_year_month ON exp_india(year, month);
CREATE INDEX IF NOT EXISTS idx_country_route ON exp_india(country_of_origin, country_of_destination);

-- 3. Create partial indexes for non-null values
CREATE INDEX IF NOT EXISTS idx_supplier_name_not_null ON exp_india(supplier_name) WHERE supplier_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_buyer_name_not_null ON exp_india(buyer_name) WHERE buyer_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_total_value_not_null ON exp_india(total_value_usd) WHERE total_value_usd IS NOT NULL;

-- 4. Create text search indexes (if using PostgreSQL full-text search)
CREATE INDEX IF NOT EXISTS idx_product_description_gin ON exp_india USING gin(to_tsvector('english', product_description));
CREATE INDEX IF NOT EXISTS idx_supplier_name_gin ON exp_india USING gin(to_tsvector('english', supplier_name));
CREATE INDEX IF NOT EXISTS idx_buyer_name_gin ON exp_india USING gin(to_tsvector('english', buyer_name));

-- 5. Analyze table statistics
ANALYZE exp_india;

-- 6. Create materialized view for common aggregations (optional)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_country_stats AS
SELECT 
    country_of_origin,
    country_of_destination,
    COUNT(*) as shipment_count,
    SUM(CAST(total_value_usd AS DECIMAL)) as total_value,
    AVG(CAST(total_value_usd AS DECIMAL)) as avg_value,
    MIN(shipping_bill_date) as first_shipment,
    MAX(shipping_bill_date) as last_shipment
FROM exp_india 
WHERE country_of_origin IS NOT NULL 
   OR country_of_destination IS NOT NULL
GROUP BY country_of_origin, country_of_destination;

-- 7. Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_country_stats ON mv_country_stats(country_of_origin, country_of_destination);

-- 8. Create materialized view for supplier/buyer statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_supplier_buyer_stats AS
SELECT 
    supplier_name,
    buyer_name,
    COUNT(*) as transaction_count,
    SUM(CAST(total_value_usd AS DECIMAL)) as total_value,
    AVG(CAST(total_value_usd AS DECIMAL)) as avg_value
FROM exp_india 
WHERE supplier_name IS NOT NULL 
   OR buyer_name IS NOT NULL
GROUP BY supplier_name, buyer_name;

-- 9. Create index on supplier/buyer materialized view
CREATE INDEX IF NOT EXISTS idx_mv_supplier_buyer ON mv_supplier_buyer_stats(supplier_name, buyer_name);

-- 10. Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_country_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_supplier_buyer_stats;
END;
$$ LANGUAGE plpgsql;

-- 11. Create scheduled job to refresh views (run this manually or set up a cron job)
-- SELECT refresh_analytics_views();

-- 12. Create function for optimized search
CREATE OR REPLACE FUNCTION search_products_optimized(
    search_query TEXT,
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    import_country TEXT DEFAULT NULL,
    export_country TEXT DEFAULT NULL,
    supplier_name TEXT DEFAULT NULL,
    buyer_name TEXT DEFAULT NULL
)
RETURNS TABLE(
    id TEXT,
    product_description TEXT,
    supplier_name TEXT,
    buyer_name TEXT,
    country_of_origin TEXT,
    country_of_destination TEXT,
    total_value_usd TEXT,
    shipping_bill_date TEXT,
    year TEXT,
    month TEXT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_results AS (
        SELECT 
            ei.id,
            ei.product_description,
            ei.supplier_name,
            ei.buyer_name,
            ei.country_of_origin,
            ei.country_of_destination,
            ei.total_value_usd,
            ei.shipping_bill_date,
            ei.year,
            ei.month
        FROM exp_india ei
        WHERE (
            ei.product_description ILIKE '%' || search_query || '%'
            OR ei.hs_code ILIKE '%' || search_query || '%'
        )
        AND (import_country IS NULL OR ei.country_of_destination = import_country)
        AND (export_country IS NULL OR ei.country_of_origin = export_country)
        AND (supplier_name IS NULL OR ei.supplier_name = supplier_name)
        AND (buyer_name IS NULL OR ei.buyer_name = buyer_name)
        ORDER BY ei.year DESC, ei.shipping_bill_date DESC
        LIMIT page_size
        OFFSET (page_num - 1) * page_size
    ),
    total_count AS (
        SELECT COUNT(*) as count
        FROM exp_india ei
        WHERE (
            ei.product_description ILIKE '%' || search_query || '%'
            OR ei.hs_code ILIKE '%' || search_query || '%'
        )
        AND (import_country IS NULL OR ei.country_of_destination = import_country)
        AND (export_country IS NULL OR ei.country_of_origin = export_country)
        AND (supplier_name IS NULL OR ei.supplier_name = supplier_name)
        AND (buyer_name IS NULL OR ei.buyer_name = buyer_name)
    )
    SELECT 
        fr.id,
        fr.product_description,
        fr.supplier_name,
        fr.buyer_name,
        fr.country_of_origin,
        fr.country_of_destination,
        fr.total_value_usd,
        fr.shipping_bill_date,
        fr.year,
        fr.month,
        tc.count as total_count
    FROM filtered_results fr
    CROSS JOIN total_count tc;
END;
$$ LANGUAGE plpgsql;

-- 13. Create function for analytics
CREATE OR REPLACE FUNCTION get_analytics_optimized(
    search_query TEXT,
    import_country TEXT DEFAULT NULL,
    export_country TEXT DEFAULT NULL,
    supplier_name TEXT DEFAULT NULL,
    buyer_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH filtered_data AS (
        SELECT *
        FROM exp_india ei
        WHERE (
            ei.product_description ILIKE '%' || search_query || '%'
            OR ei.hs_code ILIKE '%' || search_query || '%'
        )
        AND (import_country IS NULL OR ei.country_of_destination = import_country)
        AND (export_country IS NULL OR ei.country_of_origin = export_country)
        AND (supplier_name IS NULL OR ei.supplier_name = supplier_name)
        AND (buyer_name IS NULL OR ei.buyer_name = buyer_name)
    ),
    aggregates AS (
        SELECT 
            COUNT(*) as total_records,
            COUNT(DISTINCT buyer_name) as unique_buyers,
            COUNT(DISTINCT supplier_name) as unique_suppliers,
            SUM(CAST(total_value_usd AS DECIMAL)) as total_value_usd
        FROM filtered_data
    ),
    country_stats AS (
        SELECT 
            json_build_object(
                'topImportCountries', (
                    SELECT json_agg(json_build_object('country', country_of_destination, 'count', count))
                    FROM (
                        SELECT country_of_destination, COUNT(*) as count
                        FROM filtered_data
                        WHERE country_of_destination IS NOT NULL
                        GROUP BY country_of_destination
                        ORDER BY count DESC
                        LIMIT 5
                    ) t
                ),
                'topExportCountries', (
                    SELECT json_agg(json_build_object('country', country_of_origin, 'count', count))
                    FROM (
                        SELECT country_of_origin, COUNT(*) as count
                        FROM filtered_data
                        WHERE country_of_origin IS NOT NULL
                        GROUP BY country_of_origin
                        ORDER BY count DESC
                        LIMIT 5
                    ) t
                )
            ) as country_data
    )
    SELECT json_build_object(
        'aggregates', aggregates,
        'countryStats', country_stats
    ) INTO result
    FROM aggregates, country_stats;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 14. Grant necessary permissions
GRANT EXECUTE ON FUNCTION search_products_optimized(TEXT, INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT) TO your_app_user;
GRANT EXECUTE ON FUNCTION get_analytics_optimized(TEXT, TEXT, TEXT, TEXT, TEXT) TO your_app_user;
GRANT EXECUTE ON FUNCTION refresh_analytics_views() TO your_app_user;

-- 15. Create a cron job or scheduled task to refresh materialized views
-- This should be run periodically (e.g., every hour) to keep statistics fresh
-- Example cron job: 0 * * * * psql -d your_database -c "SELECT refresh_analytics_views();"

-- 16. Monitor query performance
-- Run this to see which indexes are being used:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY idx_scan DESC;

-- 17. Clean up old data (optional - run carefully)
-- DELETE FROM exp_india WHERE shipping_bill_date < '2020-01-01';
-- VACUUM ANALYZE exp_india;

COMMENT ON FUNCTION search_products_optimized IS 'Optimized search function with pagination and filtering';
COMMENT ON FUNCTION get_analytics_optimized IS 'Optimized analytics function for aggregated data';
COMMENT ON FUNCTION refresh_analytics_views IS 'Refresh materialized views for analytics'; 