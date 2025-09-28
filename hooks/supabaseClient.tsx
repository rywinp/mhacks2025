import { createClient } from '@supabase/supabase-js';
//import { REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY } from '@env';

export const supabase = createClient("https://zrmjikvmsxwlpngwrpey.supabase.co",
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybWppa3Ztc3h3bHBuZ3dycGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY4MjIsImV4cCI6MjA3NDU2MjgyMn0.HbLYr7balLZ4pn9UJRxGR7T_Ud7Kk2pZBOvFmuraoqk");