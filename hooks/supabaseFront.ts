// supabasefront.ts

import { FoodItemProps } from "../components/food-item";
import { supabase } from './supabaseClient';


// Define the shape of your Foods table row
export type Food = {
  id: number
  name: string
  expdate: string // ISO date string (Supabase will handle date format)
  user_id: string // uuid
}
const TABS = ["Fresh Goods", "Nearing Date", "Time to Toss"] as const;
export type TabKey = typeof TABS[number];



// On app startup, check if a user is signed in
export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error(error)
    return null
  }
  return data.session?.user?.id ?? null
}


// ----------------- Function #1 -----------------
// Insert multiple foods at once
// Helper to compute expire date
function generateExpireDate(daysFromNow: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  // Format to YYYY-MM-DD (Postgres date format)
  return date.toISOString().split('T')[0]
}

// Updated insertFoods
export async function insertFoods(
  foods: { name: string; daysUntilExpire: number; user_id: string }[]
) {
  const foodsWithDates = foods.map(f => ({
    name: f.name,
    user_id: f.user_id,
    expdate: generateExpireDate(f.daysUntilExpire),
  }))

  const { data, error } = await supabase
    .from('Foods')
    .insert(foodsWithDates)

  if (error) throw error
  return data
}

// ----------------- Function #2 -----------------
// Get all foods for a given user_id
export async function getFoodsByUser(userid: string): Promise<Food[]> {

  const { data, error } = await supabase
    .from('Foods')
    .select('*')
    .eq('user_id', userid)

  if (error) throw error
  //return data as Food[]
    return data as Food[]
}

export function processFoods(foods: Food[]): Record<TabKey, FoodItemProps[]> {

    const foodData: Record<TabKey, FoodItemProps[]> = {
      "Fresh Goods": [
      ],
      "Nearing Date": [
      ],
      "Time to Toss": [
      ],
    };

    for (const food of foods) {
        const today = new Date();
        const expireDate = new Date(food.expdate);
        const diffTime = expireDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log("DiffDays (ms):", diffDays, food.name);
        if (diffDays > 1) { foodData["Fresh Goods"].push({ name: food.name, shelfLife: `${diffDays} days` }) }
        else if (diffDays === 1) { foodData["Nearing Date"].push({ name: food.name, shelfLife: `1 day`}) }
        else { foodData["Time to Toss"].push({ name: food.name, shelfLife: `0 days`}) }
    }
    return foodData

}

// ----------------- Function #3 -----------------
// Delete a single food by its primary key id
export async function deleteFoodById(id: number) {
  const { data, error } = await supabase
    .from('Foods')
    .delete()
    .eq('id', id)

  if (error) throw error
  return data
}