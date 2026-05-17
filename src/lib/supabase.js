import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mbnjsmdhjpcqmxqyzlhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ibmpzbWRoanBjcW14cXl6bGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTcxNzAsImV4cCI6MjA5NDMzMzE3MH0.RjHezfuM8vNtKz4RZY_P9sN1aS5wrVCXK0NwdAZf_98';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
