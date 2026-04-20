import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkzijumigtwjkobdzhno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhremlqdW1pZ3R3amtvYmR6aG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczMzk4NiwiZXhwIjoyMDkxMzA5OTg2fQ.FKO5t2-B3NyoJyWliyAOzL9IHT2cBbqolbmhI0yN1Og';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('products').select('id, name, slug, short_description');
  if (error) {
    console.error(error);
    return;
  }
  
  const sealers = data.filter(d => 
    d.name.includes("V.100") || 
    d.name.includes("V.200") || 
    d.name.includes("V.300") || 
    d.name.includes("V.333") || 
    d.name.includes("V.350") ||
    d.name.includes("V.400") ||
    d.name.includes("V.430") ||
    d.name.includes("V.500") ||
    d.slug.includes('v')
  );
  
  console.log(JSON.stringify(sealers, null, 2));
}

main();
