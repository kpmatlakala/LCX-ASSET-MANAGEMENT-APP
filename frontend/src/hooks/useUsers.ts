import { supabase } from "@/lib/supabase"
import axios, { AxiosResponse } from "axios";

export default function useUsers() {
    const getAllusers = async (): Promise<any> => {
        try {
            const { data } = await supabase.from("admins").select("*");
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    return { getAllusers }
}