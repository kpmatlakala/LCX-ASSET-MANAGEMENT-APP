import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const getAllUsers = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error.message)
        return res.status(500)
    }
}