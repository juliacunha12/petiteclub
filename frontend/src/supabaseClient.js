import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjuzseukocsdoyqchfiw.supabase.co'
const supabaseKey = 'sb_publishable_tAMnOcSA7Oc3otkud739OQ__P9CyfJH'

export const supabase = createClient(supabaseUrl, supabaseKey)
